// src/app/creators/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
// import { loginCreator } from './actions'; // 実際のAuth処理アクション

export default function CreatorLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // await loginCreator(email, password); // Supabase Authのログイン処理
        // 成功したら /creator へリダイレクト
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-50 flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black relative overflow-hidden">

            {/* バックグラウンドの淡い光 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-sm relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 backdrop-blur-sm">
                        <ShieldCheck size={20} />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Welcome Back.</h1>
                    <p className="text-xs text-slate-500 font-light tracking-widest uppercase">
                        Verified Creator Portal
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-white text-black font-bold text-xs tracking-widest uppercase py-4 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'} <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/creators/join" className="text-[10px] text-slate-500 hover:text-white transition-colors underline underline-offset-4">
                        まだアカウントをお持ちでないですか？ (Apply for Invite)
                    </Link>
                </div>
            </div>
        </div>
    );
}