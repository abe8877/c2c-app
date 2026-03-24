import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 🔥 追加：Vercelビルド時の静的解析エラーを回避し、常に動的に実行する
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        // 🔥 修正：Stripeの初期化をトップレベルから関数内部に移動
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2026-02-25.clover',
        });

        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (error) { }
                    },
                },
            }
        );

        // 1. ユーザー情報取得
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // 2. 顧客ID取得
        const { data: shop, error: dbError } = await supabase
            .from('shops')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (dbError || !shop?.stripe_customer_id) {
            return NextResponse.json({ error: 'Stripe customer not found' }, { status: 400 });
        }

        // 3. ポータルセッション発行
        const session = await stripe.billingPortal.sessions.create({
            customer: shop.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/advertiser/settings`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('[Stripe Portal Error]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}