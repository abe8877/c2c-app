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

export async function finalizeAsset(assetId: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('assets')
        .update({ 
            status: 'FINALIZED', 
            confirmed_at: new Date().toISOString()
        })
        .eq('id', assetId);

    if (error) {
        console.error("Finalize Asset Error:", error);
        throw new Error(error.message);
    }
    
    return { success: true, assetId, newStatus: 'FINALIZED' };
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
    
    console.log("Triggering n8n webhook for thumbnail generation...", { creatorId, portfolioUrl });

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
