import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // 認証ヘッダーのチェック (Vercel Cronなどのシークレット)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = await createClient();

    // 1. 48時間以上経過した 'OFFERED' ステータスの案件を抽出
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: staleOffers, error: fetchError } = await supabase
        .from('assets')
        .select('*')
        .eq('status', 'OFFERED')
        .lt('created_at', fortyEightHoursAgo);

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!staleOffers || staleOffers.length === 0) {
        return NextResponse.json({ message: 'No stale offers found.' });
    }

    const results = [];

    // 2. 各案件に対して代替案のフラグを立てる (本来はここで代替クリエイターをAIで選定)
    for (const offer of staleOffers) {
        const { error: updateError } = await supabase
            .from('assets')
            .update({ 
                status: 'SUGGESTING_ALTERNATIVES',
                // fallback_suggestions: [...] // ここに代替クリエイターIDを入れる想定
            })
            .eq('id', offer.id);

        results.push({
            id: offer.id,
            success: !updateError,
            error: updateError?.message
        });
    }

    return NextResponse.json({
        processedCount: staleOffers.length,
        details: results
    });
}
