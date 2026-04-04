import CreatorDashboardContent from "./CreatorDashboardContent";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CreatorDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/creator/login");
    }

    // 🔴 修正: 'id' ではなく 'auth_id' でクリエイターを検索する
    const { data: creator } = await supabase
        .from('creators')
        .select('id, name, tiktok_handle, tier, avatar_url, thumbnail_url, vibe_tags, is_hot, status')
        .eq('auth_id', user.id)
        .single();

    if (!creator) {
        // プロフィールがない場合はログイン画面へリダイレクト
        redirect("/creator/login");
    }

    // 🌟 3. ダッシュボード: 審査中ガード (Gatekeeper) の実装
    if (creator.status === 'under_review' || creator.status === 'pending') {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 selection:bg-zinc-800">
                <div className="max-w-md w-full text-center space-y-12">
                    {/* Spinning Loading Animation with Glassmorphism Effect */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-2 border-white/5 mx-auto flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-t-2 border-emerald-500 animate-spin" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] tracking-[0.4em] font-black text-zinc-500 uppercase">System Status</p>
                            <h1 className="text-3xl font-playfair italic font-light tracking-tight text-white flex items-center justify-center gap-3">
                                審査中 <span className="text-zinc-600 font-sans not-italic text-sm tracking-widest">(Under Review)</span>
                            </h1>
                        </div>

                        <div className="p-6 bg-zinc-950 border border-white/5 rounded-3xl space-y-4">
                            <p className="text-xs text-zinc-400 font-light tracking-wide leading-relaxed">
                                ご応募ありがとうございます。<br />
                                現在キュレーションチームがあなたのポートフォリオと<span className="text-white font-medium border-b border-zinc-700">VIBE</span>を審査しています。<br />
                                結果が出るまで、今しばらくお待ちください。
                            </p>

                            <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-medium tracking-widest uppercase">
                                    Curator: <span className="text-zinc-400">Reviewing Portfolio</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <a href="/creator/login" className="text-[10px] tracking-[0.2em] font-medium uppercase text-zinc-500 hover:text-white transition-colors border-b border-zinc-800 pb-1">
                                Logout and Exit
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 1. クリエイターデータの整形
    const creatorData = {
        id: creator.id,
        name: creator.name || creator.tiktok_handle || "New Creator",
        tier: creator.tier ? `Tier ${creator.tier}` : "Tier B",
        avatarUrl: creator.avatar_url || creator.thumbnail_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
        assetsGenerated: 0,
        nextMilestone: 15,
        hitKeywords: creator.vibe_tags || [],
        isHot: creator.is_hot || false,
    };

    // 2. 招待（マッチングする店舗）の取得
    const { data: shops } = await supabase
        .from('shops')
        .select('id, name, genre, shop_vibe_tags')
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
            id, status, created_at, offer_details,
            shop: shops ( name, shop_vibe_tags )
        `)
        .eq('creator_id', creator.id) // 🔴 ここも auth.users.id ではなく creator.id に修正
        .order('created_at', { ascending: false });

    const assets = (assetsFetched || []).map(a => {
        const shopData = Array.isArray(a.shop) ? a.shop[0] : a.shop;
        return {
            id: a.id,
            shopName: shopData?.name || "Unknown Shop",
            status: a.status as any,
            date: a.created_at ? new Date(a.created_at).toLocaleDateString() : "-",
            shopRequirements: a.offer_details?.selectedTags || shopData?.shop_vibe_tags || [],
            creatorTags: creator.vibe_tags || []
        };
    });

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