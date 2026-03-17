"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, ShieldCheck, ArrowRight, AlertCircle, ExternalLink, Crown } from 'lucide-react';

const VALID_CODES = ['BETA2026', 'INSIDERS2026', 'NOTS'];

export default function GatewayPage() {
    const router = useRouter();
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);

    const requestFormUrl = process.env.NEXT_PUBLIC_REQUEST_FORM_URL || '#';
    const stripePaymentUrl = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_URL || '#';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmed = inviteCode.trim().toUpperCase();
        if (VALID_CODES.includes(trimmed)) {
            setIsUnlocking(true);
            setTimeout(() => {
                router.push('/advertiser');
            }, 800);
        } else {
            setError('無効な招待コードです。正しいコードを入力してください。');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-teal-500/[0.07] rounded-full blur-[150px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/[0.05] rounded-full blur-[130px]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/10 to-transparent" />
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14 relative z-10"
            >
                <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
                    <Lock className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-[11px] font-bold text-teal-300 uppercase tracking-[0.2em]">Invite Only Access</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                    INSIDERS<span className="text-teal-400">.</span>
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                    インバウンド特化型クリエイターマッチング。<br className="hidden md:block" />
                    招待コードを入力して、VIBE解析を開始してください。
                </p>
            </motion.div>

            {/* Cards Container */}
            <div className="w-full max-w-xl space-y-5 relative z-10">

                {/* Card 1: Invite Code */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-slate-800/40 border border-teal-500/15 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-teal-900/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-teal-500/15 border border-teal-500/20 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-black tracking-tight">招待コードをお持ちの方</h2>
                            <p className="text-[11px] text-slate-500 font-medium">Invite Code を入力して VIBE 解析を開始</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={(e) => { setInviteCode(e.target.value); setError(''); }}
                                placeholder="招待コードを入力..."
                                className="w-full bg-slate-900/60 border border-slate-600/30 rounded-xl px-5 py-4 text-white placeholder-slate-500 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 transition-all"
                            />
                            {inviteCode && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
                                </div>
                            )}
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={!inviteCode.trim() || isUnlocking}
                            className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-900 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
                        >
                            {isUnlocking ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                    </motion.div>
                                    Unlocking...
                                </>
                            ) : (
                                <>
                                    VIBE解析へ進む <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-4 px-4">
                    <div className="flex-1 h-px bg-slate-700/50" />
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.25em]">or</span>
                    <div className="flex-1 h-px bg-slate-700/50" />
                </div>

                {/* Card 2: Request Access */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-slate-800/25 border border-slate-600/15 rounded-2xl p-8 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/15 rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-black tracking-tight">招待コードをお持ちでない方</h2>
                            <p className="text-[11px] text-slate-500 font-medium">審査リクエストまたはプレミアムプランで参加</p>
                        </div>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        INSIDERS.は現在、クオリティ維持のため<span className="text-white font-bold">完全招待制</span>となっております。利用をご希望の店舗様は審査リクエストをお願いいたします。
                    </p>

                    <div className="space-y-3">
                        {/* Primary: Request Access */}
                        <a
                            href={requestFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                            審査リクエストを送る
                        </a>

                        {/* Secondary: Skip to Premium */}
                        <a
                            href={stripePaymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <Crown className="w-4 h-4" />
                            審査をスキップしてプレミアムプランで始める
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-[10px] text-slate-600 mt-14 relative z-10"
            >
                © 2026 nots inc. All rights reserved. — INSIDERS. is a product of nots.
            </motion.p>
        </div>
    );
}
