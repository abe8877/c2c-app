"use server";

import { createClient } from '@/utils/supabase/server';

export async function submitAssetDelivery(assetId: string, videoUrl: string) {
    // In a real implementation this would fetch from 'assets' table or similar
    // Since this is a demo mockup, we just simulate a delay or mock the DB update
    const supabase = await createClient();
    
    // Simulate updating the asset record
    console.log(`Submitting delivery for asset ${assetId} with URL ${videoUrl}`);

    // If 'assets' table exists, uncomment below
    /*
    const { error } = await supabase
        .from('assets')
        .update({ status: 'completed', video_url: videoUrl })
        .eq('id', assetId);

    if (error) {
        throw new Error(error.message);
    }
    */
    
    // For demo purposes, we will return a success flag
    return { success: true, assetId, videoUrl, newStatus: 'completed' };
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
