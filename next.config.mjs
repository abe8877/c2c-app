import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: process.env.NODE_ENV === "development", // 開発中はPWAを無効化
    workboxOptions: {
        disableDevLogs: true,
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qetdkqjkveutmlhqvvaq.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/avatars/**', // avatarsバケットに限定
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', // モックデータ用
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com', // n8n + GCS ワーカーからのサムネイル
            },
        ],
    },
    // 開発環境のTurbopack競合対策 (next-pwaがwebpack依存のため)
    turbopack: {},
};


export default withPWA(nextConfig);
