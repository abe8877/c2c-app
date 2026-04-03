import { createClient } from '@/utils/supabase/server';

type AuthContext = { user: any };
type PublicContext = {}; // 将来的にリクエスト元のIPやデバイス情報を入れる拡張用

/**
 * 認証必須のアクション（プロフィールの更新、マッチング承諾など）
 */
export async function authAction<T, R>(
    payload: T,
    action: (payload: T, context: AuthContext) => Promise<R>
): Promise<any> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('Unauthorized attempt to access secure action.');
        return { success: false, error: 'Unauthorized Access' };
    }

    try {
        const data = await action(payload, { user });
        if (data && typeof data === 'object' && 'success' in data) return data;
        return { success: true, data };
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT') || error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Auth Action Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Action failed. Please try again.';
        return { success: false, error: errorMessage };
    }
}

/**
 * 非認証アクション（サインアップ、招待状の検証など）
 */
export async function publicAction<T, R>(
    payload: T,
    action: (payload: T, context: PublicContext) => Promise<any>
): Promise<any> {
    try {
        const data = await action(payload, {});
        if (data && typeof data === 'object' && 'success' in data) return data;
        return { success: true, data };
    } catch (error: any) {
        // Next.jsのredirectはエラーを投げて処理されるため、そのまま再スローする
        if (error.digest?.startsWith('NEXT_REDIRECT') || error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('Public Action Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Action failed. Please try again.';
        return { success: false, error: errorMessage };
    }
}
