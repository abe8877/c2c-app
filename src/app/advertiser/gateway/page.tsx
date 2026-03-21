"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, ShieldCheck, ArrowRight, AlertCircle, ExternalLink, Crown, Mail, Key, ArrowLeft } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

const VALID_CODES = ['INVITATION2026'];

export default function GatewayPage() {
    const router = useRouter();

    // ステップ管理 (1: 招待コード, 2: アカウント作成)
    const [step, setStep] = useState<1 | 2>(1);

    // フォームステート
    const [inviteCode, setInviteCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UIステート
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const requestFormUrl = process.env.NEXT_PUBLIC_REQUEST_FORM_URL || '#';
    const stripePaymentUrl = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_URL || '#';

    // Supabaseクライアントの初期化 (App Router用)
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // [Step 1] 招待コードの検証
    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmed = inviteCode.trim().toUpperCase();
        if (VALID_CODES.includes(trimmed)) {
            setStep(2); // アカウント作成ステップへ進む
        } else {
            setError('無効な招待コードです。正しいコードを入力してください。');
        }
    };

    // [Step 2] アカウント作成とショップDB登録
    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 1. Supabase Authでユーザーを作成
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. shopsテーブルに店舗レコードを初期作成
                const { error: dbError } = await supabase.from('shops').insert({
                    id: authData.user.id, // AuthのIDと連携（1対1）
                    login_email: email,
                    applied_invite_code: inviteCode.trim().toUpperCase(),
                    free_offers_remaining: 3, // 🎁 無料枠を3回付与
                    is_premium: false,
                    name: '新規店舗 (設定から名前を変更してください)' // 仮の名前
                });

                if (dbError) {
                    if (dbError.code === '23505') {
                        throw new Error('このメールアドレスはすでに登録されています。ログイン画面からお進みください。');
                    }
                    throw dbError;
                }

                // 3. 全て成功したらダッシュボードへ遷移
                router.push('/advertiser');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'エラーが発生しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden font-sans">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-50/50 to-transparent blur-3xl" />
            </div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12 relative z-10">
                <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5 mb-6">
                    <Lock className="w-3 h-3 text-teal-600" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Invite Only Access</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">
                    INSIDERS<span className="text-teal-500">.</span>
                </h1>
                <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    インバウンド特化型クリエイターマッチング。<br className="hidden md:block" />
                    招待コードを入力して、貴店の魅力解析をお試し下さい。
                </p>
            </motion.div>

            <div className="w-full max-w-md space-y-6 relative z-10 overflow-hidden">
                <motion.div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            /* STEP 1: 招待コード入力 */
                            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleCodeSubmit} className="space-y-4">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">招待コードをお持ちの方</h2>
                                        <p className="text-[11px] text-slate-500 font-medium">コードを入力して無料でアクセス</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <input type="text" value={inviteCode} onChange={(e) => { setInviteCode(e.target.value); setError(''); }} placeholder="招待コード" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 placeholder-slate-400 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all uppercase" />
                                    {inviteCode && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Sparkles className="w-4 h-4 text-teal-500 animate-pulse" /></div>}
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                                    </div>
                                )}

                                <button type="submit" disabled={!inviteCode.trim()} className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
                                    次へ進む <ArrowRight className="w-4 h-4 text-teal-400" />
                                </button>
                            </motion.form>

                        ) : (

                            /* STEP 2: アカウント作成 */
                            <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSignUpSubmit} className="space-y-4">
                                <div className="flex items-center gap-3 mb-6">
                                    <button type="button" onClick={() => setStep(1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">アカウントの作成</h2>
                                        <p className="text-[11px] text-slate-500 font-medium">ログイン情報を設定してください</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="メールアドレス" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-5 py-3.5 text-slate-900 placeholder-slate-400 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
                                    </div>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="password" required minLength={6} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="パスワード (6文字以上)" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-5 py-3.5 text-slate-900 placeholder-slate-400 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                                    </div>
                                )}

                                <button type="submit" disabled={!email || password.length < 6 || isLoading} className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
                                    {isLoading ? 'アカウント作成中...' : '登録して貴店の魅力分析へ進む'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Divider & Request Access */}
                <div className="flex items-center gap-4 px-4">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    {/* 省略: 招待コードをお持ちでない方 (変更なし) */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">招待コードをお持ちでない方</h2>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <a href={requestFormUrl} className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                            <ExternalLink className="w-4 h-4 text-slate-400" /> 審査リクエストを送る
                        </a>
                        <a href={stripePaymentUrl} className="w-full py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                            <Crown className="w-4 h-4" /> 審査をスキップしてすぐにサービスを利用する
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}