"use server";

import { createClient } from "@/utils/supabase/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function sendMessage({
    assetId,
    content,
    senderType
}: {
    assetId: string;
    content: string;
    senderType: 'shop' | 'creator';
}) {
    const supabase = await createClient();

    // 1. AI Translation
    let translatedContent = "";
    try {
        let systemPrompt = "";
        if (senderType === 'shop') {
            systemPrompt = "Translate the following Japanese message to professional, friendly English suitable for business communication with a creator. Output ONLY the translated text.";
        } else {
            systemPrompt = "次のクリエイターからの英語のメッセージを、自然で丁寧な日本語のビジネス表現に翻訳してください。翻訳されたテキストのみを出力してください。";
        }

        const { text } = await generateText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            prompt: content,
        });

        translatedContent = text.trim();
    } catch (error) {
        console.error("Translation Error:", error);
        translatedContent = "[Translation temporarily unavailable]";
    }

    // 2. Save to Database
    // In a real app we'd get these from auth session, but hardcoding for mockup purposes
    const senderId = senderType === 'shop' ? 'demo-shop' : 'demo-creator-id';

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

    return { success: true, message: data };
}
