import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MANEKEY - VIBE to ASSET',
        short_name: 'MANEKEY',
        description: 'Elevate Your Creator Career. Exclusive invites for Tier-S creators.',
        start_url: '/demo/creator',
        display: 'standalone', // ブラウザのUIを隠し、ネイティブアプリのように見せる
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/icons/icon-192x192.png', // ※public/icons/配下に画像を配置してください
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
