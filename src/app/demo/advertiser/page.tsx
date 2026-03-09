// src/app/demo/advertiser/page.tsx
import { createClient } from '@/utils/supabase/server';
import VibeCatalogue, { Creator } from './_components/VibeCatalogue';

// ジャンルごとの高品質な画像リスト (Unsplash)
const GENRE_IMAGES: Record<string, string[]> = {
    FOOD: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', // 肉/料理
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80', // ピザ
        'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80', // 皿
        'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80', // スイーツ
    ],
    BEAUTY: [
        'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80', // ブラシ
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80', // メイク
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80', // コスメ
    ],
    TRAVEL: [
        'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80', // 日本の夜景
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80', // 路地裏
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80', // 東京タワー
    ],
    EXPERIENCE: [
        'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80', // 夜の街
        'https://images.unsplash.com/photo-1515876305430-c75a5b34708c?auto=format&fit=crop&q=80', // チームラボ風
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80', // 渋谷
    ],
    LIFESTYLE: [
        'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&q=80', // ヨガ/ジム
        'https://images.unsplash.com/photo-1544367563-12123d832d34?auto=format&fit=crop&q=80', // スパ
    ]
};

// ヘルパー: 配列からランダムに1つ取得（ハッシュ関数的にインデックスを使う）
const getImageForGenre = (genre: string, index: number) => {
    const images = GENRE_IMAGES[genre] || GENRE_IMAGES['LIFESTYLE'];
    return images[index % images.length];
};

export default async function AdvertiserPage() {
    const supabase = await createClient();

    const { data: creators, error } = await supabase
        .from('creators')
        .select('*')
        .order('followers', { ascending: false }) // フォロワー順
        .limit(100);

    if (error) {
        console.error("Error fetching creators:", error);
        return <div className="p-8 text-red-500">Error loading catalogue. Check logs.</div>;
    }

    // データの整形 (DBの型 -> UIの型)
    const enrichedCreators: Creator[] = (creators || []).map((c, i) => {
        // ジャンルを正規化 (DBの値が小文字だったりする場合の対策)
        const genreKey = Array.isArray(c.genre) ? c.genre : (c.genre ? [c.genre] : ['LIFESTYLE']);

        return {
            id: c.id,
            name: c.name || c.tiktok_handle || `creator_${i}`,
            genre: c.genre || 'LIFESTYLE',
            ethnicity: c.ethnicity || 'ASIA',
            vibe_tags: c.vibe_tags || [],
            followers: c.followers ? c.followers.toLocaleString() : '0',

            // ★修正ポイント: 本人のアップロード画像があれば優先、なければジャンル画像
            thumbnail_url: c.avatar_url
                ? c.avatar_url
                : getImageForGenre(genreKey, i),

            portfolio_video_urls: c.portfolio_video_urls || (c.portfolio_video_url ? [c.portfolio_video_url] : [])
        };
    });

    // 1. (デモ用) 自分の店舗ID（client_tag）を取得
    const { data: myShop } = await supabase.from('shops').select('client_tag').limit(1).single();
    const clientTag = myShop?.client_tag;

    // 2. 自分の店に紐づく資産だけを取得 (クリエイター情報も一緒に)
    let assets: any[] = [];
    if (clientTag) {
        const { data: fetchedAssets } = await supabase
            .from('assets')
            .select(`
                *,
                creator: creators ( name, tiktok_handle, portfolio_video_urls, avatar_url )
            `)
            .eq('client_tag', clientTag);

        if (fetchedAssets) {
            assets = fetchedAssets;
        }
    }

    return (
        <VibeCatalogue initialCreators={enrichedCreators} initialAssets={assets} clientTag={clientTag} />
    );
}