"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * クリエイターへのオファー（招待状送信）を処理する
 */
export async function offerCreator({
    creatorId,
    shopId,
    creatorName,
    creatorAvatar,
    offerDetails,
    barterDetails,
}: {
    creatorId: string;
    shopId: string;
    creatorName: string;
    creatorAvatar?: string;
    offerDetails?: any;
    barterDetails?: string;
}) {
    const supabase = await createServerClient();
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. 無料オファー残り回数を確認
    const { data: shop, error: shopError } = await supabaseAdmin
        .from('shops')
        .select('id, name, free_offers_remaining, is_premium')
        .eq('id', shopId)
        .single();

    let shopBenefit = shop;

    if (shopError || !shop) {
        console.warn("Shop not found in DB, using fallback for: ", shopId);
        // デモ用のフォールバック処理
        if (shopId === 'demo-shop' || !shopId.includes('-')) {
            shopBenefit = {
                id: shopId,
                name: 'Demo Shop',
                free_offers_remaining: 3,
                is_premium: false
            };
        } else {
            throw new Error("店舗情報の取得に失敗しました。");
        }
    }

    const currentShop = shopBenefit!;

    // プレミアムプランでなく、かつ無料枠が0ならエラー
    if (!currentShop.is_premium && currentShop.free_offers_remaining <= 0) {
        return { success: false, error: 'PAYWALL_REQUIRED', message: '無料オファーの上限に達しました。' };
    }

    // 2. 無料オファー回数をデクリメント（プレミアムでない場合）
    if (!currentShop.is_premium && shop) {
        const { error: updateError } = await supabaseAdmin
            .from('shops')
            .update({ free_offers_remaining: currentShop.free_offers_remaining - 1 })
            .eq('id', shopId);

        if (updateError) {
            console.error("Shop Update Error:", updateError);
        }
    }

    // 3. assets テーブルにオファー情報を記録 (Admin権限でRLSをバイパス)
    const { data: asset, error: assetError } = await supabaseAdmin
        .from('assets')
        .insert({
            shop_id: shopId,
            creator_id: creatorId,
            status: 'OFFERED',
            offer_details: offerDetails,
            barter_details: barterDetails ?? null,
            client_tag: currentShop.name, // 必須項目を補完
        })
        .select()
        .single();

    if (assetError) {
        console.error("Asset Insert Error:", assetError);
        return { success: false, error: 'DATABASE_ERROR', message: `オファーの保存に失敗しました: ${assetError.message}` };
    }

    const remaining = currentShop.is_premium ? currentShop.free_offers_remaining : currentShop.free_offers_remaining - 1;

    // 4. n8n Webhook / Slack 連携
    try {
        // クリエイター情報を取得してメール送信用に渡す
        const { data: creator } = await supabaseAdmin
            .from('creators')
            .select('email, name')
            .eq('id', creatorId)
            .single();

        const n8nWebhookUrl = process.env.N8N_OFFER_WEBHOOK_URL;
        if (n8nWebhookUrl && creator?.email) {
            fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'OFFER',
                    creatorEmail: creator.email,
                    creatorName: creator.name,
                    shopName: currentShop.name,
                    plan: offerDetails?.plan || 'barter',
                    amount: offerDetails?.amount || 0,
                    subject: `[INSIDERS] VIP Offer ${offerDetails?.plan === 'paid' ? `(¥${offerDetails?.amount?.toLocaleString()})` : ''} from ${currentShop.name}`,
                    assetId: asset?.id
                })
            }).catch(err => console.error("n8n Notification Error:", err));
        }

        const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
        if (slackWebhookUrl) {
            fetch(slackWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `🚨 [オファー発生] ${currentShop.name}店がクリエイター @${creatorName} にオファーしました！即座にDMで一本釣りしてください！`
                })
            }).catch(err => console.error("Slack Notification Error:", err));
        }
    } catch (err) {
        console.error("Notification Fetch Error:", err);
    }

    return {
        success: true,
        freeOffersRemaining: Math.max(0, remaining),
        assetId: asset?.id
    };
}
