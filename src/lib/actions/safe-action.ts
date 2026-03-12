import { createClient } from '@/utils/supabase/server';

type AuthContext = { user: any };
type PublicContext = {}; // 将来的にリクエスト元のIPやデバイス情報を入れる拡張用

/**
 * 認証必須のアクション（プロフィールの更新、マッチング承諾など）
 */
export async function authAction<T, R>(
    payload: T,
    action: (payload: T, context: AuthContext) => Promise<R>
): Promise<R> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.error('Unauthorized attempt to access secure action.');
        throw new Error('Unauthorized Access: INSIDERS. Security Protocol');
    }

    return action(payload, { user });
}

/**
 * 非認証アクション（サインアップ、招待状の検証など）
 */
export async function publicAction<T, R>(
    payload: T,
    action: (payload: T, context: PublicContext) => Promise<R>
): Promise<R> {
    try {
        // 認証チェックは行わないが、共通のエラーハンドリングや
        // 将来的なBot対策（reCAPTCHAトークンの検証など）をここに集約可能
        return await action(payload, {});
    } catch (error: any) {
        console.error('Public Action Error:', error);
        // エラーが既に分かりやすいメッセージを持っている場合はそれを投げ、そうでなければ汎用的なメッセージにする
        throw new Error(error.message || 'Action failed. Please try again.');
    }
}
