// src/app/demo/analyzing/page.tsx

import { createClient } from '@/utils/supabase/server';
import { AnalysisView } from './_components/AnalysisView';

// ユーザーが選んだジャンルごとに表示する「それっぽいタグ」定義
const GENRE_TAG_MAPPING: Record<string, string[]> = {
    FOOD: ['#和モダン', '#自然光', '#隠れ家', '#シズル感', '#行列のできる店'],
    BEAUTY: ['#透明感', '#韓国風', '#ナチュラル', '#モーニングルーティン', '#清潔感'],
    TRAVEL: ['#絶景', '#穴場スポット', '#Vlog', '#街歩き', '#非日常'],
    EXPERIENCE: ['#没入感', '#体験型', '#ワークショップ', '#ナイトライフ', '#エモい'],
    LIFESTYLE: ['#丁寧な暮らし', '#ミニマリスト', '#空間デザイン', '#リラックス', '#Wellness']
};

export default async function AnalyzingPage({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
    const supabase = await createClient();
    const resolvedParams = await searchParams;

    // 1. URLからジャンルを取得 (デフォルトはFOOD)
    const genre = (resolvedParams.genre || 'FOOD').toUpperCase();

    // 2. そのジャンルのクリエイター実数をDBから取得
    const { count } = await supabase
        .from('creators')
        .select('*', { count: 'exact', head: true })
        .eq('genre', genre);

    // 3. ジャンルに合わせたタグを選択
    const detectedTags = GENRE_TAG_MAPPING[genre] || GENRE_TAG_MAPPING['FOOD'];

    return (
        <AnalysisView
            matchCount={count || 0}
            genre={genre}
            tags={detectedTags}
        />
    );
}
