// src/app/actions/analyze-asset-insight.ts
'use server'

import { publicAction } from '@/lib/actions/safe-action';
import { createClient } from '@/utils/supabase/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

type AnalyzePayload = {
    assetId: string;
    creatorId: string;
    shopId: string;
    shopRequirements: string[];
    creatorTags: string[];
};

export const analyzeAssetInsight = async (payload: AnalyzePayload) => {
    return publicAction(payload, async (data: AnalyzePayload, _context) => {
        const supabase = await createClient();

        // 1. Geminiを使用して、B2C/B2B両方のインサイトを同時に生成 (高速な Flash モデルを使用)
        const { object } = await generateObject({
            model: google('gemini-3-flash-preview'), // 安定した最新モデルを使用
            schema: z.object({
                creatorAiHint: z.string().describe('クリエイター向けの撮影・編集改善アドバイス（100文字以内）'),
                shopUpsellPlan: z.enum(['NONE', 'AI_AUTO_TUNE', 'PREMIUM_BOOST']).describe('店舗に提案すべき有料機能'),
                shopUpsellMessage: z.string().describe('店舗に対する有料機能のセールスコピー（短め）')
            }),
            system: `あなたはインバウンド向けショート動画の凄腕プロデューサー兼、広告主向けのトップ営業マンです。
      クリエイターのVibeと店舗の要求Vibeのズレを分析し、
      ①クリエイターには次回の案件獲得に向けたモチベーションの上がる具体的なヒントを、
      ②店舗（広告主）にはAIオートチューンやプレミアムブースト等の有料プランで要件を最適化する提案を出力してください。`,
            prompt: `店舗の要求Vibe: ${data.shopRequirements.join(', ')}\nクリエイターのVibe: ${data.creatorTags.join(', ')}`
        });

        // 不足しているタグの計算
        const missingTags = data.shopRequirements.filter((tag: string) => !data.creatorTags.includes(tag));

        // 2. Supabase の asset_insights テーブルに保存 (失敗してもレスポンスは返す)
        try {
            const { error: dbError } = await supabase
                .from('asset_insights')
                .upsert({
                    asset_id: data.assetId,
                    creator_id: data.creatorId,
                    shop_id: data.shopId,
                    missing_tags: missingTags,
                    creator_ai_hint: object.creatorAiHint,
                    upsell_plan: object.shopUpsellPlan,
                    shop_upsell_message: object.shopUpsellMessage,
                }, { onConflict: 'asset_id' });

            if (dbError) {
                console.warn('Supabase save failed (ignoring for UX):', dbError.message);
            }
        } catch (err) {
            console.warn('DB persistence error (skipping):', err);
        }

        return { success: true, insight: object, missingTags };
    });
};