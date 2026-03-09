// src/app/admin/layout.tsx
// ※ここに "use client" は絶対に書かない（Server Componentになります）
import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

// ここで安全にSEO（noindex）を設定
export const metadata: Metadata = {
    title: 'NOTS Admin | MANEKEY',
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