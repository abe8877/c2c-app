// src/app/advertiser/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import VibeCatalogue, { Creator } from './_components/VibeCatalogue';
import OnboardingModal from './_components/OnboardingModal';

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

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
        redirect('/login');
    }

    const { data: creators, error } = await supabase
        .from('creators')
        .select('id, name, tiktok_handle, genre, ethnicity, vibe_tags, followers, thumbnail_url, avatar_url, portfolio_video_urls, tier, is_public, is_hot, is_ai_recommended, review_status, pricing_guide')
        .eq('is_public', true)
        .eq('review_status', 'approved')
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

            // ★修正ポイント: 本人のアップロード画像があれば優先、なければジャンル画像（今回の要件でFallback UIが対応するためここはそのままDBの値を渡す）
            thumbnail_url: c.thumbnail_url || c.avatar_url || null,

            portfolio_video_urls: c.portfolio_video_urls || [],
            tier: c.tier || '-',
            is_public: !!c.is_public,
            is_hot: !!c.is_hot,
            is_ai_recommended: !!c.is_ai_recommended,
            review_status: c.review_status,
            pricing_guide: c.pricing_guide // 追加
        };
    });

    // 1. 本番用: ログインユーザーの店舗データ取得
    const { data: myShop } = await supabase.from('shops').select('*').eq('id', session.user.id).single();
    const clientTag = myShop?.client_tag || "WAGYU OMAKASE 凛";

    // Supabaseからサムネイルを持っているS/Aランククリエイターを取得
    const { data: topCreators } = await supabase
        .from('creators')
        .select('thumbnail_url, name')
        .eq('is_public', true)
        .not('thumbnail_url', 'is', null) // サムネがある人のみ
        .order('followers', { ascending: false })
        .limit(5);

    // 2. 統計情報の取得 (交渉中、獲得動画、資産鮮度)
    let stats = {
        offeredCount: 0,
        completedCount: 0,
        freshness: 0
    };

    if (session.user.id) {
        const { data: allAssets } = await supabase
            .from('assets')
            .select('status, created_at, published_at, delivery_at, visit_at')
            .eq('shop_id', session.user.id);

        if (allAssets) {
            stats.offeredCount = allAssets.filter(a => a.status === 'OFFERED').length;
            stats.completedCount = allAssets.filter(a => ['COMPLETED', 'DELIVERED', 'FINALIZED'].includes(a.status) || (a.status === 'WORKING' && a.published_at)).length;

            // 鮮度計算: 投稿後2週間(14日)は100%を維持、その後4週間目(28日)で20%まで線形に減衰
            const completedAssets = allAssets.filter(a => ['COMPLETED', 'DELIVERED', 'FINALIZED', 'APPROVED'].includes(a.status));
            if (completedAssets.length > 0) {
                let totalFreshness = 0;
                let countWithDate = 0;
                completedAssets.forEach(a => {
                    const referenceDateRaw = a.published_at || a.delivery_at || a.visit_at || a.created_at;
                    // 数値の0や無効な値をスキップ
                    if (!referenceDateRaw || referenceDateRaw === '0' || referenceDateRaw === 0) return;

                    const refTime = (typeof referenceDateRaw === 'number' && referenceDateRaw > 1000000000) 
                        ? referenceDateRaw * 1000 
                        : referenceDateRaw;
                    
                    const dateObj = new Date(refTime);
                    if (isNaN(dateObj.getTime())) return;

                    const daysOld = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 3600 * 24));
                    if (daysOld < 0) return; // 未来の日付は無視

                    let assetFreshness = 100;
                    if (daysOld > 30) {
                        const decayDays = daysOld - 30;
                        const decayRate = (80 / 30); 
                        assetFreshness = Math.max(20, Math.round(100 - decayDays * decayRate));
                    }
                    totalFreshness += assetFreshness;
                    countWithDate++;
                });
                stats.freshness = countWithDate > 0 ? Math.round(totalFreshness / countWithDate) : 0;
            } else {
                stats.freshness = 0;
            }
        }
    }

    // 3. 自分の店に紐づく資産だけを取得 (クリエイター情報も一緒に)
    let assets: any[] = [];
    if (clientTag) {
        const { data: fetchedAssets } = await supabase
            .from('assets')
            .select(`
                *,
                creator: creators ( name, tiktok_handle, portfolio_video_urls, avatar_url, thumbnail_url )
            `)
            .eq('shop_id', session.user.id);

        if (fetchedAssets) {
            assets = fetchedAssets;
        }
    }

    return (
        <VibeCatalogue
            initialCreators={enrichedCreators}
            initialAssets={assets}
            clientTag={clientTag}
            stats={stats}
            topCreators={topCreators || []}
        />
    );
}