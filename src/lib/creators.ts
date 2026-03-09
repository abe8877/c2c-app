import creatorsData from '@/data/creators.json';
import { CreatorData, CreatorRank } from '@/types/creator';

// 生データを型付きデータに変換・加工する関数
export const getCreators = (): CreatorData[] => {
    return creatorsData.map((item: any) => {
        // ランク付けロジック（仮）
        let rank: CreatorRank = 'B';
        if (item.followers > 100000 && item.engagement_rate > 5) rank = 'S';
        else if (item.followers > 50000) rank = 'A';

        return {
            ...item,
            // BQからCSV経由だと文字列で来る場合があるため、数値型変換などを噛ませると安全
            followers: Number(item.followers),
            engagement_rate: Number(item.engagement_rate),
            is_public: item.is_public ?? true,
            rank,
        };
    });
};

// 広告主（ユーザー）向け：公開されている人だけ返す
export const getPublicCreators = () => {
    const all = getCreators();

    // LocalStorage を見て、hidden に入っている ID を除外する (Demo Magic)
    if (typeof window !== "undefined") {
        try {
            const hidden = JSON.parse(localStorage.getItem("hidden_creators") || "[]");
            if (Array.isArray(hidden) && hidden.length > 0) {
                return all.filter(c => !hidden.includes(c.id) && c.is_public === true);
            }
        } catch (e) {
            console.error("Failed to parse hidden_creators from localStorage", e);
        }
    }

    return all.filter(c => c.is_public === true);
};

// 管理者（Admin）向け：全員返す（公開ステータスも確認できるように）
export const getAllCreatorsForAdmin = () => {
    return getCreators();
};

// 特定のカテゴリ（VIBE）でフィルタリング
export const getCreatorsByVibe = (vibeTag: string) => {
    const all = getCreators();
    // 簡易的なキーワードマッチング
    return all.filter(c =>
        c.product_category.includes(vibeTag) ||
        c.hit_keywords.some((k: string) => k.includes(vibeTag))
    );
};