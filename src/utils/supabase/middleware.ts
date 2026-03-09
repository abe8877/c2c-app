import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 保護されたルートへのアクセス制御
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isDemoRoute = request.nextUrl.pathname.startsWith('/demo');

    // 未ログインユーザーはログイン画面へリダイレクト
    if (!user && (isAdminRoute || isDemoRoute)) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Adminルートへのアクセス時のRoleチェック
    if (user && isAdminRoute) {
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

        if (!roleData || !['super_admin', 'ops_manager', 'ops_member'].includes(roleData.role)) {
            // 権限がない場合はエラー画面かホームへ飛ばす
            const url = request.nextUrl.clone();
            url.pathname = '/demo/advertiser'; // 一旦デモ画面へ逃がす
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}