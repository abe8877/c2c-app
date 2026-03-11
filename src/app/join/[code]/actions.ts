'use server';

import { createClient as createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function onboardCreator(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const inviteCode = formData.get('inviteCode') as string; // URLから引き継ぐ

    const supabase = await createServerClient();

    // 1. アカウントの作成 (サインアップ)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError || !authData.user) {
        return redirect(`/join/${inviteCode}?error=アカウント作成に失敗しました`);
    }

    // 2. creatorsテーブル（440人の名簿）の既存行をUPDATEして、本人と紐付ける！
    const { error: updateError } = await supabase
        .from('creators')
        .update({
            user_id: authData.user.id,
            is_onboarded: true
        })
        .eq('invite_code', inviteCode); // 招待コードが一致する人を書き換え

    if (updateError) {
        console.error("Creator mapping failed:", updateError);
    }

    // 3. クリエイター専用のダッシュボードへリダイレクト
    redirect('/demo/creator');
}