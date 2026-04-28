"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Sparkles, Crown, ShieldCheck, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function SettingsPage() {
    const router = useRouter();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [notify_url, setNotify_url] = useState("");
    const [shop, setShop] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    // 🌟 追加：Stripeポータル遷移のローディング状態管理
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    const supabase = React.useMemo(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), []);

    useEffect(() => {
        const fetchShop = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('shops')
                    .select('name, is_premium, free_offers_remaining, notify_url')
                    .eq('id', user.id)
                    .single();
                if (data) {
                    setShop(data);
                    setNotify_url(data.notify_url || "");
                }
            }
        };
        fetchShop();
    }, [supabase]);

    const handleSaveNotifications = async (enabled: boolean, email: string) => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('shops')
                    .update({
                        notify_url: email
                    })
                    .eq('id', user.id);
                
                if (error) throw error;
                
                // Update local shop state as well
                setShop((prev: any) => ({ ...prev, notify_url: email, email_notifications_enabled: enabled }));
            }
        } catch (error: any) {
            console.error("Save Error:", error);
            alert("保存に失敗しました: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

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
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (window.history.length > 1) {
                                    router.back();
                                } else {
                                    router.push('/advertiser');
                                }
                            }}
                            className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-500 hover:text-slate-900 active:scale-95"
                        >
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
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={emailNotifications}
                                    onChange={(e) => {
                                        const val = e.target.checked;
                                        setEmailNotifications(val);
                                        handleSaveNotifications(val, notify_url);
                                    }}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                            </label>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <h3 className="font-bold text-slate-900 text-sm">通知用メールアドレス</h3>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={notify_url}
                                    onChange={(e) => setNotify_url(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                                />
                                <button
                                    onClick={async () => {
                                        await handleSaveNotifications(emailNotifications, notify_url);
                                        alert("通知設定を保存しました！");
                                    }}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <div className="flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Saving...
                                        </div>
                                    ) : "Save"}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold italic">※設定をONにすると、こちらのアドレスに通知が送信されます。</p>
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
                    <div className="p-5 sm:p-7 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl border border-teal-100 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 space-y-2">
                            <h3 className="font-black text-teal-900 text-base flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-teal-500" /> 無料オファー特典（招待枠）
                            </h3>
                            <p className="text-xs sm:text-sm text-teal-700 leading-relaxed max-w-md font-medium">残りの招待コード利用枠です。0になるとスタンダードプランへの移行が必要です。</p>
                        </div>
                        <div className="relative z-10 flex items-baseline gap-1 self-end sm:self-center">
                            <span className="text-5xl font-black text-teal-600 tracking-tighter tabular-nums drop-shadow-sm">
                                {shop?.free_offers_remaining ?? 0}
                            </span>
                            <span className="text-sm font-black text-teal-600/60 uppercase">回</span>
                        </div>
                    </div>

                    {/* サブスクリプション管理エリア */}
                    <div className="p-1 sm:p-2 bg-slate-50 rounded-[32px] border border-slate-200">
                        <div className="p-6 sm:p-8">
                            <div className="mb-8">
                                <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                    <Crown className="w-6 h-6 text-amber-500" /> サブスクリプション管理
                                </h3>
                                <p className="text-sm text-slate-500 font-medium">現在のプランとお支払い情報の設定</p>
                            </div>

                            {/* Premium Card Design (Clean Version) */}
                            <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-900 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-xl shadow-slate-200/50 relative overflow-hidden group border border-slate-100">
                                <div className="absolute inset-0 bg-gradient-to-tr from-teal-50/50 via-transparent to-indigo-50/50 opacity-100" />
                                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                                <div className="relative z-10 mb-4 sm:mb-0">
                                    <div className="text-[10px] font-black text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-[2px]">
                                        <ShieldCheck className="w-3 h-3 text-teal-500" /> Active Plan
                                    </div>
                                    <div className="text-xl sm:text-xl font-black tracking-tight leading-none mb-3 text-slate-900">
                                        {shop?.is_premium ? "スタンダードプラン" : "トライアルプラン"}
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-[10px] font-black text-teal-700 border border-teal-100 uppercase tracking-widest">
                                        {shop?.is_premium ? "Unlimited Access" : "Limited Access"}
                                    </div>
                                </div>
                                <div className="relative z-10 text-left sm:text-right">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">
                                            {shop?.is_premium ? "¥39,800" : "¥0"}
                                        </span>
                                        <span className="text-sm font-black text-slate-400 uppercase">/month</span>
                                    </div>
                                </div>
                            </div>

                            {/* 💳 Stripeポータルへの導線 */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-slate-200/60">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400 shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <p className="text-[11px] sm:text-[12px] text-slate-500 max-w-sm leading-relaxed font-medium">
                                        クレジットカードの変更、領収書のダウンロード、プランのアップグレードや解約は専用ポータルページから行えます。
                                    </p>
                                </div>
                                <button
                                    onClick={handlePortalRedirect}
                                    disabled={isPortalLoading}
                                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 text-sm font-black rounded-xl transition-all border border-slate-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isPortalLoading ? (
                                        <>読み込み中 <span className="animate-pulse">...</span></>
                                    ) : (
                                        'お支払い情報・プランの管理'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ↑ 【修正】ここで「サブスクリプション管理エリア」の枠を完全に閉じました */}

                    {/* ▼▼ 独立させた法的情報・ヘルプセクション（枠の外側） ▼▼ */}
                    <div className="mt-12 mb-8 flex flex-col items-center justify-center text-center">
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
                            <Link href="/terms" target="_blank" className="hover:text-slate-900 transition-colors">
                                利用規約
                            </Link>
                            <Link href="/privacy" target="_blank" className="hover:text-slate-900 transition-colors">
                                プライバシーポリシー
                            </Link>
                            <Link href="/terms-sp" target="_blank" className="hover:text-slate-900 transition-colors">
                                特定商取引法に基づく表記
                            </Link>
                            <a href="mailto:info@insiders-hub.jp" className="hover:text-slate-900 transition-colors">
                                お問い合わせ
                            </a>
                        </div>
                        <p className="mt-6 text-[10px] text-slate-400 font-bold tracking-wider">
                            © 2026 nots, inc.
                        </p>
                    </div>
                    {/* ▲▲ ここまで ▲▲ */}

                </motion.section>
            </main>
        </div>
    );
}