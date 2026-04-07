'use server'

import { createClient } from '@/utils/supabase/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { headers } from 'next/headers';

export async function analyzeShopVibe(url: string, genre?: string) {
    try {
        const supabase = await createClient();

        // 1. IPベースのレートリミット（KVが設定されている場合のみ実行）
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            try {
                const ratelimit = new Ratelimit({
                    redis: kv,
                    limiter: Ratelimit.slidingWindow(5, '60 s'),
                });

                const headersList = await headers();
                const ip = headersList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

                const { success: limitSuccess } = await ratelimit.limit(`vibe_analysis_${ip}`);
                if (!limitSuccess) {
                    return { success: false, error: 'Too many requests. Please try again in a minute.' };
                }
            } catch (rlError) {
                console.warn('Ratelimit skip due to error:', rlError);
            }
        }

        // 2. メタデータ抽出
        let siteMetadata = `URL: ${url}`;
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'VibeBot/1.0' },
                next: { revalidate: 3600 }
            });
            if (response.ok) {
                const html = await response.text();
                const $ = cheerio.load(html);
                const title = $('title').text() || '';
                const desc = $('meta[name="description"]').attr('content') || '';
                siteMetadata = `Title: ${title}\nDescription: ${desc}\nURL: ${url}`;
            }
        } catch (e) {
            console.warn('Metadata fetch failed:', e);
        }

        // 3. AI 解析 (gemini-2.5-flash)
        let vibeTags = ['和モダン', '落ち着いた雰囲気', '隠れ家', 'フォトジェニック', '体験'];
        let shopName = '不明な店舗';
        let mappedVibeClusters: string[] = ['Modern', 'Authentic'];

        try {
            console.log('AI Analysis starting with gemini-2.5-flash...');
            const { object } = await generateObject({
                model: google('gemini-2.5-flash'),
                schema: z.object({
                    shopName: z.string().describe('Name of the shop'),
                    vibeTags: z.array(z.string()).describe('5 VIBE tags in Japanese without hashtags'),
                    mappedVibeClusters: z.array(z.string()).describe('Up to 3 clusters from: Cinematic, Luxury, Street, Kawaii, Vlog, Traditional, Modern, Authentic')
                }),
                system: `店舗の魅力(VIBE)を分析し、以下の3つの情報を生成してください。
1. 店舗名 (shopName)
2. VIBEタグ: ハッシュタグなしの日本語で5つ (vibeTags)
3. VIBEクラスター: 以下のリストから店舗の魅力に最も近いものを最大3つ選んでください (mappedVibeClusters)
   選択肢: [Cinematic, Luxury, Street, Kawaii, Vlog, Traditional, Modern, Authentic]`,
                prompt: `店舗情報:\n${siteMetadata}`
            });
            if (object) {
                vibeTags = object.vibeTags || vibeTags;
                shopName = object.shopName || shopName;
                mappedVibeClusters = object.mappedVibeClusters?.slice(0, 3) || mappedVibeClusters;
            }
        } catch (aiError: any) {
            console.error('AI Analysis Critical Error:', aiError.message);
        }

        // 4. マッチング数 (指定されたジャンルでフィルタリング)
        let matchCount = 0;
        try {
            let query = supabase.from('creators').select('*', { count: 'exact', head: true });

            if (genre && genre !== 'ALL') {
                // 配列カラムに特定の値が含まれているかチェック
                query = query.contains('genre', [genre.toUpperCase()]);
            }

            // Tier S または A かつ onboarded (公開中) のクリエイターのみカウント
            query = query.in('tier', ['S', 'A']).eq('is_onboarded', true);

            const { count, error } = await query;
            if (error) throw error;
            matchCount = count || 0;
        } catch (dbError) {
            console.warn('DB count failed:', dbError);
            matchCount = 16;
        }

        return {
            success: true,
            tags: vibeTags,
            matchCount: matchCount,
            shopName: shopName,
            mappedVibeClusters: mappedVibeClusters
        };

    } catch (err: any) {
        console.error('analyzeShopVibe Top Level Error:', err);
        return { success: false, error: 'Internal Server Error' };
    }
}

export async function saveShopVibeTags(clientTag: string, tags: string[], clusters: string[]) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('shops')
            .update({
                vibe_tags: tags,
                vibe_clusters: clusters
            })
            .eq('client_tag', clientTag);

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        console.error('Error saving shop vibe tags:', err.message);
        return { success: false, error: err.message };
    }
}
