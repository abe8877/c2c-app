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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const senderId = user.id;

    // 1. AI Translation
    let translatedContent = "";
    try {
        let systemPrompt = "";
        if (senderType === 'shop') {
            systemPrompt = "Translate the following Japanese message to professional, friendly English suitable for business communication with a creator. Output ONLY the translated text without any quotes or explanations.";
        } else {
            systemPrompt = "次のクリエイターからの英語のメッセージを、自然で丁寧な日本語のビジネス表現に翻訳してください。翻訳されたテキストのみを出力してください。";
        }

        const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            system: systemPrompt,
            prompt: content,
        });

        translatedContent = text.trim();
    } catch (error) {
        console.error("Translation Error:", error);
        translatedContent = "[Translation temporarily unavailable]";
    }

    // 2. Save to Database
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
        .from('messages')
        .insert({
            asset_id: assetId,
            sender_id: senderId,
            sender_type: senderType,
            message: content, 
            message_en: senderType === 'shop' ? translatedContent : content,
            message_ja: senderType === 'shop' ? content : translatedContent,
        })
        .select()
        .single();

    if (error) {
        console.error("🔥 Database Insert Error:", error);
        throw new Error("Failed to send message: " + error.message);
    }

    // 3. Trigger n8n Webhook Notification
    try {
        const { data: asset } = await supabaseAdmin
            .from('assets')
            .select(`
                shop_id,
                creator_id,
                shops ( name, login_email ),
                creators ( name, email )
            `)
            .eq('id', assetId)
            .single();

        if (asset) {
            const recipientEmail = senderType === 'shop' ? (asset.creators as any)?.email : (asset.shops as any)?.login_email;
            const senderName = senderType === 'shop' ? (asset.shops as any)?.name : (asset.creators as any)?.name;
            const n8nChatWebhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;

            if (n8nChatWebhookUrl && recipientEmail) {
                fetch(n8nChatWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'CHAT',
                        recipientEmail: recipientEmail,
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

    const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('name, address_en, access_info_en, preset_menu_en, shoot_rules_en, requirements')
        .eq('id', shopId)
        .single();

    if (shopError || !shop) {
        console.error("🔥 Shop Fetch Error:", shopError);
        return { success: false, error: "店舗情報の取得に失敗しました。" };
    }

    let prompt = "";
    let systemPrompt = "You are a professional AI Concierge. Generate a friendly, professional message in English from the shop to the creator. Output ONLY the message text without any quotes or preamble. Use natural emojis.";

    switch (type) {
        case 'map':
            const address = [shop.address_en, shop.access_info_en].filter(Boolean).join(' / ');
            prompt = `The shop (${shop.name}) is sharing their location.
Shop Address Info: ${address || 'Please contact us for directions.'}
Generate a message guiding the creator to the shop.`;
            break;
        case 'menu':
            prompt = `The shop (${shop.name}) is sharing the menu they will provide.
Menu: ${shop.preset_menu_en || 'Our signature dishes.'}
Generate a welcoming message explaining what the creator will experience.`;
            break;
        case 'camera':
            const rules = [shop.shoot_rules_en, ...(shop.requirements || [])].filter(Boolean).join(', ');
            prompt = `The shop (${shop.name}) has specific filming guidelines.
Rules: ${rules || 'Please capture our vibe naturally.'}
Generate a polite message explaining these filming guidelines.`;
            break;
        case 'schedule':
            const datesStr = dates && dates.length > 0 ? dates.join('\n- ') : 'flexible dates';
            prompt = `The shop (${shop.name}) is suggesting candidate dates for the visit.
Candidate Dates:
- ${datesStr}
IMPORTANT: You MUST list the exact dates provided above in your message. Ask the creator to pick one.`;
            break;
    }

    try {
        const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            system: systemPrompt,
            prompt: prompt,
        });

        return { success: true, text: text.trim() };
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return { success: false, error: "AIによるテキスト生成に失敗しました: " + error.message };
    }
}
