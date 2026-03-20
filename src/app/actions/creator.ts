"use server";

import { createClient } from '@/utils/supabase/server';

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
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn("N8N_WEBHOOK_URL is not set.");
        return { success: false, message: "Webhook URL not configured" };
    }
    
    // Fire and forget, no await
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creatorId, portfolioUrl }),
    }).catch(err => console.error("Webhook trigger failed:", err));

    return { success: true };
}
