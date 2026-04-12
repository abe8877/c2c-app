"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Sparkles, MessageCircle, BarChart3, Settings, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

// ==========================================
// 1. ナビゲーションメニュー部分
// ==========================================
function AdminNav({ menuItems, pathname, setIsNavigating }: any) {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab');

    return (
        <nav className="flex-1 px-4 space-y-1.5 pt-4">
            {menuItems.map((item: any) => {
                const isLogsTab = item.href.includes('tab=logs');
                const isActive = isLogsTab
                    ? (pathname === '/admin' && currentTab === 'logs')
                    : (pathname === item.href && !currentTab);

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => {
                            if (pathname !== item.href) {
                                setIsNavigating(true);
                            }
                        }}
                        className={`group px-4 py-3 rounded-xl cursor-pointer font-bold flex items-center gap-3 transition-all duration-200 relative ${isActive
                            ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10'
                            : 'hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <item.icon size={18} className={`${isActive ? 'text-yellow-500' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                            <div className="absolute right-2 w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

// ==========================================
// 2. URL監視用コンポーネント（エラー回避のために分離）
// ==========================================
function RouteWatcher({ setIsNavigating }: { setIsNavigating: (val: boolean) => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // パスやパラメータが変わったらローディングを解除する
    React.useEffect(() => {
        setIsNavigating(false);
    }, [pathname, searchParams, setIsNavigating]);

    return null; // UIは何も返さない
}

// ==========================================
// 3. メインレイアウトコンポーネント
// ==========================================
export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isNavigating, setIsNavigating] = React.useState(false);

    const menuItems = [
        { name: 'CREATORS', icon: Sparkles, href: '/admin' },
        { name: 'CS', icon: MessageCircle, href: '/admin/cs' },
        { name: 'MATCHING LOG', icon: BarChart3, href: '/admin?tab=logs' },
        { name: 'SETTINGS', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-hidden">
            {/* 監視コンポーネントをSuspenseで囲んで配置 */}
            <Suspense fallback={null}>
                <RouteWatcher setIsNavigating={setIsNavigating} />
            </Suspense>

            {/* Nav Loading Overlay */}
            {isNavigating && (
                <div className="fixed inset-0 bg-white/20 backdrop-blur-[1px] z-[9999] flex items-center justify-center pointer-events-none">
                    <Loader2 size={32} className="animate-spin text-slate-900 shadow-sm" />
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex flex-shrink-0 z-30 shadow-2xl">
                <div className="p-6 text-white font-bold text-xl tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <span className="text-black text-xs font-black">N</span>
                    </div>
                    <span>NOTS <span className="text-yellow-500">ADMIN</span></span>
                </div>

                {/* メニュー部分もSuspenseで保護 */}
                <Suspense fallback={<div className="flex-1 p-4"><Loader2 className="animate-spin opacity-20" /></div>}>
                    <AdminNav menuItems={menuItems} pathname={pathname} setIsNavigating={setIsNavigating} />
                </Suspense>

                <div className="p-4 border-t border-slate-800/50">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">System Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-slate-300">Operational</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-white">
                {children}
            </main>
        </div>
    );
}