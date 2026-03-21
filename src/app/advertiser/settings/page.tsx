"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, CreditCard, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function SettingsPage() {
    const router = useRouter();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [lineNotifications, setLineNotifications] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const handleCancelSubscription = () => {
        if (confirm("本当にサブスクリプションを解除しますか？ この操作は元に戻せません。")) {
            setIsCanceling(true);
            setTimeout(() => {
                alert("サブスクリプションの解除が完了しました。");
                setIsCanceling(false);
            }, 1000);
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

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">LINE連携・通知</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">LINEでマッチングの即時通知を受け取る</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={lineNotifications} onChange={(e) => setLineNotifications(e.target.checked)} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>
                    </div>
                </motion.section>

                {/* Subscription Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-amber-500" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900">サブスクリプション管理</h2>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white relative overflow-hidden mb-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full pointer-events-none" />
                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-white/10 text-xs font-bold px-2 py-1 rounded-full text-white backdrop-blur-sm mb-3">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> 現在アクティブなプラン
                                </div>
                                <h3 className="text-2xl font-black mb-1">Premium Shop プラン</h3>
                                <p className="text-white/60 text-sm font-medium">次回更新日: 2026年4月1日</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-amber-400">¥19,800<span className="text-sm text-white/60 font-medium">/月</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                        <div className="flex items-start gap-3 text-slate-500">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
                            <div className="text-sm font-medium">
                                <span className="font-bold text-slate-900 block mb-1">サブスクリプションの解除</span>
                                現在の契約期間終了後に、無料プラン（Basic Shop）へ移行します。
                            </div>
                        </div>
                        <button 
                            onClick={handleCancelSubscription}
                            disabled={isCanceling}
                            className="w-full sm:w-auto px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap border border-red-100 shrink-0"
                        >
                            {isCanceling ? '処理中...' : 'プランを解約する'}
                        </button>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
