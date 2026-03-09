import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    // 招待の場合は、デフォルトでパスワード設定画面へ飛ばす
    const next = searchParams.get('next') ?? '/update-password';

    if (token_hash && type) {
        const supabase = await createClient();

        // トークンを検証してセッション（ログイン状態）を確立
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (!error) {
            // 成功したらパスワード設定画面へリダイレクト
            const url = request.nextUrl.clone();
            url.pathname = next;
            url.searchParams.delete('token_hash');
            url.searchParams.delete('type');
            return NextResponse.redirect(url);
        }
    }

    // リンク切れやエラーの場合はログイン画面へ
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', '招待リンクが無効か、期限切れです。');
    return NextResponse.redirect(url);
}