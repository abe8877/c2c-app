import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // /admin 配下へのアクセスのみ保護する
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const basicAuth = req.headers.get('authorization');

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            // Vercelの環境変数からIDとパスワードを取得
            const validUser = process.env.ADMIN_USER;
            const validPassword = process.env.ADMIN_PASSWORD;

            if (user === validUser && pwd === validPassword) {
                return NextResponse.next(); // 認証成功：ページを表示
            }
        }

        // 認証失敗 or 未入力時：パスワード入力ダイアログを表示
        return new NextResponse('Unauthorized: Admin Access Only', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="MANEKEY Admin Area"',
            },
        });
    }

    return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
    matcher: ['/admin/:path*'],
};