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

        // フェイルセーフ: タグが空またはundefinedの場合の処理
        const requirements = (data.shopRequirements && data.shopRequirements.length > 0) 
            ? data.shopRequirements 
            : ['#General'];
        const tags = (data.creatorTags && data.creatorTags.length > 0) 
            ? data.creatorTags 
            : ['#Undefined'];

        // タグが両方とも実質的に空（フォールバックのみ）の場合、AI呼び出しをスキップする選択肢もあるが、
        // ここでは「分析不可」という結果をAIに生成させるか、固定のレスポンスを返す。
        // 要件に従い、ダミーのタグを代入して実行する。

        let object;
        try {
            const result = await generateObject({
                model: google('gemini-1.5-flash'), // 安定した最新モデルを使用
                schema: z.object({
                    creatorAiHint: z.string().describe('クリエイター向けの撮影・編集改善アドバイス（100文字以内）'),
                    shopUpsellPlan: z.enum(['NONE', 'AI_AUTO_TUNE', 'PREMIUM_BOOST']).describe('店舗に提案すべき有料機能'),
                    shopUpsellMessage: z.string().describe('店舗に対する有料機能のセールスコピー（短め）')
                }),
                system: `あなたはインバウンド向けショート動画の凄腕プロデューサー兼、広告主向けのトップ営業マンです。
          クリエイターのVibeと店舗の要求Vibeのズレを分析し、
          ①クリエイターには次回の案件獲得に向けたモチベーションの上がる具体的なヒントを、
          ②店舗（広告主）にはAIオートチューンやプレミアムブースト等の有料プランで要件を最適化する提案を出力してください。
          もしタグ情報が不十分な場合は、一般的な改善アドバイスを提供してください。`,
                prompt: `店舗の要求Vibe: ${requirements.join(', ')}\nクリエイターのVibe: ${tags.join(', ')}`
            });
            object = result.object;
        } catch (error) {
            console.error('Gemini API Error:', error);
            // フォールバック用の固定メッセージ
            object = {
                creatorAiHint: "タグ情報が不足しているため、詳細な分析をスキップしました。プロフィールや動画のタグを充実させてください。",
                shopUpsellPlan: 'NONE' as const,
                shopUpsellMessage: "分析に必要なデータが不足しています。"
            };
        }

        // 不足しているタグの計算
        const missingTags = requirements.filter((tag: string) => !tags.includes(tag));

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