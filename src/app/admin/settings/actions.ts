'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Role変更アクション
export async function updateUserRole(targetUserId: string, newRole: string) {
    const supabase = await createClient();

    // 1. 実行者が「super_admin」かどうかの厳格な権限チェック（SKILL.md準拠）
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: currentUserRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (currentUserRole?.role !== 'super_admin') {
        throw new Error("Forbidden: Super Admin access required");
    }

    // 自分自身の権限を降格させるミスを防ぐ（スーパー管理者がいなくなるのを防ぐ）
    if (user.id === targetUserId && newRole !== 'super_admin') {
        throw new Error("Cannot downgrade your own Super Admin role");
    }

    // 2. 対象ユーザーの権限をアップデート
    const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', targetUserId);

    if (error) {
        console.error("Failed to update role:", error);
        throw new Error("Failed to update user role");
    }

    // 3. 画面のキャッシュをクリアして最新状態を反映
    revalidatePath('/admin/settings');
}