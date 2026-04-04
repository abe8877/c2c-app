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
    // 🔴 1. UUIDの検証: 'demo-shop' などの不正なIDを弾く
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(shopId)) {
        return { success: false, error: "店舗情報が正しく取得できませんでした。ページを再読み込みしてください。" };
    }

    const supabase = await createServerClient();
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. 無料オファー残り回数を確認 (ダミーフォールバックを削除し厳格化)
    const { data: shop, error: shopError } = await supabaseAdmin
        .from('shops')
        .select('id, name, free_offers_remaining, is_premium')
        .eq('id', shopId)
        .single();

    if (shopError || !shop) {
        console.warn("Shop not found in DB for: ", shopId);
        return { success: false, error: "店舗情報の取得に失敗しました。" };
    }

    // プレミアムプランでなく、かつ無料枠が0ならペイウォールへ
    if (!shop.is_premium && shop.free_offers_remaining <= 0) {
        return { success: false, error: 'PAYWALL_REQUIRED' };
    }

    // 3. 無料オファー回数をデクリメント（プレミアムでない場合）
    if (!shop.is_premium) {
        const { error: updateError } = await supabaseAdmin
            .from('shops')
            .update({ free_offers_remaining: shop.free_offers_remaining - 1 })
            .eq('id', shopId);

        if (updateError) console.error("Shop Update Error:", updateError);
    }

    // 4. assets テーブルにオファー情報を記録 (Admin権限でRLSをバイパス)
    const { data: asset, error: assetError } = await supabaseAdmin
        .from('assets')
        .insert({
            shop_id: shopId,
            creator_id: creatorId,
            status: 'OFFERED',
            offer_details: offerDetails,
            barter_details: barterDetails ?? null,
            client_tag: shop.name, // 必須項目を補完
        })
        .select()
        .single();

    if (assetError) {
        console.error("🔥 [DEBUG] Asset Insert Error:", assetError);
        // フロント側でアラートを出せるように、errorに直接メッセージを入れる
        return { success: false, error: `DBエラー: ${assetError.message}` };
    }

    const remaining = shop.is_premium ? shop.free_offers_remaining : shop.free_offers_remaining - 1;

    // 5. 🌟 通知システム (n8n Webhook / Slack 連携)
    try {
        // preferred_language を追加取得
        const { data: creator } = await supabaseAdmin
            .from('creators')
            .select('email, name, preferred_language')
            .eq('id', creatorId)
            .single();

        const n8nWebhookUrl = process.env.N8N_OFFER_WEBHOOK_URL;
        if (n8nWebhookUrl && creator?.email) {
            fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'new_offer',
                    recipientEmail: creator.email,
                    creatorName: creator.name,
                    shopName: shop.name,
                    language: creator.preferred_language || 'en', // これでn8nのSwitchノードが動く
                    plan: offerDetails?.plan || 'barter',
                    amount: offerDetails?.amount || 0,
                    loginUrl: "https://insiders-hub.jp/creator/login"
                })
            }).catch(err => console.error("n8n Notification Error:", err));
        }

        const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
        if (slackWebhookUrl) {
            fetch(slackWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `🚨 [オファー発生] ${shop.name} がクリエイター @${creatorName} にオファーしました！\nプラン: ${offerDetails?.plan}\n金額: ¥${offerDetails?.amount || 0}`
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
