'use server'

import { authAction } from '@/lib/actions/safe-action';
import { createClient } from '@/utils/supabase/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

type ShopAnalyzePayload = {
    shopId: string;
    campaignId: string;
    rejectedCreatorTags: string[];
    shopRequirements: string[];
};

export const analyzeShopOpportunity = async (payload: ShopAnalyzePayload) => {
    return authAction(payload, async (data, { user: _user }) => {
        const supabase = await createClient();

        // AIに「なぜマッチしなかったか」と「どの有料機能で解決できるか」を構造化データで推論させる
        const { object } = await generateObject({
            model: openai('gpt-4o'),
            schema: z.object({
                analysis: z.string().describe('マッチしなかった理由の分析（100文字以内）'),
                actionableAdvice: z.string().describe('店舗が取るべき具体的な改善アクション'),
                upsellPlan: z.enum(['NONE', 'AI_AUTO_TUNE', 'PREMIUM_BOOST']).describe('提案すべき有料機能'),
                upsellMessage: z.string().describe('有料機能へ誘導するための魅力的なセールスコピー（短め）')
            }),
            system: `あなたは広告主向けの凄腕カスタマーサクセス兼マーケターです。
      クリエイターとのマッチングが不成立になった理由を分析し、自社の有料オプション（AI_AUTO_TUNE または PREMIUM_BOOST）を使った解決策を提示して、アップセルを図ってください。
      トーンはビジネスライクかつ、結果にコミットする自信に満ちた表現にしてください。`,
            prompt: `店舗の要求Vibe: ${data.shopRequirements.join(', ')}\n見送ったクリエイターのVibe: ${data.rejectedCreatorTags.join(', ')}`
        });

        // 2. 分析結果（Insight）をDBに保存
        const { error: insertError } = await supabase
            .from('shop_insights')
            .insert({
                shop_id: data.shopId,
                campaign_id: data.campaignId,
                analysis: object.analysis,
                actionable_advice: object.actionableAdvice,
                upsell_plan: object.upsellPlan,
                upsell_message: object.upsellMessage,
                rejected_tags: data.rejectedCreatorTags,
            });

        if (insertError) {
            console.error('Failed to save shop insight:', insertError);
            // DBエラーが発生しても、AIの結果自体は返せるようにフォールバックするか検討
        }

        return { success: true, insight: object };
    });
};
