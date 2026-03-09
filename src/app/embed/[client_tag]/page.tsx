import { createClient } from '@/utils/supabase/server';
import { Play } from 'lucide-react';

export default async function EmbedShopAssetsPage({ params }: { params: { client_tag: string } }) {
    const supabase = await createClient();

    // client_tag に紐づく assets を取得し、クリエイター情報も結合
    const { data: assets, error } = await supabase
        .from('assets')
        .select(`
            id, video_url, created_at,
            creator: creators ( name, tiktok_handle, avatar_url, portfolio_video_urls )
        `)
        .eq('client_tag', params.client_tag)
        .order('created_at', { ascending: false });

    if (error || !assets || assets.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 bg-stone-50 text-stone-400 font-bold text-sm min-h-screen">
                動画資産がありません
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.map((asset: any) => {
                    const creatorName = asset.creator?.name || asset.creator?.tiktok_handle || 'Unknown';
                    const src = asset.creator?.avatar_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3000&auto=format&fit=crop';

                    return (
                        <div key={asset.id} className="group relative aspect-[9/16] bg-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <img src={src} alt={creatorName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Play Icon Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/30 backdrop-blur text-white p-3 rounded-full">
                                    <Play className="w-8 h-8 fill-current ml-1" />
                                </div>
                            </div>

                            {/* Creator Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white font-bold text-xs truncate">@{creatorName}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
