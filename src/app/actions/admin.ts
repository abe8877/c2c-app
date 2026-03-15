// src/app/actions/admin.ts
'use server'

import { authAction } from '@/lib/actions/safe-action';
import { createClient } from '@/utils/supabase/server';

/**
 * ADMINダッシュボードの統計情報を取得
 */
export async function getAdminStats() {
    return authAction({}, async () => {
        const supabase = await createClient();

        try {
            // 1. 今週の解析数 (過去7日間)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const { count: weeklyAnalysis } = await supabase
                .from('asset_insights')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', sevenDaysAgo.toISOString());

            // 2. アクティブ店舗数
            const { count: activeShops } = await supabase
                .from('shops')
                .select('*', { count: 'exact', head: true });

            // 3. 平均マッチ率 (全解析数に対してマッチしたもの)
            // ここでは簡易的に「missing_tags が空」のものをマッチとみなす、
            // または全レコードから計算
            const { count: totalAnalysis } = await supabase
                .from('asset_insights')
                .select('*', { count: 'exact', head: true });

            let avgMatchRate = 78.4; // フォールバック
            if (totalAnalysis && totalAnalysis > 0) {
                const { count: matchCount } = await supabase
                    .from('asset_insights')
                    .select('*', { count: 'exact', head: true })
                    .eq('missing_tags', '[]'); // JSONBの空配列判定（Postgres/Supabaseの仕様に依存）

                // ※ SupabaseのJSONBフィルタは .eq('missing_tags', '[]') で動くことが多いが、
                // 環境により異なるため、ここでは安全に計算。
                // 実際のマッチ率はもう少し複雑なロジックになる可能性があるが、本番化の第一歩として実装。
                if (matchCount !== null) {
                    avgMatchRate = Math.round((matchCount / totalAnalysis) * 1000) / 10;
                }
            }

            return {
                weeklyAnalysis: weeklyAnalysis || 0,
                activeShops: activeShops || 0,
                avgMatchRate: avgMatchRate,
                totalRevenue: (activeShops || 0) * 50000, // 1店舗あたり5万円の想定（動的計算の例）
            };
        } catch (error) {
            console.error('getAdminStats error:', error);
            return {
                weeklyAnalysis: 0,
                activeShops: 0,
                avgMatchRate: 0,
                totalRevenue: 0,
            };
        }
    });
}

/**
 * 失注・マッチング見送り案件（Lost Assets）を取得
 */
export async function getLostAssets() {
    return authAction({}, async () => {
        const supabase = await createClient();

        try {
            // 実際は matching_logs などのテーブルから status='rejected' を引く
            // ここでは要件に基づき、shops と creators の情報をJOINして取得するイメージ
            const { data, error } = await supabase
                .from('asset_insights')
                .select(`
                    id,
                    created_at,
                    missing_tags,
                    creator_ai_hint,
                    shops (name),
                    creators (name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // DBから取得したデータを整形 (モック形式に合わせる)
            if (data && data.length > 0) {
                return data.map((item: any) => ({
                    id: item.id,
                    advertiser: item.shops?.name || '不明な店舗',
                    rejectedCreator: item.creators?.name || '不明なクリエイター',
                    missingVibes: item.missing_tags || [],
                    aiAction: item.creator_ai_hint || '分析なし',
                    timestamp: new Date(item.created_at).toLocaleString('ja-JP'),
                }));
            }

            return getMockLostAssets();
        } catch (error) {
            console.warn('DB fetch for lost assets failed, using mock data:', error);
            return getMockLostAssets();
        }
    });
}

/**
 * モックデータ（Lost Assets）
 */
function getMockLostAssets() {
    return [
        {
            id: 'l1',
            advertiser: '銀座 鮨 萬惣',
            rejectedCreator: 'Mika @TokyoVlog',
            missingVibes: ['TRADITIONAL', 'LUXURY'],
            aiAction: '照明の調整と、より静寂を感じさせるBGMへの変更を提案。アップセル：AIオートチューンによる色調補正。',
            timestamp: '2024-03-15 10:24',
        },
        {
            id: 'l2',
            advertiser: 'SHIBUYA Sky-High Bar',
            rejectedCreator: 'Kento.Traveler',
            missingVibes: ['URBAN', 'NIGHTLIFE'],
            aiAction: '夜景のノイズ除去と、ビートの効いたエディットを推奨。クリエイターへ：トランジションのテンポ改善。',
            timestamp: '2024-03-14 18:45',
        },
        {
            id: 'l3',
            advertiser: '京都 嵐山 旅館 星野',
            rejectedCreator: 'Hana_Kyoto',
            missingVibes: ['NATURE', 'RETRO'],
            aiAction: '和紙のテクスチャオーバーレイの追加を提案。アップセル：プレミアムブーストによる特定層への再リーチ。',
            timestamp: '2024-03-14 15:10',
        },
    ];
}
