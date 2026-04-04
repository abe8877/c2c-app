// app/api/admin/curate/route.ts

import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('id');
    const secret = searchParams.get('secret');

    // 1. セキュリティチェック (運営用パスワードの検証)
    if (secret !== process.env.ADMIN_SECRET_KEY) {
        return new NextResponse('Unauthorized: 無効なセキュリティキーです。', { status: 401 });
    }

    if (!creatorId) {
        return new NextResponse('Bad Request: クリエイターIDが指定されていません。', { status: 400 });
    }

    // 2. Supabase Admin クライアントの初期化 (RLSバイパス)
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. クリエイター情報の取得
    const { data: creator, error: fetchError } = await supabaseAdmin
        .from('creators')
        .select('id, name, email, status')
        .eq('id', creatorId)
        .single();

    if (fetchError || !creator) {
        return new NextResponse('Not Found: クリエイターが見つかりません。', { status: 404 });
    }

    // 既に承認済みの場合はエラーにせず完了画面を出す
    if (creator.status === 'onboarded' || creator.status === 'active') {
        return new NextResponse('既に承認済みのクリエイターです。', { status: 200 });
    }

    // 4. ステータスを 'onboarded' に更新し、ダッシュボードを解放
    const { error: updateError } = await supabaseAdmin
        .from('creators')
        .update({
            status: 'onboarded',
            is_onboarded: true,
            updated_at: new Date().toISOString(),
        })
        .eq('id', creatorId);

    if (updateError) {
        console.error("Update Error:", updateError);
        return new NextResponse('Internal Server Error: ステータスの更新に失敗しました。', { status: 500 });
    }

    // 5. 🌟 クリエイターへの承認完了通知 (n8n Webhook等へPOST送信)
    const webhookUrl = process.env.N8N_APPROVAL_WEBHOOK_URL;
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    creatorId: creator.id,
                    name: creator.name,
                    email: creator.email, // ここ宛にn8nでメールを飛ばす
                    loginUrl: 'https://insiders-hub.jp/creator/login'
                })
            });
        } catch (error) {
            console.error("Webhook trigger failed:", error);
            // エラーが起きても承認自体は完了しているため、処理は止めない
        }
    }

    // 6. 運営に表示する完了画面（Functional Noir UI）
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>承認完了 | INSIDERS.</title>
        <style>
            body { background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { text-align: center; border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 16px; background-color: #09090b; box-shadow: 0 0 40px rgba(16, 185, 129, 0.1); }
            .icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 24px; border: 1px solid rgba(16, 185, 129, 0.5); }
            h1 { font-size: 20px; font-weight: 600; margin-bottom: 12px; color: #fff; letter-spacing: 0.05em; }
            p { color: #a1a1aa; font-size: 13px; margin-bottom: 6px; }
            .highlight { color: #10b981; font-weight: bold; }
            .status { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #52525b; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">✓</div>
            <h1>Curation Approved</h1>
            <p>クリエイター <span class="highlight">${creator.name}</span> の審査を承認しました。</p>
            <p>クリエイター宛にダッシュボード解放の自動メールが送信されました。</p>
            <div class="status">System Code: 200 OK / VIBE MATCHED</div>
        </div>
    </body>
    </html>
    `;

    return new NextResponse(htmlContent, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}