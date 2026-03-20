import CreatorDashboardContent from "./CreatorDashboardContent";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CreatorDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // クリエイタープロフィールの取得
    const { data: creator } = await supabase
        .from('creators')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!creator) {
        // プロフィールがない場合はログイン画面へリダイレクト（挙動確認用）
        redirect("/login");
    }

    // 1. クリエイターデータの整形
    const creatorData = {
        id: creator.id,
        name: creator.name || creator.tiktok_handle || "New Creator",
        tier: creator.tier ? `Tier ${creator.tier}` : "Tier B",
        avatarUrl: creator.avatar_url || creator.thumbnail_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
        assetsGenerated: 0, // あとで集計
        nextMilestone: 15,
        hitKeywords: creator.vibe_tags || [], // HitKeywordsの代わりに一旦vibe_tagsを使用
    };

    // 2. 招待（マッチングする店舗）の取得
    // 本来はVibeマッチングロジックを通しますが、デモ用に最新の店舗をいくつか取得
    const { data: shops } = await supabase
        .from('shops')
        .select('*')
        .limit(5);

    const exclusiveInvites = (shops || []).map(shop => ({
        id: shop.id,
        name: shop.name || "Unnamed Shop",
        genre: shop.genre || "Lifestyle",
        vibe: shop.shop_vibe_tags?.[0] || "Modern",
        thumbnail: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=500&q=80",
    }));

    // 3. アセット履歴の取得
    const { data: assetsFetched } = await supabase
        .from('assets')
        .select(`
            *,
            shop: shops ( name, shop_vibe_tags )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

    const assets = (assetsFetched || []).map(a => ({
        id: a.id,
        shopName: a.shop?.name || "Unknown Shop",
        status: a.status as any,
        date: a.created_at ? new Date(a.created_at).toLocaleDateString() : "-",
        shopRequirements: a.offer_details?.selectedTags || a.shop?.shop_vibe_tags || [],
        creatorTags: creator.vibe_tags || []
    }));

    // 実績数の集計
    creatorData.assetsGenerated = assets.filter(a => a.status === 'APPROVED' || a.status === 'COMPLETED' || a.status === 'approved').length;

    return (
        <CreatorDashboardContent
            creatorData={creatorData}
            exclusiveInvites={exclusiveInvites}
            assets={assets}
        />
    );
}