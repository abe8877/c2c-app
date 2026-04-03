"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Key, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

export default function CreatorLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Supabaseクライアントの初期化
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                // セキュリティ上の理由で曖昧なエラーメッセージに統一
                throw new Error('メールアドレスまたはパスワードが間違っています。');
            }

            // ログイン成功後、クリエイターダッシュボードへ遷移
            router.push('/creator');
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || '認証に失敗しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-50 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-white">

            {/* Background Effects (Functional Noir) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-emerald-500/5 to-transparent blur-[100px] rounded-full" />
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10 relative z-10"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 backdrop-blur-sm">
                        <ShieldCheck size={20} />
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3 text-white">
                    WELCOME BACK.
                </h1>
                <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">
                    Verified Creator Portal
                </p>
            </motion.div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="username email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    placeholder="Email Address"
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-5 py-4 text-white placeholder-zinc-600 text-sm outline-none focus:bg-black focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder="Password"
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-5 py-4 text-white placeholder-zinc-600 text-sm outline-none focus:bg-black focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold bg-rose-950/20 border border-rose-900/30 rounded-lg px-4 py-3 mt-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={!email || !password || isLoading}
                            className="w-full py-4 mt-2 bg-white hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                        <Sparkles className="w-4 h-4" />
                                    </motion.div>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    ACCESS DASHBOARD <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Footer Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center"
                >
                    <p className="text-[11px] text-zinc-500 font-medium">
                        <Link
                            href="/creators/join"
                            className="hover:text-white transition-colors underline underline-offset-4"
                        >
                            まだアカウントをお持ちでないですか？ (Apply for Invite)
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}