export type CreatorRank = 'S' | 'A' | 'B';

export interface CreatorData {
    id: string;
    product_category: string; // client_tag
    creator_name: string;     // author_name
    tiktok_url: string;
    hit_keywords: string[];   // カンマ区切りを配列化
    hit_video_urls: string[]; // 新規追加カラム
    region_type: '🌏 Both' | '✈️ Tabimae (US)' | '📍 Tabinaka (JP)' | 'Unknown';
    followers: number;
    hit_videos_count: number;
    total_saves: number;
    median_views: number;
    engagement_rate: number;
    is_public: boolean;
    // UI表示用に追加する計算フィールド
    rank: CreatorRank;
}