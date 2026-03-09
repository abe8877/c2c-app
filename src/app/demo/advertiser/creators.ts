// src/app/demo/advertiser/creators.ts

export type Creator = {
    id: string;
    name: string;
    tier: 'S' | 'A' | 'B' | '-';
    genre: string;
    ethnicity: string;
    followers: string;
    tiktokUrl: string;
    matchScore: number;
    imgColor: string;
    bio: string;
    vibeTags: string[];
    vibeCluster: 'TRADITIONAL' | 'URBAN' | 'KAWAII' | 'NATURE' | 'LUXURY' | 'RETRO';
    heroVideo: string;
};

export const creatorsData: Creator[] = [
    {
        id: "1",
        name: "Sarah Jenkins",
        tier: "S",
        genre: "SHOPPING",
        ethnicity: "UK 🇬🇧",
        followers: "123.7k",
        tiktokUrl: "https://www.tiktok.com/@itsgracechin",
        matchScore: 98,
        imgColor: "bg-stone-300",
        bio: "Capture the silence of Kyoto.",
        vibeTags: ["#Cinematic", "#Silent", "#WabiSabi"],
        vibeCluster: "TRADITIONAL",
        // 京都・着物（Coverr CDN）
        // heroVideo: "https://github.com/user-attachments/assets/db30730d-2e21-49b9-a477-96c2049d9724", // ※デモ用ダミー（下で解説）
        // 実際の開発時はpublicフォルダにmp4を置くのが確実ですが、一旦Web上の安定リンクを使います↓
        // heroVideo: "https://videos.coverr.co/videos/coverr-walking-in-kyoto-4638/1080p.mp4" 
        // もし上記が切れていたら、以下の安定リンクを使ってください
        heroVideo: "https://videos.pexels.com/video-files/5744046/5744046-uhd_2732_1440_30fps.mp4"
    },
    {
        id: "2",
        name: "Liam Wong",
        tier: "S",
        genre: "LIFESTYLE",
        ethnicity: "Canada 🇨🇦",
        followers: "134.2k",
        tiktokUrl: "https://www.tiktok.com/@_dianajapan",
        matchScore: 94,
        imgColor: "bg-stone-800",
        bio: "Cyberpunk vibes in Tokyo night streets.",
        vibeTags: ["#NightPhotography", "#Neon", "#Cyberpunk"],
        vibeCluster: "URBAN",
        // 東京・夜景
        heroVideo: "https://videos.pexels.com/video-files/3205791/3205791-hd_1080_1920_25fps.mp4"
    },
    {
        id: "3",
        name: "Elena Rossi",
        tier: "A",
        genre: "FOOD",
        ethnicity: "Italy 🇮🇹",
        followers: "56.4k",
        tiktokUrl: "https://www.tiktok.com/@arinanegishi",
        matchScore: 89,
        imgColor: "bg-orange-200",
        bio: "Looking for the sweetest Matcha sweets.",
        vibeTags: ["#Sweets", "#CafeHopping", "#Kawaii"],
        vibeCluster: "KAWAII",
        // カフェ・スイーツ
        heroVideo: "https://videos.pexels.com/video-files/4932626/4932626-hd_1080_1920_25fps.mp4"
    },
    {
        id: "4",
        name: "djvivid",
        tier: "A",
        genre: "TRAVEL",
        ethnicity: "AMERICA",
        followers: "1.6M",
        tiktokUrl: "https://www.tiktok.com/@aylennpark",
        matchScore: 91,
        imgColor: "bg-blue-200",
        bio: "Explaining Japan culture to the world.",
        vibeTags: ["#Vlog", "#Experience", "#Fun"],
        vibeCluster: "NATURE",
        // 旅行・自然
        heroVideo: "https://videos.pexels.com/video-files/4122396/4122396-hd_1080_1920_30fps.mp4"
    },
];