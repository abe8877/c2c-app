// src/app/admin/layout.tsx
// ※ここに "use client" は絶対に書かない（Server Componentになります）
import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

// ここで安全にSEO（noindex）を設定
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://insiders-hub.jp'),
    title: 'NOTS Admin | INSIDERS',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // UIの描画は全てClientコンポーネントに任せる
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}