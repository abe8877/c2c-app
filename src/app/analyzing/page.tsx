// src/app/analyzing/page.tsx

import { createClient } from '@/utils/supabase/server';
import { AnalysisView } from './_components/AnalysisView';
import { analyzeShopVibe } from '@/app/actions/analyze-shop-vibe';

export default async function AnalyzingPage({ searchParams }: { searchParams: Promise<{ genre?: string; url?: string }> }) {
    const resolvedParams = await searchParams;
    const url = resolvedParams.url;
    const genre = (resolvedParams.genre || 'FOOD').toUpperCase();

    // 1. サーバーアクションを直接呼び出して解析を実行 (URLがある場合)
    let detectedTags: string[] = [];
    let matchCount = 0;

    if (url) {
        try {
            const result = await analyzeShopVibe(url);
            if (result.success) {
                detectedTags = result.tags || [];
                matchCount = result.matchCount || 0;
            }
        } catch (error) {
            console.error('Analysis failed:', error);
        }
    }

    // 2. 解析に失敗した、またはURLがない場合のフォールバック (それっぽいモック)
    if (detectedTags.length === 0) {
        const GENRE_TAG_MAPPING: Record<string, string[]> = {
            FOOD: ['#和モダン', '#自然光', '#隠れ家', '#シズル感', '#行列のできる店'],
            BEAUTY: ['#透明感', '#ナチュラル', '#モーニングルーティン', '#清潔感'],
            TRAVEL: ['#絶景', '#穴場スポット', '#Vlog', '#街歩き', '#非日常'],
            EXPERIENCE: ['#没入感', '#体験型', '#ワークショップ', '#ローカル体験'],
            LIFESTYLE: ['#丁寧な暮らし', '#ミニマリスト', '#空間デザイン', '#リラックス', '#Wellness']
        };
        detectedTags = GENRE_TAG_MAPPING[genre] || GENRE_TAG_MAPPING['FOOD'];

        // クライアント実数を取得
        const supabase = await createClient();
        const { count } = await supabase
            .from('creators')
            .select('*', { count: 'exact', head: true })
            .eq('genre', genre);
        matchCount = count || 0;
    }

    return (
        <AnalysisView
            matchCount={matchCount}
            genre={genre}
            tags={detectedTags}
        />
    );
}
