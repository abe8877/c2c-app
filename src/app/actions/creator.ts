"use server";

import { createClient } from '@/utils/supabase/server';
import { sendAssetNotification } from './admin';

export async function submitAssetDelivery(assetId: string, videoUrl: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('assets')
        .update({ 
            status: 'COMPLETED', 
            video_url: videoUrl,
            submitted_at: new Date().toISOString()
        })
        .eq('id', assetId);

    if (error) {
        console.error("Submit Delivery Error:", error);
        throw new Error(error.message);
    }
    
    return { success: true, assetId, videoUrl, newStatus: 'COMPLETED' };
}

export async function approveAsset(assetId: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('assets')
        .update({ 
            status: 'APPROVED', 
            approved_at: new Date().toISOString()
        })
        .eq('id', assetId);

    if (error) {
        console.error("Approve Asset Error:", error);
        throw new Error(error.message);
    }
    
    return { success: true, assetId, newStatus: 'APPROVED' };
}

export async function finalizeAsset(assetId: string) {
    const supabase = await createClient();
    
    // offer_detailsのtimeline.confirmed_atを更新
    const { data: currentAsset, error: fetchError } = await supabase.from('assets').select('offer_details').eq('id', assetId).single();
    if (fetchError || !currentAsset) throw new Error("対象のアセットが見つかりませんでした。");
    
    let currentDetails = currentAsset.offer_details || {};
    if (typeof currentDetails === 'string') try { currentDetails = JSON.parse(currentDetails); } catch { currentDetails = {}; }
    
    const timeline = currentDetails.timeline || {};
    timeline.confirmed_at = new Date().toISOString();
    currentDetails.timeline = timeline;

    const { error } = await supabase
        .from('assets')
        .update({ 
            finalized: true,
            status: 'FINALIZED',
            offer_details: currentDetails
        })
        .eq('id', assetId);

    if (error) {
        console.error("Finalize Asset Error:", error);
        throw new Error(error.message);
    }
    
    // 通知送信
    await sendAssetNotification(assetId, 'FINALIZED');
    
    return { success: true, assetId };
}

export async function requestAssetRevision(assetId: string, message: string) {
    const supabase = await createClient();
    
    // 現在の状態を取得 (retake_remaining を含む)
    const { data: currentAsset, error: fetchError } = await supabase
        .from('assets')
        .select('offer_details, shop_id, creator_id, retake_remaining')
        .eq('id', assetId)
        .single();
        
    if (fetchError || !currentAsset) throw new Error("対象のアセットが見つかりませんでした。");

    // 残り回数チェック
    const remaining = currentAsset.retake_remaining ?? 2;
    if (remaining <= 0) throw new Error("修正依頼の残り回数がありません。");

    let currentDetails = currentAsset.offer_details || {};
    if (typeof currentDetails === 'string') try { currentDetails = JSON.parse(currentDetails); } catch { currentDetails = {}; }
    
    const timeline = currentDetails.timeline || {};
    // 表示用の修正カウント（2 - 残り回数 + 1）
    const revisionNum = 3 - remaining;
    
    timeline.last_revision_request = new Date().toISOString();
    timeline.last_revision_message = message;
    currentDetails.timeline = timeline;

    // ステータスを REVISION_REQUESTED に変更し、残り回数を減らす
    const { error } = await supabase
        .from('assets')
        .update({ 
            status: 'REVISION_REQUESTED',
            offer_details: currentDetails,
            rejection_reason: message,
            retake_remaining: remaining - 1
        })
        .eq('id', assetId);

    if (error) throw new Error(error.message);

    // チャットにメッセージを自動投稿
    await supabase.from('messages').insert({
        asset_id: assetId,
        sender_id: currentAsset.shop_id,
        sender_type: 'shop',
        message: `【修正依頼 (#${revisionNum}/2)】\n${message}`,
        is_admin_action: false
    });

    // 通知送信
    await sendAssetNotification(assetId, 'REVISION_REQUESTED');

    return { success: true, remaining: remaining - 1 };
}

export async function updateCreatorPortfolio(creatorId: string, videoUrl: string) {
    const supabase = await createClient();

    // 現在のプロフィールを取得
    const { data: creator } = await supabase
        .from('creators')
        .select('portfolio_video_urls')
        .eq('id', creatorId)
        .single();

    const currentUrls = creator?.portfolio_video_urls || [];
    const newUrls = [...new Set([...currentUrls, videoUrl])];

    const { error } = await supabase
        .from('creators')
        .update({ portfolio_video_urls: newUrls })
        .eq('id', creatorId);

    if (error) {
        console.error("Update Portfolio Error:", error);
        throw new Error(error.message);
    }

    return { success: true, newUrls };
}

export async function triggerN8nWebhook(creatorId: string, portfolioUrl: string) {
    // ユーザー指定のWebhook URL: https://nots.app.n8n.cloud/webhook/generate-thumbnail
    const webhookUrl = "https://nots.app.n8n.cloud/webhook/generate-thumbnail";
    
    console.log("🚀 [Webhook] Triggering n8n thumbnail generation...", { creatorId, portfolioUrl });

    if (!portfolioUrl) {
        console.warn("⚠️ [Webhook] portfolioUrl is empty. Webhook might not work as expected.");
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creatorId, portfolioUrl }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ [Webhook] Failed with status ${response.status}:`, errorText);
            return { success: false, error: `Status ${response.status}` };
        }

        console.log("✅ [Webhook] Successfully triggered n8n.");
        return { success: true };
    } catch (err) {
        console.error("❌ [Webhook] Network or fetch error:", err);
        return { success: false, error: String(err) };
    }
}
