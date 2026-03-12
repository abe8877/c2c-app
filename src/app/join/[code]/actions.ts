'use server';

import { createClient as createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { publicAction } from '@/lib/actions/safe-action';

export const submitCreatorApplication = async (formData: FormData) => {
    return publicAction(formData, async (payload) => {
        const supabase = await createServerClient();

        // 1. フォームデータの取得
        const inviteCode = payload.get('inviteCode') as string;
        const email = payload.get('email') as string;
        const password = payload.get('password') as string;
        const portfolioUrl = payload.get('portfolio_video_url') as string;
        const avatarUrl = payload.get('avatar_url') as string;
        const realName = payload.get('real_name') as string;
        const nationality = payload.get('nationality') as string;
        const contactApp = payload.get('contact_app') as string;
        const contactId = payload.get('contact_id') as string;
        const vibeTagsJson = payload.get('vibe_tags') as string;
        const vibeTags = vibeTagsJson ? JSON.parse(vibeTagsJson) : [];

        // 2. Supabaseでアカウント作成（サインアップ）
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError || !authData.user) {
            console.error("Auth error:", authError);
            throw new Error("アカウントの作成に失敗しました。既に登録済みのメールアドレスの可能性があります。");
        }

        // 3. creatorsテーブル（440人の名簿）の既存行をUPDATE
        const { error: updateError } = await supabase
            .from('creators')
            .update({
                user_id: authData.user.id,
                is_onboarded: true,
                portfolio_video_url: portfolioUrl,
                avatar_url: avatarUrl,
                real_name: realName,
                nationality: nationality,
                contact_app: contactApp,
                contact_id: contactId,
                vibe_tags: vibeTags,
                status: 'onboarded',
                updated_at: new Date().toISOString(),
            })
            .eq('invite_code', inviteCode);

        if (updateError) {
            console.error("Creator update failed:", updateError);
            throw new Error("プロフィールの更新に失敗しました。");
        }

        // 4. 完了ページ（Success）へリダイレクト
        redirect(`/join/${inviteCode}/success`);
    });
};