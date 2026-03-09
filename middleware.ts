import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // ★ /admin と /demo の両方を保護対象にする
    if (
        req.nextUrl.pathname.startsWith('/admin') ||
        req.nextUrl.pathname.startsWith('/demo')
    ) {
        const basicAuth = req.headers.get('authorization');

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            // Vercelの環境変数からIDとパスワードを取得（同じものでOK）
            const validUser = process.env.ADMIN_USER;
            const validPassword = process.env.ADMIN_PASSWORD;

            if (user === validUser && pwd === validPassword) {
                return NextResponse.next(); // 認証成功
            }
        }

        // 認証失敗
        return new NextResponse('Unauthorized: Private Access Only', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="MANEKEY Private Area"',
            },
        });
    }

    return NextResponse.next();
}

// ★ matcherにも /demo を追加
export const config = {
    matcher: ['/admin/:path*', '/demo/:path*'],
};