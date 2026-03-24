"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Sparkles, Crown, ShieldCheck } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function SettingsPage() {
    const router = useRouter();
    const [emailNotifications, setEmailNotifications] = useState(true);
    // const [lineNotifications, setLineNotifications] = useState(false); // 使っていない場合はコメントアウト/削除でOK
    const [shop, setShop] = useState<any>(null);

    // 🌟 追加：Stripeポータル遷移のローディング状態管理
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchShop = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('shops')
                    .select('name, is_premium, free_offers_remaining')
                    .eq('id', user.id)
                    .single();
                if (data) setShop(data);
            }
        };
        fetchShop();
    }, [supabase]);

    // 🌟 追加：Stripeカスタマーポータルへの遷移ハンドラー
    const handlePortalRedirect = async () => {
        setIsPortalLoading(true);
        try {
            // Task 1で作成したAPI Routeを呼び出す
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'エラーが発生しました');

            // 取得したStripeのポータルURLへ遷移
            window.location.href = data.url;
        } catch (error: any) {
            console.error(error);
            alert(`エラー: ${error.message}`);
        } finally {
            setIsPortalLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/advertiser')} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-500 hover:text-slate-900">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-black tracking-tight text-slate-900">機能・サブスクリプション設定</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Notifications Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900">通知設定</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">メール通知</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">マッチング結果や重要なお知らせをメールで受け取る</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                            </label>
                        </div>
                    </div>
                </motion.section>

                {/* Free Offers + Subscription Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200"
                >
                    {/* 🎁 無料オファー枠の表示（PLGの超重要KPI） */}
                    <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100 mb-6 flex items-center justify-between shadow-sm">
                        <div>
                            <h3 className="font-bold text-teal-900 mb-1 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-teal-600" /> 無料オファー特典（招待枠）
                            </h3>
                            <p className="text-sm text-teal-700">残りの招待コード利用枠です。0になるとベーシックプランへの移行が必要です。</p>
                        </div>
                        <div className="text-4xl font-black text-teal-600 drop-shadow-sm">
                            {shop?.free_offers_remaining ?? 0} <span className="text-sm font-bold text-teal-600/70">回</span>
                        </div>
                    </div>

                    {/* サブスクリプション管理エリア */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="mb-6">
                            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                                <Crown className="w-5 h-5 text-amber-500" /> サブスクリプション管理
                            </h3>
                            <p className="text-sm text-slate-500">現在のプランとお支払い情報の設定</p>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-6 text-white mb-6 flex justify-between items-center shadow-lg">
                            <div>
                                <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-teal-400" /> 現在アクティブなプラン
                                </div>
                                <div className="text-xl font-black">
                                    {shop?.is_premium ? "Premium Shop プラン" : "トライアルプラン"}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-amber-400">
                                    {shop?.is_premium ? "¥39,800" : "¥0"}<span className="text-sm text-slate-400">/月</span>
                                </div>
                            </div>
                        </div>

                        {/* 💳 Stripeポータルへの導線 */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                                クレジットカードの変更、領収書のダウンロード、プランのアップグレードや解約は専用ポータルから行えます。
                            </p>
                            <button
                                onClick={handlePortalRedirect}
                                disabled={isPortalLoading}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPortalLoading ? '読み込み中...' : 'お支払い情報・プランの管理'}
                            </button>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}