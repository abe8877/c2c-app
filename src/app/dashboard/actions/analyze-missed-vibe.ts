'use server'

import { authAction } from '@/lib/actions/safe-action';
import { createClient } from '@/utils/supabase/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { sendEmail } from '@/lib/mail';

type AnalyzePayload = {
    creatorId: string;
    shopId: string;
    shopName: string;
    creatorTags: string[];
    shopTags: string[];
    matchRequestId: string;
};

export const analyzeMissedVibe = async (payload: AnalyzePayload) => {
    return authAction(payload, async (data, { user: _user }) => {
        const supabase = await createClient();

        // 1. AIによるズレの分析とヒント生成
        const { text: hint } = await generateText({
            model: openai('gpt-4o'),
            system: `あなたはインバウンド向けショート動画の凄腕プロデューサーです。
      クリエイターのスタイルと店舗の要求にズレ（Missed Vibe）があり、マッチングしませんでした。
      クリエイターが次回この店舗（または似た店舗）の案件を獲得するための具体的な撮影・編集アプローチを100文字以内で提案してください。
      トーンはプロフェッショナルかつエンカレッジング（モチベーションを上げるトーン）にしてください。`,
            prompt: `店舗名: ${data.shopName}\nクリエイターのVibe: ${data.creatorTags.join(', ')}\n店舗が求めるVibe: ${data.shopTags.join(', ')}`
        });

        // 2. 分析結果（Insight）をDBに保存
        const missingTags = data.shopTags.filter(tag => !data.creatorTags.includes(tag));

        const { error: insertError } = await supabase
            .from('creator_insights')
            .insert({
                creator_id: data.creatorId,
                shop_id: data.shopId,
                match_request_id: data.matchRequestId,
                missing_tags: missingTags,
                ai_hint: hint,
            });

        if (insertError) throw new Error('Failed to save insight.');

        // 3. クリエイターへGoogle WorkspaceのSMTP経由で通知
        const { data: profile } = await supabase.from('profiles').select('email').eq('id', data.creatorId).single();

        if (profile?.email) {
            await sendEmail({
                to: profile.email,
                subject: `【INSIDERS.】${data.shopName}の案件獲得に向けたVibe最適化のヒント✨`,
                html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Next Step to Vibe Sync</h2>
            <p>あと一歩でマッチングでした！AIプロデューサーからのパーソナライズされたヒントをお届けします。</p>
            <blockquote style="border-left: 4px solid #14b8a6; padding-left: 1rem; color: #475569;">
              ${hint}
            </blockquote>
            <p>不足していたVibe: <strong>${missingTags.join(', ')}</strong></p>
            <p>ダッシュボードからプロフィールをアップデートして、次のオファーを勝ち取りましょう。</p>
          </div>
        `
            });
        }

        return { success: true, hint };
    });
};
