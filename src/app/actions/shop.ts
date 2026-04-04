'use server'
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertShop(formData: any) {
    const supabase = await createClient();
    
    // ログインユーザーの取得
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: '認証が必要です' };
    }

    try {
        const { data, error } = await supabase
            .from('shops')
            .upsert({
                id: user.id, // IDをユーザーIDに固定（1ユーザー1店舗前提）
                ...formData,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        
        revalidatePath('/advertiser');
        return { success: true, data };
    } catch (error: any) {
        console.error('upsertShop error:', error);
        return { success: false, error: error.message || '保存に失敗しました' };
    }
}
