'use server'

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function translateText(text: string) {
    if (!text) return { success: false, translatedText: '' };

    try {
        const { text: translatedText } = await generateText({
            model: google('gemini-2.5-flash'),
            system: "You are a professional translator for inbound tourism in Japan. Translate the given Japanese text to natural, appealing English as if it were written for foreign tourists visiting an establishment on a platform like Yelp or TripAdvisor. Do not enclose the output in quotes. Output only the translated English text.",
            prompt: text
        });

        return { success: true, translatedText: translatedText.trim() };
    } catch (error) {
        console.error('Translation error:', error);
        return { success: false, error: '翻訳に失敗しました。' };
    }
}
