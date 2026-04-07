"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Key, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
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
                // セキュリティ上、詳細な理由は出さず一律のエラーメッセージにするのが定石です
                throw new Error('メールアドレスまたはパスワードが間違っています。');
            }

            // ログイン成功後、広告主ダッシュボードへ
            router.push('/advertiser');
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'ログインに失敗しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-50/50 to-transparent blur-3xl" />
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10 relative z-10"
            >
                <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
                    <Lock className="w-3 h-3 text-teal-600" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Partner Login</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-3 text-slate-900">
                    INSIDERS.
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                    広告主様・パートナー店舗様 ログインページ
                </p>
            </motion.div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50"
                >
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="username email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    placeholder="メールアドレス"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-5 py-3.5 text-slate-900 placeholder-slate-400 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder="パスワード"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-5 py-3.5 text-slate-900 placeholder-slate-400 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
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
                                    <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={!email || !password || isLoading}
                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                        <Sparkles className="w-4 h-4 text-teal-400" />
                                    </motion.div>
                                    認証中...
                                </>
                            ) : (
                                <>
                                    ログインしてダッシュボードへ <ArrowRight className="w-4 h-4 text-teal-400" />
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
                    <p className="text-[13px] text-slate-500 font-medium">
                        まだアカウントをお持ちでないですか？{' '}
                        <button
                            onClick={() => router.push('/advertiser/gateway')}
                            className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all"
                        >
                            招待コードで登録
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}