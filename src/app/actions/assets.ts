"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * アセットの進行状況（タイムライン）を更新する
 */
export async function updateAssetTimeline({
    assetId,
    field,
    value
}: {
    assetId: string;
    field: 'approved_at' | 'filming_at' | 'delivered_at' | 'status';
    value: string | any;
}) {
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const updateData: any = {};
    if (field === 'status') {
        updateData.status = value;
    } else {
        updateData[field] = value || new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
        .from('assets')
        .update(updateData)
        .eq('id', assetId)
        .select()
        .single();

    if (error) {
        console.error("🔥 Asset Update Error:", error);
        throw new Error("Failed to update asset: " + error.message);
    }

    return { success: true, data };
}
