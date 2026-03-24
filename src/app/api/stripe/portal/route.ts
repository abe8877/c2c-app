import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Stripeインスタンスの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
    try {
        // Next.js 15 仕様 (cookiesはawaitが必要)
        const cookieStore = await cookies();

        // Supabase Server Clientの初期化（他のファイルに依存しない独立記述）
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (error) {
                            // Server Componentからの呼び出し時は無視
                        }
                    },
                },
            }
        );

        // 1. セッションからユーザー情報を取得
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[Auth Error]:', authError);
            return NextResponse.json({ error: '認証エラー：ログインし直してください' }, { status: 401 });
        }

        // 2. shopsテーブルから stripe_customer_id を取得
        const { data: shop, error: dbError } = await supabase
            .from('shops')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (dbError || !shop?.stripe_customer_id) {
            console.error('[DB Error or No Customer]:', dbError, shop);
            return NextResponse.json(
                { error: 'Stripe顧客情報が見つかりません。テスト環境のDBを確認してください。' },
                { status: 400 }
            );
        }

        // 3. カスタマーポータルセッションの発行
        const session = await stripe.billingPortal.sessions.create({
            customer: shop.stripe_customer_id,
            // 戻り先を広告主の設定画面に指定
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/advertiser/settings`,
        });

        // 4. 発行したURLをフロントに返す
        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('[Stripe Portal Catch Error]:', error);
        return NextResponse.json(
            { error: `サーバーエラー: ${error.message}` },
            { status: 500 }
        );
    }
}