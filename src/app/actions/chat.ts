"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
/**
 * チャットメッセージの取得（Admin権限でRLSバイパス）
 */
export async function fetchMessages(assetId: string) {
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin
        .from('messages')
        .select('*')
        .eq('asset_id', assetId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("fetchMessages error:", error);
        return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
}

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

    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let senderId = user?.id;
    if (!senderId) {
        console.warn("User not authenticated, using fallback sender_id for mockup.");
        // Fallback to the requested asset's relevant ID
        const { data: assetInfo } = await supabaseAdmin.from('assets').select('shop_id, creator_id').eq('id', assetId).single();
        senderId = senderType === 'shop' ? assetInfo?.shop_id : assetInfo?.creator_id;
        if (!senderId) {
             throw new Error("Unauthorized and no fallback ID could be found.");
        }
    }

    // 1. AI Translation (Automatic Japanese to English)
    let finalContent = content;
    try {
        // メッセージが日本語を含むか判定（簡易判定）
        const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(content);
        
        if (isJapanese && senderType === 'shop') {
            const systemPrompt = "Translate the following Japanese message to natural, friendly English suitable for professional business communication. Output ONLY the translated text.";
            const { text } = await generateText({
                model: google('gemini-2.5-flash'),
                system: systemPrompt,
                prompt: content,
            });
            finalContent = text.trim();
        }
    } catch (error) {
        console.error("Auto Translation Error:", error);
    }

    // 2. Save to Database
    const { data, error } = await supabaseAdmin
        .from('messages')
        .insert({
            asset_id: assetId,
            sender_id: senderId,
            sender_type: senderType,
            message: finalContent, // 翻訳後のメッセージを保存
        })
        .select()
        .single();

    if (error) {
        console.error("🔥 Database Insert Error:", error);
        return { success: false, message: error.message };
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
                }).catch(e => console.error("n8n Webhook Error:", e));
            }
        }
    } catch (webhookError) {
        console.error("Webhook Trigger Error:", webhookError);
    }

    return { success: true, data };
}

/**
 * プリセット情報を元にしたAIアシスタントの応答生成
 */
export async function getAssistantResponse({
    type,
    shopId,
    dates,
    contentOverride,
    structuredData
}: {
    type: 'map' | 'menu' | 'camera' | 'schedule';
    shopId: string;
    dates?: string[];
    contentOverride?: string;
    structuredData?: any;
}) {
    const supabase = await createServerClient();

    const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('id', shopId)
        .single();

    if (shopError || !shop) {
        console.error("🔥 Shop Fetch Error:", shopError);
        return { success: false, error: "店舗情報の取得に失敗しました。" };
    }

    let prompt = "";
    let systemPrompt = "You are a professional AI Concierge. Generate a friendly, professional message in English from the shop to the creator. Output ONLY the message text without any quotes or preamble. Use natural emojis. ALWAYS mention specific details provided.";

    const data = structuredData || {};

    switch (type) {
        case 'map':
            prompt = `The shop (${shop.name}) is sharing their location.
Business Hours: ${data.hours || shop.business_hours}
Holidays: ${data.holidays || shop.irregular_holidays}
Address: ${data.address || shop.address_jp}
English Access Info: ${data.access_en || shop.address_en}
Map: ${data.map_url || shop.google_map_url}
Generate a message guiding the creator to the shop clearly.`;
            break;
        case 'menu':
            prompt = `The shop (${shop.name}) is sharing the menu.
Menu Details: ${data.description || shop.preset_menu_en}
Dietary Restrictions support: ${data.restrictions?.join(', ') || shop.dietary_restrictions?.join(', ') || 'None specified'}
Generate a welcoming message explaining the menu and hospitality.`;
            break;
        case 'camera':
            prompt = `The shop (${shop.name}) is sharing shooting rules.
Must-have Elements: ${data.elements?.join(', ') || shop.shoot_elements?.join(', ')}
Preferred Time: ${data.time || shop.shoot_time_slot}
Staff Face Appearance: ${data.staff || shop.shoot_staff_appearance}
Special Rules: ${data.special || shop.shoot_rules_en}
Generate a polite message explaining the shooting guidelines.`;
            break;
        case 'schedule':
            const datesStr = dates && dates.length > 0 ? dates.join('\n- ') : 'flexible dates';
            const extraNote = contentOverride ? `\nAdditional Message: ${contentOverride}` : "";
            prompt = `The shop (${shop.name}) is suggesting candidate dates for the visit.
Candidate Dates:
- ${datesStr}
${extraNote}
IMPORTANT: You MUST list the exact dates provided above in your message. Ask the creator to pick one.`;
            break;
    }

    try {
        const { text } = await generateText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            prompt: prompt,
        });

        return { success: true, text: text.trim() };
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return { success: false, error: "AI生成に失敗しました: " + (error.message || "Unknown error") };
    }
}

/**
 * チャットからの入力をプリセットに同期
 */
export async function updateShopPreset({
    shopId,
    type,
    data
}: {
    shopId: string;
    type: 'map' | 'menu' | 'camera';
    data: any;
}) {
    const supabase = await createServerClient();

    let updateData = {};
    if (type === 'map') {
        updateData = {
            business_hours: data.hours,
            irregular_holidays: data.holidays,
            address_jp: data.address,
            address_en: data.access_en,
            google_map_url: data.map_url
        };
    } else if (type === 'menu') {
        updateData = {
            preset_menu_en: data.description,
            dietary_restrictions: data.restrictions
        };
    } else if (type === 'camera') {
        updateData = {
            shoot_elements: data.elements,
            shoot_time_slot: data.time,
            shoot_staff_appearance: data.staff,
            shoot_rules_en: data.special
        };
    }

    const { error } = await supabase
        .from('shops')
        .update(updateData)
        .eq('id', shopId);

    if (error) {
        console.error("🔥 Shop Preset Update Error:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
