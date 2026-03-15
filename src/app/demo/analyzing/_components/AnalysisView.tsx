"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AnalyzingScreen() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-40 flex flex-col items-center justify-center"
        >
            <div className="relative w-32 h-32 mb-10">
                <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-yellow-500 animate-pulse" size={48} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4 text-neutral-900 uppercase">店舗の魅力を言語化中...</h2>
            <div className="flex flex-col items-center gap-3 text-stone-400 font-black text-xs uppercase tracking-widest">
                <p className="animate-pulse">Analyzing Instagram Assets...</p>
                <p className="animate-pulse delay-700">Identifying Inbound Demographics...</p>
            </div>
        </motion.div>
    );
}

export function AnalysisView({ matchCount, genre, tags: initialTags }: { matchCount: number, genre: string, tags: string[] }) {
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [activeTags, setActiveTags] = useState<string[]>(initialTags);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnalyzing(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setActiveTags(initialTags);
    }, [initialTags]);

    const handleRemoveTag = (tagToRemove: string) => {
        setActiveTags(prev => prev.filter(t => t !== tagToRemove));
    };

    const handleProceed = () => {
        router.push(`/demo/advertiser?genre=${genre}`);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 font-sans">
            <AnimatePresence mode="wait">
                {isAnalyzing ? (
                    <AnalyzingScreen key="analyzing" />
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* Animation Circle */}
                        <div className="mb-8 relative">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce shadow-inner">
                                <CheckCircle className="text-green-500 w-12 h-12" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-center tracking-tight mb-4 text-neutral-900 uppercase italic">
                            ANALYSIS COMPLETE
                        </h1>

                        <p className="text-gray-500 text-center mb-12 max-w-lg font-medium">
                            解析の結果、貴店の魅力は以下のように定義されました。
                        </p>

                        {/* Detected Tags Card */}
                        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-2xl border border-gray-100 mb-10 ring-1 ring-black/5">
                            <div className="flex flex-wrap justify-center gap-4">
                                {activeTags.map((tag, i) => (
                                    <div
                                        key={i}
                                        className="group relative px-6 py-4 bg-neutral-50 text-neutral-800 font-black text-lg rounded-2xl border border-neutral-200 shadow-sm transition-all hover:pr-12"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 bg-stone-200 hover:bg-red-500 hover:text-white rounded-full transition-all text-stone-500"
                                            title="削除"
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                ))}
                                {activeTags.length === 0 && (
                                    <p className="text-stone-300 italic font-medium">タグが選択されていません</p>
                                )}
                            </div>

                            <div className="mt-12 pt-10 border-t border-gray-100 text-center">
                                <p className="text-gray-500 text-sm font-bold mb-6">
                                    親和性の高い推薦クリエイター：
                                    <span className="text-4xl text-black font-black ml-3 underline decoration-yellow-400 decoration-4 underline-offset-8">
                                        {matchCount}名
                                    </span>
                                </p>

                                <button
                                    onClick={handleProceed}
                                    className="w-full md:w-auto px-12 py-5 bg-black text-white font-black rounded-full hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95"
                                >
                                    マッチング候補を見る <ArrowRight size={24} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
