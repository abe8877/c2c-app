"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * クリエイターへのオファー（招待状送信）を処理する
 */
export async function offerCreator({
    creatorId,
    shopId,
    creatorName,
    creatorAvatar,
    offerDetails
}: {
    creatorId: string;
    shopId: string;
    creatorName: string;
    creatorAvatar?: string;
    offerDetails?: any;
}) {
    const supabase = await createClient();

    // 1. 無料オファー残り回数を確認
    const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id, free_offers_remaining, is_premium')
        .eq('id', shopId)
        .single();

    let shopBenefit = shop;

    if (shopError || !shop) {
        console.warn("Shop not found in DB, using fallback for: ", shopId);
        // デモ用のフォールバック処理
        if (shopId === 'demo-shop') {
            shopBenefit = {
                id: 'demo-shop',
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
    // DBに実際に店舗がある場合のみ更新を試みる
    if (!currentShop.is_premium && shop) {
        const { error: updateError } = await supabase
            .from('shops')
            .update({ free_offers_remaining: currentShop.free_offers_remaining - 1 })
            .eq('id', shopId);

        if (updateError) {
            console.error("Shop Update Error:", updateError);
            // 失敗してもデモ継続を優先
        }
    }

    // 3. assets テーブルにオファー情報を記録
    const { data: asset, error: assetError } = await supabase
        .from('assets')
        .insert({
            shop_id: shopId,
            creator_id: creatorId,
            status: 'OFFERED',
        })
        .select()
        .single();

    if (assetError) {
        console.error("Asset Insert Error (ignoring for demo):", assetError);
    }

    const remaining = currentShop.is_premium ? currentShop.free_offers_remaining : currentShop.free_offers_remaining - 1;

    // 4. Slack Webhook 連携 (非同期で実行)
    try {
        const webhookUrl = process.env.SLACK_WEBHOOK_URL;
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `🚨 [オファー発生] ${currentShop.id}店がクリエイター @${creatorName} にオファーしました！即座にDMで一本釣りしてください！`
                })
            }).catch(err => console.error("Slack Notification Error:", err));
        }
    } catch (slackErr) {
        console.error("Slack Fetch Error:", slackErr);
    }

    return { 
        success: true, 
        freeOffersRemaining: Math.max(0, remaining),
        assetId: asset?.id 
    };
}
