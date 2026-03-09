import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

// ランダムな招待コード生成
const generateInviteCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedCreators() {
    const filePath = path.join(process.cwd(), 'public', 'creators.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // CSV Parse
    const { data } = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

    console.log(`📂 CSV Loaded: ${data.length} rows found.`);

    // 1. マッピング処理
    const rawCreators = data.map((row: any) => {
        // ★修正: カンマ区切りのURLをすべて配列にする
        const rawVideoUrls = row.HitVideos_URL
            ? row.HitVideos_URL.split(',').map((u: string) => u.trim())
            : [];

        // メイン動画（サムネ用）は1つ目のまま
        const mainVideo = rawVideoUrls[0] || '';

        // ★追加: ポートフォリオ用には全件入れる (最大5件とかに絞ってもOK)
        const portfolioVideos = rawVideoUrls.slice(0, 5);

        const vibeTags = row.Vibe_Cluster_Hint ? [row.Vibe_Cluster_Hint] : [];

        return {
            invite_code: generateInviteCode(),

            // Identity
            name: row.Creator_Name,
            tiktok_handle: row.Creator_Name, // Handleとして使用
            tiktok_url: row.TikTok_URL,

            // Categorization
            genre: row.Genre,
            tier: row.Tier,
            ethnicity: row.Ethnicity,

            // Visuals
            scouted_video_url: mainVideo,
            portfolio_video_urls: portfolioVideos,
            vibe_tags: vibeTags,

            // Metrics
            followers: parseInt(row.Followers || '0', 10),
            avg_views: parseInt(row.Median_Views || '0', 10),
            engagement_rate: parseFloat(row.Engagement_Rate || '0'),

            // Status
            status: 'invited',
            is_onboarded: false,
            agreed_to_terms: false
        };
    });

    // 2. 重複排除 (tiktok_handleをキーにしてユニーク化)
    // Mapを使うと、後勝ちで上書きされるか、先勝ちになる。今回は「tiktok_handle」ごとのユニークなオブジェクトを作成。
    const uniqueCreatorsMap = new Map();
    rawCreators.forEach((creator: any) => {
        if (!creator.tiktok_handle) return;
        // まだ登録されていない場合のみ追加（最初の1件を採用）
        if (!uniqueCreatorsMap.has(creator.tiktok_handle)) {
            uniqueCreatorsMap.set(creator.tiktok_handle, creator);
        }
    });

    const uniqueCreators = Array.from(uniqueCreatorsMap.values());
    console.log(`✨ Deduplicated: ${data.length} -> ${uniqueCreators.length} unique creators.`);

    // 3. Batch Insert
    const BATCH_SIZE = 100;
    for (let i = 0; i < uniqueCreators.length; i += BATCH_SIZE) {
        const batch = uniqueCreators.slice(i, i + BATCH_SIZE);

        // ★変更: ignoreDuplicates を true にして、既存データの上書きを防ぐ
        const { error } = await supabase
            .from('creators')
            .upsert(batch, { onConflict: 'tiktok_handle', ignoreDuplicates: true });

        if (error) {
            console.error('❌ Error inserting batch:', error);
        } else {
            console.log(`✅ Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} rows)`);
        }
    }

    console.log('🎉 Seeding complete!');
}

seedCreators();