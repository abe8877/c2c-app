'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function inviteAdminMember(formData: FormData) {
    const email = formData.get('email') as string;
    const role = formData.get('role') as string; // 'ops_manager' or 'ops_member'

    // 1. 実行者（阿部さん）がSUPER ADMINかどうかの厳格なチェック
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (roleData?.role !== 'super_admin') {
        throw new Error("Forbidden: Super Admin access required");
    }

    // 2. ユーザーの強制招待（神の鍵 = Service Role Key を使用）
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Vercelに設定した鍵
    );

    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    if (inviteError) throw new Error(`招待エラー: ${inviteError.message}`);

    // 3. user_roles テーブルに権限をInsert
    if (inviteData?.user?.id) {
        const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
            user_id: inviteData.user.id,
            role: role,
            status: 'active'
        });

        if (roleError) throw new Error("権限の登録に失敗しました");
    }

    // 4. ダッシュボードの画面を更新
    revalidatePath('/admin/settings');
}

/**
 * メンバーのロールを更新する Server Action
 */
export async function updateUserRole(userId: string, newRole: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 1. ユーザーが操作可能かチェック（簡易的な認証確認）
    // 実際の実装ではここで権限（SUPER ADMINなど）をDBから引いて確認します
    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (roleData?.role !== 'super_admin') {
        throw new Error("Forbidden: Super Admin access required");
    }

    // 2. ロールの更新
    const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

    if (error) {
        console.error('Update Role Error:', error);
        throw new Error("権限の更新に失敗しました");
    }

    // 3. ページの再検証
    revalidatePath('/admin/settings');
}

export async function updateAdminProfile(name: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.updateUser({ data: { display_name: name } });
    if (error) throw new Error("プロフィールの更新に失敗しました");
    revalidatePath('/admin/settings');
}

export async function updateSystemSettings(settings: any) {
    console.log('Update settings:', settings);
    await new Promise(r => setTimeout(r, 800));
    revalidatePath('/admin/settings');
    return { success: true };
}