"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * チャットメッセージの送信と翻訳
 */
export async function sendMessage({
    assetId,
    content,
    senderType
}: {
    assetId: string;
    content: string;
    senderType: 'shop' | 'creator';
}) {
    const supabase = await createServerClient();

    // 1. AI Translation (Using the fastest model gemini-3-flash-preview)
    let translatedContent = "";
    try {
        let systemPrompt = "";
        if (senderType === 'shop') {
            systemPrompt = "Translate the following Japanese message to professional, friendly English suitable for business communication with a creator. Output ONLY the translated text.";
        } else {
            systemPrompt = "次のクリエイターからの英語のメッセージを、自然で丁寧な日本語のビジネス表現に翻訳してください。翻訳されたテキストのみを出力してください。";
        }

        const { text } = await generateText({
            model: google('gemini-3-flash-preview'),
            system: systemPrompt,
            prompt: content,
        });

        translatedContent = text.trim();
    } catch (error) {
        console.error("Translation Error:", error);
        translatedContent = "[Translation temporarily unavailable]";
    }

    // 2. Save to Database
    const senderId = senderType === 'shop' ? 'demo-shop' : 'demo-creator-id'; // Auth実装後はここを更新

    const { data, error } = await supabase
        .from('messages')
        .insert({
            asset_id: assetId,
            sender_id: senderId,
            sender_type: senderType,
            content_original: content,
            content_translated: translatedContent
        })
        .select()
        .single();

    if (error) {
        console.error("Database Insert Error:", error);
        throw new Error("Failed to send message: " + error.message);
    }

    // 3. Trigger n8n Webhook Notification
    try {
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 送信先（相手）の情報を取得
        const { data: asset } = await supabaseAdmin
            .from('assets')
            .select(`
                shop_id,
                creator_id,
                shops ( name, email ),
                creators ( name, email )
            `)
            .eq('id', assetId)
            .single();

        if (asset) {
            const recipient = senderType === 'shop' ? (asset.creators as any) : (asset.shops as any);
            const senderName = senderType === 'shop' ? (asset.shops as any)?.name : (asset.creators as any)?.name;
            const n8nChatWebhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;

            if (n8nChatWebhookUrl && recipient?.email) {
                fetch(n8nChatWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'CHAT',
                        recipientEmail: recipient.email,
                        senderName: senderName || 'Partner',
                        content: content,
                        subject: `[INSIDERS] New message from ${senderName || 'your partner'}`,
                        assetId: assetId
                    })
                }).catch(err => console.error("n8n Chat Notification Error:", err));
            }
        }
    } catch (notifErr) {
        console.error("Chat Notification Trigger Error:", notifErr);
    }

    return { success: true, message: data };
}

/**
 * プリセット情報を元にしたAIアシスタントの応答生成
 */
export async function getAssistantResponse({
    type,
    shopId,
    dates
}: {
    type: 'map' | 'menu' | 'camera' | 'schedule';
    shopId: string;
    dates?: string[];
}) {
    const supabase = await createServerClient();

    // 1. Fetch shop presets
    const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('name, preset_address, preset_menu, preset_request')
        .eq('id', shopId)
        .single();

    if (shopError || !shop) {
        console.error("Shop Fetch Error:", shopError);
        // Fallback or handle error
    }

    let prompt = "";
    let systemPrompt = "You are a professional AI Concierge for INSIDERS., a platform matching advertisers with creators. Your task is to generate a professional, polite, and welcoming message in English from the shop to a creator. Output ONLY the English message text.";

    switch (type) {
        case 'map':
            prompt = `Context: The shop (${shop?.name || 'our shop'}) wants to share their location with the creator. 
                     Address: ${shop?.preset_address || 'TBD'}. 
                     Generate a friendly message including this address.`;
            break;
        case 'menu':
            prompt = `Context: The shop (${shop?.name || 'our shop'}) wants to share their menu/available products for filming. 
                     Menu Info: ${shop?.preset_menu || 'TBD'}. 
                     Generate a professional message explaining what the creator can film/eat.`;
            break;
        case 'camera':
            prompt = `Context: The shop (${shop?.name || 'our shop'}) has specific filming requests or requirements. 
                     Requests: ${shop?.preset_request || 'TBD'}. 
                     Generate a polite message outlining these filming guidelines.`;
            break;
        case 'schedule':
            prompt = `Context: The shop (${shop?.name || 'our shop'}) is suggesting several candidate dates for a meeting or filming.
                     Dates: ${dates?.join(', ') || 'flexible'}.
                     Generate a welcoming message inviting the creator to pick one of these dates.`;
            break;
    }

    try {
        const { text } = await generateText({
            model: google('gemini-3-flash-preview'),
            system: systemPrompt,
            prompt: prompt,
        });

        return { success: true, text: text.trim() };
    } catch (error) {
        console.error("AI Generation Error:", error);
        return { success: false, error: "Failed to generate response" };
    }
}
