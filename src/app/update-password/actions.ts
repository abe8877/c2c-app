'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get('password') as string;

    // Supabaseのユーザーパスワードを上書き更新
    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return redirect('/update-password?error=パスワードの更新に失敗しました');
    }

    // パスワード設定が完了したら、いざダッシュボードへ！
    redirect('/admin');
}