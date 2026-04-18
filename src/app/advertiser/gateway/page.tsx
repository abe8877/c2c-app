"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, ShieldCheck, ArrowRight, AlertCircle, ExternalLink, Crown, Mail, Key, ArrowLeft } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

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

    const [isAgreedInvite, setIsAgreedInvite] = useState(false); // 上部用
    const [isAgreed, setIsAgreed] = useState(false);// 下部用

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
        <div className="min-h-screen bg-[#f8faff] text-slate-900 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden font-sans">
            {/* Rich Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent" />
            </div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12 relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm rounded-full px-4 py-1.5 mb-6">
                    <Lock className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Invite Only Access</span>
                </div>
                <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-slate-900">
                        INSIDERS.
                    </h1>
                </Link>
                <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed font-medium">
                    招待コードを入力すると、3名分の無料オファー枠を使って、すぐにサービスをご利用いただけます。
                </p>
            </motion.div>

            <div className="w-full max-w-md space-y-6 relative z-10">
                <motion.div className="bg-white/90 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            /* STEP 1: 招待コード入力 */
                            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleCodeSubmit} className="space-y-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
                                        <ShieldCheck className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900">招待コードをお持ちの方</h2>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">ENTER YOUR ACCESS CODE</p>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={inviteCode}
                                        onChange={(e) => { setInviteCode(e.target.value); setError(''); }}
                                        placeholder="招待コードを入力"
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder-slate-400 text-sm font-black outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all uppercase tracking-[0.2em]"
                                    />
                                    {inviteCode && (
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-rose-600 text-[11px] font-black bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                                        <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                                    </motion.div>
                                )}

                                <div className="flex items-start gap-3 mt-4 mb-4 px-2">
                                    <input
                                        type="checkbox"
                                        id="terms-agree-invite"
                                        checked={isAgreedInvite}
                                        onChange={(e) => setIsAgreedInvite(e.target.checked)}
                                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer shrink-0"
                                    />
                                    <label htmlFor="terms-agree-invite" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                                        <Link href="/terms" target="_blank" className="underline hover:text-slate-900" onClick={(e) => e.stopPropagation()}>利用規約</Link>
                                        および
                                        <Link href="/privacy" target="_blank" className="underline hover:text-slate-900" onClick={(e) => e.stopPropagation()}>プライバシーポリシー</Link>
                                        に同意します。
                                    </label>
                                </div>

                                {/* ▼ 154行目からのボタンを修正 ▼ */}
                                <button
                                    type="submit"
                                    // ↓招待コードが空、または未同意の場合はボタンを無効化
                                    disabled={!inviteCode.trim() || !isAgreedInvite}
                                    className={`w-full py-4.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${(inviteCode.trim() && isAgreedInvite)
                                        ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md hover:from-indigo-600 hover:to-indigo-700"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-70"
                                        }`}
                                >
                                    次へ進む <ArrowRight className={`w-5 h-5 ${inviteCode.trim() && isAgreedInvite ? "text-indigo-400" : "text-slate-400"}`} />
                                </button>
                            </motion.form>

                        ) : (

                            /* STEP 2: アカウント作成 */
                            <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSignUpSubmit} className="space-y-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <button type="button" onClick={() => setStep(1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-white transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900">アカウント作成</h2>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">SET UP YOUR CREDENTIALS</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="メールアドレス" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-slate-900 placeholder-slate-400 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="relative group">
                                        <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input type="password" required minLength={6} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="パスワード (6文字以上)" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-slate-900 placeholder-slate-400 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-rose-600 text-[11px] font-black bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                                        <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!email || password.length < 6 || isLoading}
                                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-70 text-white rounded-2xl font-black text-[15px] flex items-center justify-center gap-3 transition-all-300 shadow-xl shadow-indigo-500/20 active:scale-[0.98] relative overflow-hidden"
                                >
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                            </motion.div>
                                            <span>アカウント作成中...</span>
                                        </>
                                    ) : (
                                        <>
                                            登録して利用を開始する
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                    {/* Shimmer Effect */}
                                    <motion.div
                                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                        animate={{ translateX: ['100%', '-100%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-6 px-10">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">OR</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white/50 backdrop-blur-sm border border-white/50 rounded-[2.5rem] p-10 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center">
                            <Lock className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">招待コードがない場合</h2>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">REQUEST ACCESS OR PURCHASE</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* ボタン1：リクエストを送る（チェック不要でいつでも押せる） */}
                        <a
                            href={requestFormUrl}
                            className="group w-full py-4 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-700 hover:text-indigo-600 transition-all duration-200 shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                            リクエストを送る（フォームへ遷移）
                        </a>

                        {/* 区切り線とプラン購入セクション */}
                        <div className="pt-6 border-t border-slate-100 space-y-4">

                            {/* ▼▼ 追加：同意チェックボックス（購入用） ▼▼ */}
                            <div className="flex items-start gap-3 px-2">
                                <input
                                    type="checkbox"
                                    id="terms-agree-purchase"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer shrink-0"
                                />
                                <label htmlFor="terms-agree-purchase" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                                    <Link href="/terms" target="_blank" className="underline hover:text-slate-900" onClick={(e) => e.stopPropagation()}>利用規約</Link>
                                    および
                                    <Link href="/privacy" target="_blank" className="underline hover:text-slate-900" onClick={(e) => e.stopPropagation()}>プライバシーポリシー</Link>
                                    に同意します。
                                </label>
                            </div>
                            {/* ▲▲ 追加ここまで ▲▲ */}

                            {/* ボタン2：プランを購入する（チェックで制御） */}
                            <a
                                href={isAgreed ? `https://buy.stripe.com/bJe00l5128Q1dEB64g1wY00?client_reference_id=guest&prefilled_email=${encodeURIComponent(email)}` : "#"}
                                onClick={(e) => { if (!isAgreed) e.preventDefault(); }}
                                className={`w-full py-4 flex items-center justify-center gap-2 border rounded-xl font-bold transition-all duration-200 ${isAgreed
                                    ? "bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200 text-amber-900 shadow-sm"
                                    : "bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed pointer-events-none"
                                    }`}
                            >
                                <Crown className={`w-4 h-4 ${isAgreed ? "text-amber-500" : "text-slate-300"}`} />
                                プランを購入してすぐに開始する
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}