import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
    redis: kv,
    // 10秒間に5リクエストまで（APIルートや認証エンドポイント向け）
    limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function middleware(request: NextRequest) {
    // IPアドレスはVercelが付与するヘッダーから取得（Web標準 Request API 準拠）
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip') ?? '127.0.0.1';


    // APIルートのみを保護
    if (request.nextUrl.pathname.startsWith('/api')) {
        // Vercel KV の環境変数がセットされている場合のみレートリミットを実行（ローカルでのクラッシュ防止）
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            const { success } = await ratelimit.limit(ip);
            if (!success) {
                return new NextResponse('Too Many Requests', { status: 429 });
            }
        } else {
            // 環境変数がない場合は警告だけ出してスキップ
            console.warn('⚠️ Vercel KV is not configured. Skipping rate limit.');
        }
    }

    // Supabaseのセッションを更新し、アクセス制御を行う
    return await updateSession(request);
}

export const config = {
    matcher: [
        // 認証をかけたいパス（_next/static など静的ファイルは除外）
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};