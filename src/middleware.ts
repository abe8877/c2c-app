import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    // Supabaseのセッションを更新し、アクセス制御を行う
    return await updateSession(request);
}

export const config = {
    matcher: [
        // 認証をかけたいパス（_next/static など静的ファイルは除外）
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};