"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, Instagram, MapPin, CheckCircle2, Search, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { analyzeShopVibe } from '@/app/actions/analyze-shop-vibe';

type UIState = 'idle' | 'analyzing' | 'complete';

const AnimatedCounter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const totalDuration = 1500;
        const increment = end / (totalDuration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}</span>;
};

export default function VibeOnboardingPage() {
    const [state, setState] = useState<UIState>('idle');
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<{ tags: string[]; matchCount: number } | null>(null);
    const router = useRouter();

    const handleStartAnalysis = async () => {
        if (!url) return;
        setState('analyzing');

        try {
            const res = await analyzeShopVibe(url);
            if (res.success) {
                setResult({
                    tags: res.tags || [],
                    matchCount: res.matchCount || 0
                });
                // 演出のために少し待機
                setTimeout(() => setState('complete'), 2000);
            } else {
                alert('解析に失敗しました。有効なURLを入力してください。');
                setState('idle');
            }
        } catch (error) {
            console.error(error);
            setState('idle');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 overflow-hidden">
            <AnimatePresence mode="wait">
                {state === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-xl text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-black/20"
                            >
                                <Sparkles className="text-white w-10 h-10" />
                            </motion.div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">
                                店舗の特徴を解析
                            </h1>
                            <p className="text-slate-500 font-medium">
                                InstagramやGoogle MapsのURLを入力するだけで、<br />
                                AIがあなたのブランドの「空気感」を言語化します。
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-black transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://www.instagram.com/p/..."
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-lg font-bold shadow-sm focus:outline-none focus:border-black transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Instagram size={14} /> Instagram</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> Google Maps</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartAnalysis}
                            disabled={!url}
                            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${url ? 'bg-black text-white shadow-black/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            解析を開始 ✨
                            <ArrowRight size={20} />
                        </motion.button>
                    </motion.div>
                )}

                {state === 'analyzing' && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center space-y-12"
                    >
                        <div className="relative w-48 h-48">
                            {/* Spinning Pulse Base */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-full"
                            />
                            {/* Scan Bar Effect */}
                            <motion.div
                                animate={{
                                    y: [-80, 80, -80],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_rgba(45,212,191,0.5)] z-10"
                            />
                            {/* Glowing Center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        boxShadow: [
                                            "0 0 0px rgba(0,0,0,0)",
                                            "0 0 30px rgba(0,0,0,0.1)",
                                            "0 0 0px rgba(0,0,0,0)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center"
                                >
                                    <Loader2 className="w-12 h-12 text-black animate-spin" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                            <motion.h2
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-2xl font-black tracking-tight"
                            >
                                AIが店舗の空気をスキャン中...
                            </motion.h2>
                            <p className="text-slate-500 text-sm font-bold flex items-center justify-center gap-2">
                                <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                                Gemini 1.5 Flash is analyzing your brand assets
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-1.5 h-1.5 bg-black rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {state === 'complete' && result && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center text-center space-y-10"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-center gap-2 text-teal-500 mb-2">
                                <CheckCircle2 size={24} />
                                <span className="font-black text-sm uppercase tracking-widest">Analysis Completed</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900">解析が完了しました ✨</h2>
                        </motion.div>

                        <div className="w-full space-y-6">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-left px-2">Detected Vibe Tags</p>
                            <motion.div
                                className="flex flex-wrap justify-center gap-3"
                                variants={{
                                    show: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                                initial="hidden"
                                animate="show"
                            >
                                {result.tags.map((tag, idx) => (
                                    <motion.span
                                        key={idx}
                                        variants={{
                                            hidden: { opacity: 0, scale: 0, y: 10 },
                                            show: { opacity: 1, scale: 1, y: 0 }
                                        }}
                                        className="bg-white border-2 border-slate-50 px-6 py-3 rounded-2xl text-lg font-bold shadow-lg shadow-teal-500/5 hover:border-black transition-colors"
                                    >
                                        #{tag}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="w-full bg-[#F1F5F9] rounded-3xl p-8 space-y-2"
                        >
                            <p className="text-slate-500 font-bold text-sm">親和性の高い推薦クリエイター</p>
                            <div className="text-5xl font-black text-slate-900 flex items-center justify-center gap-3">
                                <AnimatedCounter value={result.matchCount} />
                                <span className="text-xl">名</span>
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/advertiser')}
                            className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-black/20 flex items-center justify-center gap-3 group"
                        >
                            マッチング候補を見る
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[100px] opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[100px] opacity-50" />
            </div>
        </div>
    );
}
