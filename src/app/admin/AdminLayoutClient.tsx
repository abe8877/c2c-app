"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, MessageCircle, BarChart3, Settings } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'VIBE Master', icon: Sparkles, href: '/admin' },
        { name: 'CS (Inbox)', icon: MessageCircle, href: '/admin/cs' },
        { name: 'Matching Logs', icon: BarChart3, href: '/admin?tab=logs' }, // 将来的に separation する場合は '/admin/logs'
        { name: 'Settings', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex flex-shrink-0">
                <div className="p-6 text-white font-bold text-xl tracking-tighter">
                    NOTS <span className="text-yellow-500">ADMIN</span>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        // Matching Logs の場合は pathname が /admin 且つクエリパラメータを考慮する必要があるが、
                        // ここでは簡易的に href の完全一致で判定
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-3 rounded-lg cursor-pointer font-bold flex items-center gap-2 transition ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}