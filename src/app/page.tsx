"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, CheckCircle2, ArrowRight, Sparkles,
    MousePointer2, Send, Crown, Check, AlertTriangle,
    Database, MessageSquare, LayoutGrid, PlayCircle,
    Shield, MapPin, Globe, Repeat, Users, TrendingUp, TrendingDown,
    ArrowUpRight, Menu, X, RefreshCw, Clock, ShieldAlert, Heart, Bookmark, Pointer,
    Star, MessageCircle, Coffee, Target, Zap
} from 'lucide-react';

const elenaIcon = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80";

function HeroDualMockups({ isMiniFlow = false }: { isMiniFlow?: boolean }) {
    const [step, setStep] = useState(isMiniFlow ? 4 : 0);
    const [scrollCreator, setScrollCreator] = useState(0);
    const [showMapLink, setShowMapLink] = useState(false);

    // アニメーションシーケンス
    useEffect(() => {
        let isMounted = true;
        const runSequence = async () => {
            while (isMounted) {
                setStep(isMiniFlow ? 4 : 0);
                setScrollCreator(0);
                setShowMapLink(false);

                if (!isMiniFlow) {
                    await new Promise(r => setTimeout(r, 1000));
                    setStep(1); // URLタイピング
                    await new Promise(r => setTimeout(r, 1000));
                    setStep(2); // ローディング
                    await new Promise(r => setTimeout(r, 1800));
                    setStep(3); // 分析完了
                    await new Promise(r => setTimeout(r, 1500));
                }

                setStep(4); // クリエイターカタログ
                await new Promise(r => setTimeout(r, 2200));
                setStep(5); // オファー作成
                await new Promise(r => setTimeout(r, 2500));
                setStep(6); // AI英語生成
                await new Promise(r => setTimeout(r, 2500));

                setShowMapLink(true);
                await new Promise(r => setTimeout(r, 1200));

                setStep(7); // 送信完了 (Advertiser SENT!)
                await new Promise(r => setTimeout(r, 1500));

                setStep(9); // クリエイター側に通知 (通知カード)
                await new Promise(r => setTimeout(r, 2500));

                setStep(10); // メイン画面へ遷移
                setScrollCreator(40);
                await new Promise(r => setTimeout(r, 6000));
            }
        };
        runSequence();
        return () => { isMounted = false; };
    }, [isMiniFlow]);



    return (
        <div className="relative w-full h-[600px] flex items-center justify-center perspective-1000 mt-10 lg:mt-0">
            {/* 奥のレイヤー：クリエイターUI - Success時に前面へ */}
            <motion.div
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                animate={{
                    opacity: (step >= 9 && step <= 10) ? 1 : 0.6,
                    x: (step >= 9 && step <= 10) ? 0 : 80,
                    rotateY: (step >= 9 && step <= 10) ? 0 : 15,
                    scale: (step >= 9 && step <= 10) ? 1.1 : 1,
                    zIndex: (step >= 9 && step <= 10) ? 100 : 0
                }}
                transition={{ duration: 1.2, ease: "anticipate" }}
                className="absolute w-[240px] sm:w-[240px] h-[480px] sm:h-[500px] bg-[#0f172a] rounded-[2.5rem] sm:rounded-[3.5rem] border-[4px] sm:border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center">
                    <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
                </div>

                {/* Scrolling Background UI */}
                <div className="flex-1 overflow-hidden relative">
                    <motion.div
                        animate={{ y: `-${scrollCreator}%` }}
                        transition={{ ease: "easeInOut", duration: 8 }}
                        className="w-full flex flex-col"
                    >
                        <img src="/images/insiders.creator.png" className="w-full h-auto object-top" />
                    </motion.div>

                    {/* Overlay states in Creator UI */}
                    <AnimatePresence>
                        {step >= 7 && step <= 9 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[60] flex flex-col items-center justify-center p-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="bg-white rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 w-full flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                                        <Send className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">New Offer</span>
                                            <span className="text-[8px] font-bold text-slate-400 leading-none">Just now</span>
                                        </div>
                                        <div className="text-[11px] font-black text-slate-900 leading-tight">Wagyu Experience Tokyo から招待が届きました</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-4 bg-slate-900/90 border-t border-slate-800">
                    <div className="flex justify-around items-center">
                        <div className="w-8 h-8 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400"><LayoutGrid className="w-4 h-4" /></div>
                        <div className="w-8 h-8 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500"><MessageSquare className="w-4 h-4" /></div>
                        <div className="w-8 h-8 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500"><Users className="w-4 h-4" /></div>
                    </div>
                </div>
            </motion.div>

            {/* 手前のレイヤー：広告主UI */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{
                    opacity: (step >= 9 && step <= 10) ? 0 : 1,
                    y: (step >= 9 && step <= 10) ? -20 : 0,
                    scale: (step >= 9 && step <= 10) ? 0.98 : 1,
                    zIndex: (step >= 9 && step <= 10) ? 0 : 10
                }}
                transition={{ duration: 0.8, type: "spring" }}
                className="absolute w-[300px] h-[600px] bg-white rounded-[3rem] border-[10px] border-slate-50 shadow-2xl shadow-indigo-900/20 overflow-hidden flex flex-col"
            >
                <div className="absolute top-0 inset-x-0 h-6 bg-white/90 backdrop-blur-md z-[60] flex items-center justify-center">
                    <div className="w-14 h-1.5 bg-slate-100 rounded-full" />
                </div>

                <div className="flex-1 mt-6 relative bg-[#fafafa]">
                    <AnimatePresence mode="wait">
                        {(step === 0 || step === 1) && (
                            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full px-6 text-center">
                                <div className="text-[9px] text-emerald-600 font-black mb-3 border border-emerald-200 bg-emerald-50 px-4 py-1.5 rounded-full flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" /> 1,000+ Trusted Creators
                                </div>
                                <h3 className="text-xl font-black mb-8 text-slate-900 leading-tight italic tracking-tighter">Find your best<br />Inbound Creators</h3>
                                <div className="w-full bg-white border border-slate-200 rounded-2xl flex items-center p-1.5 shadow-sm h-12">
                                    <div className="text-[10px] font-black px-3 border-r border-slate-100 flex items-center gap-1.5">🍣</div>
                                    <div className="text-[9px] text-slate-400 px-3 flex-1 text-left flex items-center gap-2 overflow-hidden">
                                        <Search className="w-3.5 h-3.5 text-slate-300" />
                                        <span className="truncate">{step === 0 ? "Google Map Link..." : "https://maps.app.goo.gl/..."}</span>
                                    </div>
                                    <div className={`text-[9px] font-black px-5 h-full rounded-xl text-white flex items-center justify-center transition-colors duration-300 ${step === 1 ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-black'}`}>
                                        SEARCH
                                    </div>
                                </div>
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, scale: 1.5, x: 20, y: 20 }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} className="absolute bottom-1/4 right-8 z-[70]">
                                        <MousePointer2 className="w-10 h-10 text-black drop-shadow-2xl" />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full px-6 text-center">
                                <div className="w-20 h-20 rounded-full border-[5px] border-indigo-600 border-t-transparent animate-spin mb-8 relative">
                                    <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="text-base font-black mb-3 text-slate-900 tracking-tighter uppercase">分析中...</div>
                                <div className="text-[10px] text-slate-400 font-bold leading-relaxed text-center">お店の魅力を言語化し、<br />最適なクリエイターを選定中です</div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full px-6 text-center">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-5 border-2 border-emerald-100 shadow-inner rotate-3">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div className="text-2xl font-black mb-2 text-slate-900 tracking-tighter italic">READY!</div>
                                <p className="text-[10px] text-slate-400 font-bold mb-8">21名の最適なクリエイターを特定しました</p>
                                <div className="bg-white rounded-[2rem] shadow-xl p-6 w-full border border-slate-50 relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[8px] font-black px-4 py-1 rounded-full shadow-lg">AI MATCHED</div>
                                    <div className="flex flex-wrap justify-center gap-2 mb-8 pt-3">
                                        {['WAGYU EXPERIENCE', 'MODERN TOKYO'].map((tag) => (
                                            <span key={tag} className="px-3 py-1.5 rounded-xl text-[8px] font-black bg-slate-50 text-slate-800 border border-slate-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-[11px] font-bold text-slate-400 mb-8 uppercase tracking-widest text-center">
                                        CREATORS FOUND: <span className="text-3xl font-black text-indigo-600 italic">21</span>
                                    </div>
                                    <div className="w-full bg-indigo-600 text-white text-[11px] font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-indigo-200 font-bold">
                                        SEE CATALOG <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step >= 4 && step <= 6 && (
                            <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white relative">
                                <div className="p-5 pb-3 border-b border-slate-50 sticky top-0 z-20 bg-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">Creator Selection</span>
                                        <div className="bg-yellow-400 text-black text-[7px] font-black px-2 py-0.5 rounded-sm animate-pulse">BEST MATCH</div>
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-bold italic text-left">Top-tier global influencers</div>
                                </div>
                                <div className="flex-1 p-3 grid grid-cols-3 gap-2 overflow-hidden bg-slate-50/50">
                                    {[...Array(12)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{
                                                opacity: (step > 4 && i !== 1) ? 0.2 : 1,
                                                scale: (step > 4 && i === 1) ? 1.1 : 1,
                                                zIndex: (step > 4 && i === 1) ? 50 : 0,
                                            }}
                                            className={`relative rounded-xl overflow-hidden aspect-[9/16] shadow-sm bg-white border border-white ${i === 1 ? 'ring-2 ring-yellow-400 shadow-xl' : ''}`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${['from-pink-400 to-rose-300', 'from-indigo-400 to-violet-300', 'from-emerald-400 to-teal-300', 'from-amber-400 to-orange-300', 'from-sky-400 to-blue-300'][i % 5]} opacity-40`} />
                                            {i === 1 && (
                                                <>
                                                    <img src={elenaIcon} className="absolute inset-0 w-full h-full object-cover z-0" />
                                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1.5 text-center z-10">
                                                        <div className="text-[6px] font-black text-white uppercase italic tracking-widest">Elena Tokyo</div>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    ))}

                                    {/* Focus Elena */}
                                    {step === 4 && (
                                        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-white rounded-3xl shadow-2xl p-4 w-full border border-slate-100 flex items-center gap-4 pointer-events-auto"
                                            >
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                                                    <img src={elenaIcon} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-black text-slate-900 leading-none mb-1 text-left">Elena Tokyo</div>
                                                    <div className="text-[8px] text-indigo-500 font-bold uppercase tracking-widest text-left">98% Match</div>
                                                </div>
                                                <div className="bg-indigo-600 text-white text-[9px] font-black px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-100">INVITE</div>
                                                {/* Clicking Animation */}
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 1.5, x: 20, y: 20 }}
                                                    animate={{ opacity: 1, scale: 1, x: 5, y: 5 }}
                                                    transition={{ delay: 1.5, duration: 0.5 }}
                                                    className="absolute -bottom-2 -right-2 z-[70] pointer-events-none"
                                                >
                                                    <MousePointer2 className="w-8 h-8 text-black drop-shadow-lg" />
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    )}
                                </div>

                                {/* Offer Step 5: Customization Modal */}
                                {step === 5 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        className="absolute inset-0 bg-black/80 backdrop-blur-md z-[80] flex flex-col p-6 text-left"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="text-white text-xs font-black italic tracking-widest">OFFER CREATION</div>
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40"><Check className="w-3 h-3" /></div>
                                        </div>
                                        <h4 className="text-white text-lg font-black mb-6 italic leading-tight">Elena_Tokyo さんを招待</h4>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-[9px] font-bold text-white/40 mb-3 uppercase tracking-tighter">提供プラン</div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl opacity-40">
                                                        <div className="text-[10px] font-black text-white mb-1">🎁 ギフティング</div>
                                                        <div className="text-[7px] text-white/50">商品提供のみ</div>
                                                    </div>
                                                    <div className="bg-white border-2 border-indigo-400 p-3 rounded-xl relative">
                                                        <div className="text-[10px] font-black text-indigo-600 mb-1">💰 報酬付き</div>
                                                        <div className="text-[7px] text-slate-400">商品提供＋謝礼金</div>
                                                        <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-indigo-600 rounded-full flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-bold text-white/40 mb-3 uppercase tracking-tighter">謝礼金額（円）</div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {["¥10k", "¥15k", "¥30k"].map((p, idx) => (
                                                        <div key={p} className={`py-2 text-[9px] font-black rounded-lg text-center border transition-all ${idx === 1 ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/60'}`}>{p}</div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-bold text-white/40 mb-3 uppercase tracking-tighter">撮影要素</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {["看板メニュー", "店内の雰囲気", "スタッフ", "外観"].map((tag, idx) => (
                                                        <div key={tag} className={`px-3 py-1.5 rounded-full text-[8px] font-black border ${idx < 2 ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10'}`}>{tag}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-auto bg-white text-black py-4 rounded-xl text-xs font-black text-center shadow-2xl">CONFIRM OFFER</div>
                                    </motion.div>
                                )}

                                {/* Offer Step 6: AI Translation */}
                                {step === 6 && (
                                    <motion.div
                                        initial={{ y: "100%" }} animate={{ y: 0 }}
                                        className="absolute inset-0 bg-white z-[90] flex flex-col p-6"
                                    >
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-3xl bg-slate-50 overflow-hidden shadow-inner flex items-center justify-center">
                                                <img src={elenaIcon} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-black text-slate-900 mb-1 text-left">Elena Tokyo を招待</div>
                                                <div className="text-[10px] text-slate-400 font-bold italic text-left">Wagyu Experience Plan</div>
                                            </div>
                                        </div>
                                        <div className="bg-indigo-50/50 rounded-[2rem] p-5 border border-indigo-100 relative overflow-hidden flex flex-col mb-4 shadow-inner">
                                            <div className="text-[10px] font-black text-indigo-400 mb-3 flex items-center gap-1.5 uppercase tracking-widest leading-none"><Sparkles className="w-3 h-3" /> AI Translation</div>
                                            <div className="flex flex-col justify-center text-left relative min-h-[100px]">
                                                <motion.div
                                                    initial={{ opacity: 1 }}
                                                    animate={{ opacity: 0 }}
                                                    transition={{ delay: 1.5, duration: 0.5 }}
                                                    className="absolute w-full px-1"
                                                >
                                                    <div className="text-[8px] font-black text-slate-400 mb-1 uppercase">入力：日本語</div>
                                                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-800 leading-tight italic pr-4">
                                                        "ぜひ当店自慢の和牛を体験しに来てください！私たちの情熱を知ってほしいです。"
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 2, duration: 0.5 }}
                                                    className="w-full px-1"
                                                >
                                                    <div className="text-[8px] font-black text-indigo-500 mb-1 uppercase">TRANSLATED: ENGLISH</div>
                                                    <div className="text-[11px] font-bold text-indigo-700 leading-tight italic pr-2">
                                                        "Hi Elena! We'd love for you to experience our special Wagyu. We'd love to share our passion!"
                                                    </div>
                                                </motion.div>
                                            </div>

                                            {/* Google Map Link Animation */}
                                            <AnimatePresence>
                                                {showMapLink && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        className="mt-2 bg-white border border-slate-200 rounded-xl p-2 flex items-center gap-2 shadow-sm"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <div className="text-[7px] font-black text-slate-900 truncate">Wagyu Experience Tokyo</div>
                                                            <div className="text-[6px] text-indigo-500 font-bold truncate">https://maps.app.goo.gl/ux...</div>
                                                        </div>
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="w-full py-4 rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 bg-black text-white mt-auto">
                                            <Send className="w-4 h-4" /> SEND OFFER
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 7: Success Flow (Reduced) */}
                        <AnimatePresence>
                            {step === 7 && (
                                <motion.div key="success-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center bg-white z-[90]">
                                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-2xl border-[6px] border-white rotate-6">
                                        <Check className="w-12 h-12 text-emerald-500" strokeWidth={5} />
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-3 uppercase">オファー送信！</h2>
                                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-8">Offer Sent to Elena.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'INSIDERS.とは', href: '#concept' },
        { name: '旅行動の新常識', href: '#problem' },
        { name: 'サービスの特徴', href: '#solution' },
        { name: 'プラン案内', href: '#plan' }
    ];

    return (
        <>
            <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md z-[110] border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-xl font-black tracking-tighter text-slate-900">INSIDERS.</div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="text-[11px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                                {link.name}
                            </a>
                        ))}
                        <button
                            onClick={() => window.location.href = '/advertiser/gateway'}
                            className="bg-black text-white px-6 py-2.5 rounded-xl font-black text-[11px] shadow-lg hover:shadow-xl active:scale-95 transition-all uppercase tracking-widest"
                        >
                            無料で試してみる
                        </button>
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-xl transition-colors relative z-[310]"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[300] lg:hidden flex items-start justify-center p-6 pt-24 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: -20 }}
                            className="bg-white rounded-[3rem] w-full max-w-sm p-8 shadow-2xl border border-white/20 relative overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

                            <nav className="flex flex-col gap-6 relative z-10">
                                {navLinks.map((link, idx) => (
                                    <motion.a
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-xl font-black text-slate-900 flex items-center justify-between group py-2"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="w-5 h-5 text-indigo-600 opacity-60 group-active:translate-x-1 transition-transform" />
                                    </motion.a>
                                ))}
                            </nav>
                            <div className="mt-12 relative z-10">
                                <button
                                    onClick={() => window.location.href = '/advertiser/gateway'}
                                    className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all"
                                >
                                    無料で試してみる
                                </button>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-2 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function InsidersLP() {
    // --- State & Refs for GTM Hacks ---
    const [selectedType, setSelectedType] = useState<'A' | 'B' | null>(null);
    const solutionRef = useRef<HTMLDivElement>(null);

    // --- Animation States for Mocks ---
    const [chatStep, setChatStep] = useState(0);
    const [assetStep, setAssetStep] = useState(0);
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const heroCTARef = useRef<HTMLButtonElement>(null);
    const pricingRef = useRef<HTMLDivElement>(null);
    const [isPricingVisible, setIsPricingVisible] = useState(false);

    useEffect(() => {
        const chatInterval = setInterval(() => {
            setChatStep((prev) => (prev >= 3 ? 0 : prev + 1));
        }, 3000);

        const assetInterval = setInterval(() => {
            setAssetStep((prev) => (prev >= 3 ? 0 : prev + 1));
        }, 3000);


        // Intersection Observer for Sticky CTA
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowStickyCTA(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        if (heroCTARef.current) {
            observer.observe(heroCTARef.current);
        }

        const pricingObserver = new IntersectionObserver(
            ([entry]) => {
                setIsPricingVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (pricingRef.current) {
            pricingObserver.observe(pricingRef.current);
        }

        return () => {
            clearInterval(chatInterval);
            clearInterval(assetInterval);
            observer.disconnect();
            pricingObserver.disconnect();
        };
    }, []);

    // --- Handlers ---
    const scrollToPricing = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' });
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "INSIDERS.",
        "url": "https://insiders-hub.jp",
        "description": "単発のバズではなく、権利クリア済みの動画をGoogleマップの資産へ。本物の訪日客が直接やってくるインバウンド資産構築インフラ。",
        "publisher": {
            "@type": "Organization",
            "name": "株式会社nots"
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* =========================================
                NAVBAR
            ========================================= */}
            <Header />

            {/* =========================================
          1. HERO SECTION (Core Narrative Injected)
      ========================================= */}
            <section id="concept" className="relative pt-20 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-slate-50 border-b border-slate-200">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem][mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        {/* 左：テキストエリア */}
                        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start pt-4 sm:pt-0">
                            {/* 上部ラベル */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black mb-6 animate-fade-in">
                                <Sparkles className="w-4 h-4" />
                                <span>インバウンドクリエイター特化型プラットフォーム</span>
                            </div>

                            <h1 className="text-4xl sm:text-4xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 lg:mb-8 leading-[1.0] lg:leading-[1.1] max-w-[900px]">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 block mt-2">
                                    INSIDERS.
                                </span>
                            </h1>
                            <h1 className="text-xl sm:text-3xl lg:text-3xl font-black tracking-tight text-slate-900 mb-6 lg:mb-8 leading-[1.0] lg:leading-[1.1] max-w-[900px]">
                                <span className="block mb-2">世界中のスマホに</span>
                                <span className="block mb-2">“インバウンド動画看板”</span>
                                <span className="block mb-2">を立てよう。</span>
                            </h1>

                            {/* スマホ版のみ：バッジとアニメーションをラベル/タイトルの下に配置 */}
                            <div className="lg:hidden w-full overflow-visible mb-6">
                                {/* 3つの実績/スペックバッジ (Mobile: Below Title) */}
                                <div className="grid grid-cols-3 gap-3 px-2 mb-10 mt-10">
                                    {[
                                        { icon: <Users className="w-5 h-5 text-indigo-600" />, value: "1000組+", sub: <>インバウンド特化<br />精査済みクリエイター</> },
                                        { icon: <Sparkles className="w-5 h-5 text-amber-600" />, value: "定額制", sub: <>マージンゼロで<br />直接オファーし放題</> },
                                        { icon: <RefreshCw className="w-5 h-5 text-emerald-600" />, value: "交渉レス", sub: <>投稿した動画を<br />マップで二次利用</> },
                                    ].map((badge, idx) => (
                                        <div key={idx} className="flex flex-col items-center justify-center p-2 sm:p-4 bg-transparent border-none rounded-none text-center">
                                            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2 justify-center w-full">
                                                <div className="shrink-0">{badge.icon}</div>
                                                <div className="text-[16px] sm:text-2xl font-black text-slate-900 leading-none tracking-tighter">{badge.value}</div>
                                            </div>
                                            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-widest">{badge.sub}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="scale-[0.85] sm:scale-100 origin-center -mt-6">
                                    <HeroDualMockups />
                                </div>
                            </div>

                            {/* 3つの実績/スペックバッジ (Desktop Only) */}
                            <div className="hidden lg:flex items-center gap-12 mb-12">
                                {[
                                    { icon: <Users className="w-6 h-6 text-indigo-600" />, value: "1000組+", sub: <>インバウンド特化<br />精査済みクリエイター</> },
                                    { icon: <Sparkles className="w-6 h-6 text-amber-600" />, value: "定額制", sub: <>マージンゼロで<br />直接オファーし放題</> },
                                    { icon: <RefreshCw className="w-6 h-6 text-emerald-600" />, value: "交渉レス", sub: <>投稿した動画を<br />マップで二次利用</> },
                                ].map((badge, idx) => (
                                    <div key={idx} className="flex flex-col items-center lg:items-center transition-all group text-center">
                                        <div className="flex items-center gap-3 mb-2 transition-transform group-hover:scale-110">
                                            <div className="shrink-0">{badge.icon}</div>
                                            <div className="text-[28px] font-black text-slate-900 tracking-tighter leading-none">{badge.value}</div>
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">{badge.sub}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center lg:items-start gap-4">
                                <button ref={heroCTARef} onClick={scrollToPricing} className="hidden sm:flex w-full sm:w-auto px-12 py-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                                    今すぐ無料でオファーを開始する
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* 右：Dual Mockups (PC表示のみ) */}
                        <div className="hidden lg:flex flex-1 relative w-full justify-center lg:justify-center opacity-90 lg:opacity-100 min-h-[600px] overflow-visible">
                            <div className="scale-[1.0] origin-center lg:origin-center transform-gpu">
                                <HeroDualMockups />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          2. PROBLEMS SECTION (RICH UI - NEON PAIN)
      ========================================= */}
            {/* =========================================
                2. CONCEPT & PAINS SECTION
                FV直下に新設、コンセプトと課題提起を統合
            ========================================= */}
            <section id="problem" className="py-24 bg-white relative overflow-hidden scroll-mt-24">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center mb-32">
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-sm md:text-xl font-black text-slate-900 mb-5 leading-[1.2]">
                                旅の目的地はアルゴリズムに“決めさせられている？”
                            </h2>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 leading-[1.2]">
                                SNSは現代の旅行動を支配する<br /><span className="text-indigo-600">“AIガイドブック”である</span>
                            </h2>
                            <div className="text-slate-500 text-base md:text-lg leading-relaxed space-y-6 font-medium">
                                <p>
                                    もし私達が異国を訪れて言語に不安があるとしたら、お店選びの決め手が「SNSで見つけた動画」と「Googleマップでの評判」になるのはごく自然なことです。インバウンド集客を成功させる近道は、今まさに日本旅行を検討している外国人のスマホに入り込み、彼らの『行きたいリスト』に直接あなたのお店を保存させてしまうことです。
                                </p>
                                <p className="text-slate-900 font-black">
                                    だからこそ、「OTAでの競合との上位表示争い」はもはや意味がありません。現代の訪日客はサイトを開く前に、SNSで直感的に目的地を決め、そのままGoogleマップで来店してしまうのです。
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-xl">
                            {/* Z-Generation Journey Visualization (Polished) */}
                            <div className="relative space-y-4">
                                {[
                                    {
                                        step: "STEP 1",
                                        tag: "旅マエ",
                                        desc: "SNSのおすすめタブで直感的に発見",
                                        icon: <PlayCircle className="w-6 h-6 text-indigo-600" />,
                                        visual: (
                                            <div className="relative w-full h-48 bg-slate-50 rounded-[2.5rem] overflow-hidden flex items-center justify-center gap-6 shadow-inner border border-slate-100">
                                                {/* Left: Extra Narrow Smartphone Feed */}
                                                <div className="relative w-20 sm:w-22 h-[88%] bg-slate-900 rounded-[1.2rem] border-[3px] border-slate-800 shadow-2xl overflow-hidden shrink-0">
                                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-indigo-500/20 to-transparent" />

                                                    {/* Play Button Icon added to center */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                                        <PlayCircle className="w-8 h-8 text-white" />
                                                    </div>

                                                    <div className="absolute inset-x-2 top-2 h-0.5 flex gap-0.5">
                                                        <div className="flex-1 bg-white/40 rounded-full" />
                                                        <div className="flex-1 bg-white/10 rounded-full" />
                                                        <div className="flex-1 bg-white/10 rounded-full" />
                                                    </div>
                                                    <motion.div
                                                        animate={{ y: [30, -30], opacity: [0, 1, 0] }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                    >
                                                        <Pointer className="w-4 h-4 text-white/40" />
                                                    </motion.div>
                                                </div>

                                                {/* Right: Reaction Sequence (Centered with Phone) */}
                                                <div className="relative h-full flex flex-col justify-center items-start gap-3">
                                                    {[
                                                        { icon: <MessageCircle className="w-3 h-3 text-indigo-500 fill-indigo-50" />, text: "Best Sushi!", delay: 0 },
                                                        { icon: <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />, text: "Liked!", delay: 1 },
                                                        { icon: <Bookmark className="w-3 h-3 text-indigo-500 fill-indigo-500" />, text: "Saved!", delay: 2 },
                                                    ].map((item, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                                            animate={{ opacity: [0, 1, 1, 0], x: [10, 0, 0, -5], scale: [0.8, 1, 1, 0.9] }}
                                                            transition={{ delay: item.delay, duration: 4, repeat: Infinity }}
                                                            className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-100 rounded-xl px-2.5 py-1.5 shadow-sm min-w-[90px]"
                                                        >
                                                            <div className="shrink-0">{item.icon}</div>
                                                            <span className="text-[9px] font-black text-slate-700 whitespace-nowrap">{item.text}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        step: "STEP 2",
                                        tag: "計画",
                                        desc: "「行きたいリスト」が連なり旅程に",
                                        icon: <Bookmark className="w-6 h-6 text-indigo-600" />,
                                        visual: (
                                            <div className="relative w-full h-48 bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl p-4">
                                                <div className="absolute inset-0 bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

                                                {/* Synchronized Header Loop (Centered & Narrow) */}
                                                <div className="absolute top-4 inset-x-0 z-20 flex justify-center px-4">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.02, 1], opacity: [0.8, 1, 0.8] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-500/10 max-w-[180px] w-full"
                                                    >
                                                        <Bookmark className="w-3 h-3 text-indigo-400 fill-indigo-400 shrink-0" />
                                                        <div className="flex-1 text-center sm:text-left overflow-hidden">
                                                            <div className="text-[7px] font-black italic tracking-widest leading-none opacity-40 uppercase truncate">TRIP LIST</div>
                                                            <div className="text-[9px] font-bold text-indigo-200 truncate truncate">"TRAVEL LIST"</div>
                                                        </div>
                                                        <Check className="w-3 h-3 text-green-400" />
                                                    </motion.div>
                                                </div>

                                                {/* Sequence: Pins appearing -> Route forming (Centered Visual Area) */}
                                                <div className="relative w-full h-full pt-16 flex justify-center">
                                                    <div className="relative w-[210px] h-full overflow-visible">
                                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                            <motion.path
                                                                d="M 35,40 Q 75,65 105,45 T 175,35"
                                                                fill="none"
                                                                stroke="url(#route-gradient-step2-fixed)"
                                                                strokeWidth="3.5"
                                                                strokeLinecap="round"
                                                                strokeDasharray="6 6"
                                                                initial={{ pathLength: 0 }}
                                                                animate={{ pathLength: [0, 0, 1, 1, 0] }}
                                                                transition={{
                                                                    repeat: Infinity,
                                                                    duration: 5,
                                                                    times: [0, 0.4, 0.7, 0.9, 1],
                                                                    ease: "easeInOut"
                                                                }}
                                                            />
                                                            <defs>
                                                                <linearGradient id="route-gradient-step2-fixed" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                    <stop offset="0%" stopColor="#6366f1" />
                                                                    <stop offset="100%" stopColor="#a855f7" />
                                                                </linearGradient>
                                                            </defs>
                                                        </svg>

                                                        {[
                                                            { x: 35, y: 40, showAt: 0.1, hideAt: 0.95 },
                                                            { x: 105, y: 45, showAt: 0.2, hideAt: 0.95 },
                                                            { x: 175, y: 35, showAt: 0.3, hideAt: 0.95 },
                                                        ].map((pin, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ scale: 0, opacity: 0 }}
                                                                animate={{
                                                                    scale: [0, 1, 1, 0],
                                                                    opacity: [0, 1, 1, 0]
                                                                }}
                                                                transition={{
                                                                    repeat: Infinity,
                                                                    duration: 5,
                                                                    times: [0, pin.showAt, pin.hideAt, 1]
                                                                }}
                                                                style={{ left: `${pin.x}px`, top: `${pin.y}px` }}
                                                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                                            >
                                                                <div className="relative">
                                                                    <div className="absolute -inset-2 bg-indigo-500/20 blur-md rounded-full" />
                                                                    <MapPin className="w-8 h-8 text-indigo-600 fill-indigo-50 relative" />
                                                                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        step: "STEP 3",
                                        tag: "旅ナカ",
                                        desc: "保存したピンを頼りに目的地へ直行",
                                        icon: <MapPin className="w-6 h-6 text-indigo-600" />,
                                        visual: (
                                            <div className="relative w-full h-48 bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center">
                                                <img
                                                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                                    alt="Walking in Shibuya"
                                                />
                                                <div className="absolute inset-x-4 top-2 h-0.5 bg-white/20 rounded-full overflow-hidden">
                                                    <motion.div
                                                        animate={{ x: ['-100%', '100%'] }}
                                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                        className="w-1/2 h-full bg-indigo-400"
                                                    />
                                                </div>

                                                <div className="relative w-full h-full p-4 flex flex-col justify-between pt-6">
                                                    <motion.div
                                                        animate={{ y: [0, -2, 0] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="flex justify-start"
                                                    >
                                                    </motion.div>

                                                    <div className="flex justify-end pr-1">
                                                        <motion.div
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.5, type: "spring" }}
                                                            className="bg-white p-3 rounded-2xl shadow-2xl flex gap-3 max-w-[170px] border border-slate-100"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                                                                <Coffee className="w-5 h-5 text-orange-600" />
                                                            </div>
                                                            <div className="space-y-0.5 overflow-hidden">
                                                                <div className="text-[7px] font-black text-indigo-500 uppercase flex items-center gap-1">Next Discovery <ArrowUpRight className="w-2 h-2" /></div>
                                                                <p className="text-[9px] font-black text-slate-900 truncate">Hidden Matcha Cafe</p>
                                                                <p className="text-[8px] font-bold text-slate-500">★ 4.9 (200m away)</p>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </div>

                                                <div className="absolute inset-0 bg-[radial-gradient(transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                                            </div>
                                        )
                                    }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={item.step}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.2 }}
                                        viewport={{ once: true }}
                                        className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col sm:flex-row items-center gap-8 group hover:shadow-2xl transition-all duration-500"
                                    >
                                        <div className="flex-1 space-y-5 text-center sm:text-left">
                                            <div className="flex flex-row items-center gap-3 justify-center sm:justify-start">
                                                <span className="text-xs sm:text-sm font-black bg-indigo-600 text-white px-3 py-1.5 rounded-full uppercase tracking-tighter">
                                                    {item.step}
                                                </span>
                                                <span className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest pl-3 border-l-2 border-indigo-100">
                                                    {item.tag}
                                                </span>
                                            </div>
                                            <p className="text-lg sm:text-xl font-bold text-slate-900 leading-tight tracking-tight">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div className="w-full sm:w-64 shrink-0 transform group-hover:scale-[1.02] transition-transform duration-500">
                                            {item.visual}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div id="problems" className="pt-10 sm:pt-20 border-t border-slate-100 scroll-mt-24">
                        <div className="text-center mb-10 sm:mb-16">
                            <h2 className="text-xl sm:text-4xl font-black tracking-tight text-slate-900 leading-[1.5] lg:leading-[1.5] max-w-4xl mx-auto mb-2 sm:mb-4">
                                比較サイトでの消耗戦は不要。<br />
                                <span className="text-indigo-600">インバウンド集客はもっとズルくていい</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
                            {[
                                {
                                    icon: <Target className="w-8 h-8" />,
                                    color: 'amber',
                                    title: <>日本人を捨てて、<br />訪日客のスマホだけを狙う</>,
                                    desc: 'マスに向けたビラ配りのようなPRは不要です。今まさに日本旅行を計画している外国人のSNSのおすすめタブ（一等地）にだけピンポイントで看板を出すのが最も効率的です。'
                                },
                                {
                                    icon: <Zap className="w-8 h-8" />,
                                    color: 'rose',
                                    title: <>比較サイトから逃げ、<br />マップ上で勝負する</>,
                                    desc: 'OTAの検索結果で、価格や評価を競合と争うのはやめましょう。Googleマップという行動の終着点に直接「動画の看板」を立てることで、比較されることなく「指名買い」されます。'
                                },
                                {
                                    icon: <Globe className="w-8 h-8" />,
                                    color: 'indigo',
                                    title: <>英語力を諦め、<br />ネイティブの熱量に頼る</>,
                                    desc: '不慣れな外国語での発信で現場を疲弊させる必要はありません。言葉の壁の突破とお店の魅力の翻訳は、その国のトレンドを知り尽くしたクリエイターに任せるのが一番の近道です。'
                                }
                            ].map((pain, idx) => (
                                <div key={idx} className="bg-slate-50 p-7 sm:p-9 rounded-[2.5rem] border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center">
                                    <div className="flex flex-col items-center gap-4 mb-6">
                                        <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-indigo-100 transition-all text-${pain.color}-500 shrink-0`}>
                                            {pain.icon}
                                        </div>
                                        <h3 className="text-lg lg:text-[17px] font-black text-slate-900 leading-tight min-h-[2.5rem] flex items-center justify-center">
                                            {pain.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed font-bold">
                                        {pain.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Bridge Copy */}
                        <div className="mt-20 text-center max-w-3xl mx-auto">
                            <div className="mt-10 flex justify-center">
                                <div className="flex flex-col items-center gap-2 animate-bounce">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scroll to Solution</span>
                                    <ArrowRight className="w-6 h-6 text-indigo-500 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* =========================================
          5. CORE VALUES & UI MOCKUPS (The Proof & Core Narrative)
      ========================================= */}
            <section id="solution" className="py-16 sm:py-24 bg-white border-t border-slate-100 overflow-hidden scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-32">
                        <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.5]">
                            <span className="text-indigo-600">インバウンド動画看板を構築する</span><br />
                            『INSIDERS.』4つの独自システム
                        </h2>
                    </div>

                    <div className="space-y-32">
                        {/* Point 01: Comparison Table */}
                        <div className="max-w-6xl mx-auto px-4 sm:px-0">
                            <div className="bg-slate-50 rounded-[3rem] p-8 sm:p-16 border border-slate-100">
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mb-4">
                                        <Sparkles className="w-5 h-5 font-black" /> Point 01. クリエイターへの直通パス
                                    </div>
                                    <h3 className="text-xl sm:text-4xl font-black text-slate-900 mb-6">
                                        インバウンドクリエイターに定額で直接オファーし放題！
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-bold">
                                        INSIDERS.は、厳選されたインバウンドクリエイターへ直接アプローチを行える『独自の依頼ルート』です。<br className="hidden sm:block" />
                                        一般の英語DMのように埋もれることなく、貴店の魅力を確実にクリエイターへ届けるオファーを何度でも送信できます。
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px] border-separate border-spacing-0 overflow-hidden rounded-3xl">
                                        <thead>
                                            <tr>
                                                <th className="p-6 bg-white border-b border-r border-slate-100 text-left text-xs font-black text-slate uppercase tracking-widest">比較項目</th>
                                                <th className="p-6 bg-white border-b border-r border-slate-100 text-center">
                                                    <div className="text-sm font-black text-slate-400 mb-1">一般的な料金体系</div>
                                                    <div className="text-sm text-slate-300 font-bold uppercase">（買い切り型）</div>
                                                </th>
                                                <th className="p-6 bg-indigo-600 border-b border-indigo-500 text-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-10" />
                                                    <div className="relative z-10 text-sm font-black text-white mb-1">INSIDERS.</div>
                                                    <div className="relative z-10 text-sm text-indigo-200 font-bold uppercase">（プラットフォーム型）</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { item: "費用", standard: "30~50万円のパッケージ", insiders: <>月額4万円でオファーし放題<br className="sm:hidden" /><span className="block mt-1 sm:inline sm:mt-0">（マージンゼロの直取引）</span></> },
                                                { item: "フォロワー単価", standard: "約3円", insiders: <>単価の規定はなく、<br className="sm:hidden" /><span className="block mt-1 sm:inline sm:mt-0">好きな条件でオファー可能</span></> },
                                                { item: "クリエイターの性質", standard: <>在日の外国人中心<br className="sm:hidden" /><span className="block mt-1 sm:inline sm:mt-0">「静的なリスト」</span></>, insiders: <>SNSでのパフォーマンスに基づいた<br className="sm:hidden" /><span className="block mt-1 sm:inline sm:mt-0">常時更新型の「動的なリスト」</span></> },
                                            ].map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-6 bg-white border-b border-r border-slate-100 text-xs sm:text-sm font-black text-slate-900">{row.item}</td>
                                                    <td className="p-6 bg-white border-b border-r border-slate-100 text-xs sm:text-sm font-bold text-slate-400 text-center">{row.standard}</td>
                                                    <td className={`p-6 border-b text-xs sm:text-sm font-black text-center bg-indigo-50 text-indigo-700 border-indigo-100`}>
                                                        {row.item === "クリエイターの性質" ? (
                                                            <>
                                                                SNSでのパフォーマンスに基づいた<br className="sm:hidden" />
                                                                常時更新型の「動的なリスト」
                                                            </>
                                                        ) : row.insiders}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Point 02: THE CREATORS */}
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 max-w-6xl mx-auto px-6 sm:px-0">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mb-4">
                                    <Database className="w-5 h-5 font-black" /> Point 02. ハイレベルなクリエイター網
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                                    1,000組以上の厳選された<br />クリエイターデータベース
                                </h3>
                                <ul className="space-y-6">
                                    {[
                                        { title: "デジタル技術×目視による高い品質", desc: "訪日を検討している外国人のSNSアルゴリズムを分析し、良質なクリエイターだけを丁寧に厳選。" },
                                        { title: "最適なクリエイターとのマッチング", desc: "GoogleマップやSNSのURLを入れるだけで、貴店と好相性のインバウンドクリエイターを推薦。" },
                                        { title: "データベースの常時アップデート", desc: "世界中に点在するクリエイターを見つけ出し、直近のSNSパフォーマンスを随時反映させます。" }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4">
                                            <div className="shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm sm:text-base font-black text-slate-900 mb-1">{item.title}</div>
                                                <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto h-[350px] sm:h-[450px] items-center">
                                <div className="relative w-full h-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group">
                                    <img src="/images/premium_creators.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">1,000組以上のネイティブクリエイター</span>
                                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30">訪日検討者から高いエンゲージメント</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Point 03: THE VIRAL WAVE */}
                        <div id="viral-wave" className="flex flex-col lg:flex-row-reverse items-center justify-center gap-4 sm:gap-6 lg:gap-14 max-w-6xl mx-auto px-6 sm:px-0 scroll-mt-24">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-violet-600 font-bold text-sm mb-4">
                                    <MessageSquare className="w-5 h-5 font-black" /> Point 03.  オファー力を最大化するシステム
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                                    AIアシスタント機能で<br />キャパいらず簡単オファー
                                </h3>
                                <ul className="space-y-6">
                                    {[
                                        { title: "自動翻訳機能", desc: "日本語で入力するだけで、英語で依頼に関する要望をクリエイターに伝えることができます。" },
                                        { title: "充実したオファーテンプレート", desc: "日程調整や撮影条件の面倒な交渉も、テンプレートから選ぶだけで簡単にクリア。" },
                                        { title: "現場の負担ゼロ", desc: "撮影指示はWEBで完結。通常業務の手を止めることなく、スムーズに動画撮影が完了します。" }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4">
                                            <div className="shrink-0 w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-violet-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm sm:text-base font-black text-slate-900 mb-1">{item.title}</div>
                                                <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto h-[320px] sm:h-[450px] overflow-visible items-start -mt-12 sm:mt-0">
                                <div className="absolute inset-0 bg-violet-50 rounded-[2.5rem] sm:rounded-[3rem] rotate-1 sm:rotate-3 scale-105 -z-10" />
                                <div className="w-full max-w-[280px] sm:max-w-[320px] flex items-center justify-center">
                                    <div className="scale-[0.75] sm:scale-[0.9] transform-gpu">
                                        <HeroDualMockups isMiniFlow={true} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Point 04: THE LANDMARK */}
                        <div id="landmark" className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 max-w-6xl mx-auto px-6 sm:px-0 pb-10 sm:pb-20">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                                    <LayoutGrid className="w-5 h-5 font-black" /> Point 04. 動画コンテンツを集客資産にする
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                                    Googleマップを「24時間集客する動画看板」へ昇華
                                </h3>
                                <ul className="space-y-6">
                                    {[
                                        { title: "インバウンドの終着点に看板を設置", desc: "動画の熱が高まっているうちに「指名買い」を促し、OTAで他店と比較される前に予約へ誘導。" },
                                        { title: "動画資産のフル活用", desc: "好反応なショート動画を使い捨てずに、Googleマップで24時間動く集客資産として最大限活用。" },
                                        { title: "二次利用権利クリア", desc: "納品された動画は、追加費用なしでGoogleマップに掲載可能です（※改変・広告利用は不可）。" }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4">
                                            <div className="shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm sm:text-base font-black text-slate-900 mb-1">{item.title}</div>
                                                <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto h-[450px] sm:h-[500px] overflow-visible">
                                <div className="absolute inset-0 bg-emerald-50 rounded-[2.5rem] sm:rounded-[3rem] -z-10" />
                                <div className="w-[280px] sm:w-[340px] max-w-[92%] bg-white rounded-[2rem] border-[6px] border-slate-50 shadow-xl overflow-hidden p-5 sm:p-6 relative rotate-0">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 mb-5 pb-2 border-b border-slate-100 text-left">
                                        <LayoutGrid className="w-4 h-4 text-emerald-600" /> ASSET HUB
                                        <span className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">3 ASSETS</span>
                                    </div>

                                    {/* License Info (Moved UP) */}
                                    <div className={`bg-emerald-50 rounded-xl p-3 mb-5 border border-emerald-100 transition-all duration-700 ${assetStep >= 1 ? 'opacity-100' : 'opacity-60'}`}>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                            <span className="text-[8px] font-black text-emerald-800 uppercase tracking-widest">二次利用権限：承認済み</span>
                                        </div>
                                        <p className="text-[7px] text-emerald-600 leading-relaxed font-bold">
                                            安心してGoogleマップに掲載いただけます。
                                        </p>
                                    </div>

                                    {/* Video Asset thumbnails with human portraits */}
                                    <div className="flex gap-3 mb-6">
                                        {[
                                            { color: 'from-pink-500 to-rose-400', label: 'THE WAGYU experience', icon: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=40&h=40&q=80" },
                                            { color: 'from-fuchsia-500 to-indigo-400', label: 'Hidden Gem in Shibuya', icon: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=40&h=40&q=80" },
                                            { color: 'from-emerald-500 to-teal-400', label: 'Must visit beautiful spot', icon: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80" }
                                        ].map((asset, idx) => (
                                            <div key={idx} className={`relative w-24 h-32 rounded-xl overflow-hidden border-2 transition-all duration-700 bg-gradient-to-br ${asset.color} p-2 flex flex-col justify-between shadow-lg ${assetStep >= 2 && idx === 0 ? 'ring-4 ring-emerald-400 scale-105' : 'border-white/50 opacity-80'}`}>
                                                <div className="text-[9px] font-black text-white leading-tight drop-shadow-sm uppercase">"{asset.label}"</div>
                                                <div className="flex justify-between items-end">
                                                    <div className="w-6 h-6 rounded-full border-2 border-white/50 overflow-hidden shadow-sm">
                                                        <img src={asset.icon} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="bg-white/20 backdrop-blur-md rounded-full p-1 border border-white/30">
                                                        <Shield className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Sync to Maps & Web with Loader */}
                                    <div className="grid grid-cols-2 gap-3 relative z-10">
                                        <div className={`border rounded-xl p-3 text-left transition-all duration-500 ${assetStep >= 2 ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`p-1 rounded-md ${assetStep >= 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                                                    {assetStep >= 2 ? <CheckCircle2 className="w-3 h-3" /> : <PlayCircle className="w-3 h-3 animate-pulse" />}
                                                </div>
                                                <span className="text-[8px] font-black text-slate-700">権利クリア</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1 mb-1 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: assetStep >= 2 ? "100%" : assetStep >= 1 ? "40%" : "0%" }}
                                                    className={`h-1 transition-all duration-1000 ${assetStep >= 2 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                                />
                                            </div>
                                        </div>

                                        <div className={`border rounded-xl p-3 text-left transition-all duration-500 ${assetStep >= 3 ? 'border-indigo-400 bg-indigo-50/30 shadow-lg shadow-indigo-100' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`p-1 rounded-md ${assetStep >= 3 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-300'}`}>
                                                    <MapPin className="w-3 h-3" />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-700">マップに掲載</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1 mb-1 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: assetStep >= 3 ? "100%" : "0%" }}
                                                    className="h-1 bg-indigo-600 transition-all duration-1000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-center gap-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100 shadow-inner">
                                        {assetStep === 1 ? (
                                            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full shrink-0" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                        )}
                                        <div className="text-[7px] text-slate-500 font-bold leading-tight uppercase tracking-tighter">
                                            {assetStep >= 3 ? '同期完了：Googleマップに反映されました' : assetStep === 1 ? '動画をアップロード中...' : '著作権と動画ステータスを確認中...'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* =========================================
          6. THE INBOUND FLYWHEEL (Linear Journey)
      ========================================= */}
            < section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden" >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.05),transparent_50%)]" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4 text-slate-900 leading-tight">
                        「買い切り集客」からの脱却<br />
                        <span className="text-indigo-600">インバウンド来店ループへ</span>
                    </h2>
                    <p className="text-slate-500 mb-20 max-w-2xl mx-auto text-sm sm:text-sm font-bold leading-relaxed">
                        ただ動画を投稿して、Googleマップに埋め込むだけではありません。<br className="hidden sm:block" />これはあなたのお店を「24時間外国人を呼び込むデジタル対応店舗」へと進化させるための第一歩です。
                    </p>

                    <div className="relative">
                        {/* Single Horizontal Line (Centered through icons) */}
                        <div className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-rose-500/30 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative text-center">
                            {[
                                {
                                    icon: <PlayCircle className="w-8 h-8" />,
                                    bg: 'bg-indigo-600',
                                    color: 'text-indigo-600',
                                    title: '1. SNSの「おすすめタブ」を狙い撃ち',
                                    badge: 'Reach',
                                    desc: 'クリエイターによる動画投稿が、フォロー枠を超えて潜在顧客へ確実にリーチ。'
                                },
                                {
                                    icon: <Users className="w-8 h-8" />,
                                    bg: 'bg-violet-600',
                                    color: 'text-violet-600',
                                    title: '2. OTAを通さず「指名買い」',
                                    badge: 'Action',
                                    desc: '動画で「体験」を疑似体験させることで、高額な予約サイトを経由しない直予約を実現。'
                                },
                                {
                                    icon: <MapPin className="w-8 h-8" />,
                                    bg: 'bg-emerald-600',
                                    color: 'text-emerald-600',
                                    title: '3. Googleマップを「動画看板」に',
                                    badge: 'Asset',
                                    desc: '口コミ欄に動画が増えることで、検索結果でのクリック率と来店転換率を劇的に向上。'
                                },
                                {
                                    icon: <TrendingUp className="w-8 h-8" />,
                                    bg: 'bg-rose-600',
                                    color: 'text-rose-600',
                                    title: '4. 手数料ゼロの「集客自動化」',
                                    badge: 'Growth',
                                    desc: '良質なコンテンツが自走し、広告費ゼロ・手数料ゼロの持続可能な集客ループが完成。'
                                },
                            ].map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center group hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center w-full gap-4 text-center">
                                        <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform mb-4`}>
                                            <div className="text-white shrink-0">{step.icon}</div>
                                        </div>
                                        <div className="w-full">
                                            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{step.badge}</div>
                                            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tighter leading-tight text-center">{step.title}</h3>
                                            <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed max-w-[200px] mx-auto text-center">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Final Loop Indication */}
                        <div className="mt-16 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl animate-bounce">
                                <Repeat className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className="text-sm font-black text-slate-900 tracking-widest flex items-center gap-3">
                                <div className="w-8 h-px bg-slate-200" />
                                評判が更なる来店を呼ぶ<br />「インバウンド来店ループ」へ
                                <div className="w-8 h-px bg-slate-200" />
                            </div>
                        </div>
                    </div>

                    {/* ROI Usecases */}
                    <div className="mt-20 max-w-5xl mx-auto">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-center text-slate-900 mb-10 tracking-tight">
                            このループが回れば、<br className="sm:hidden" />月額4万円は<span className="text-indigo-600">一瞬でペイ</span>します。
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-xl shadow-indigo-100/20 hover:shadow-indigo-200/40 hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform">
                                    💄
                                </div>
                                <h4 className="font-black text-slate-900 mb-3 text-[15px]">美容室・ヘッドスパの場合</h4>
                                <p className="text-slate-600 text-sm leading-relaxed font-bold">
                                    月に<span className="font-black text-rose-500">「2〜3組」</span>の直予約で回収完了。<br/>ホットペッパー等の掲載料と比べ、圧倒的な利益率を実現します。
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-xl shadow-indigo-100/20 hover:shadow-indigo-200/40 hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform">
                                    🏔
                                </div>
                                <h4 className="font-black text-slate-900 mb-3 text-[15px]">体験・アクティビティの場合</h4>
                                <p className="text-slate-600 text-sm leading-relaxed font-bold">
                                    月に<span className="font-black text-sky-500">「4組」</span>の直予約で回収完了。<br/>Klook等に支払う20%の高額な手数料が完全にゼロになります。
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-xl shadow-indigo-100/20 hover:shadow-indigo-200/40 hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform">
                                    🏨
                                </div>
                                <h4 className="font-black text-slate-900 mb-3 text-[15px]">宿泊施設・Ryokanの場合</h4>
                                <p className="text-slate-600 text-sm leading-relaxed font-bold">
                                    月に<span className="font-black text-indigo-500">「1組（連泊）」</span>の直予約で回収完了。<br/>Booking.com等に頼らず、利益をそのまま自社に残せます。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* =========================================
          7. PRICING & SaaS TRIAL OFFER (インフラ維持費としての正当化)
      ========================================= */}
            <section id="plan" ref={pricingRef} className="py-24 bg-white border-t border-slate-100 scroll-mt-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="group bg-slate-50 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl shadow-indigo-100/50 text-center relative overflow-hidden mb-12 border border-slate-200 transition-all duration-700 hover:shadow-indigo-200/50">
                        {/* Shimmer Sweep - Light version */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(99,102,241,0.03) 45%, rgba(99,102,241,0.06) 50%, rgba(99,102,241,0.03) 55%, transparent 60%)', backgroundSize: '200% 100%', animation: 'hologramShine 3s ease infinite' }} />

                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

                        {/* Special Tag */}
                        <div className="inline-flex items-center gap-2 bg-indigo-100 border border-indigo-200 px-4 py-1.5 rounded-full mb-6">
                            <Crown className="w-4 h-4 text-amber-500" />
                            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">基本プラン</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">INSIDERS. スタンダード</h2>

                        <div className="flex items-end justify-center gap-2 mb-10 translate-x-3">
                            <span className="text-5xl sm:text-6xl font-black tracking-tighter text-indigo-600 leading-none">40,000</span>
                            <div className="text-left font-black text-slate-400 leading-tight">
                                <div className="text-sm sm:text-xl tracking-tighter">円 / 月（税別）</div>
                            </div>
                        </div>

                        <ul className="text-left w-fit mx-auto space-y-5 mb-12 text-slate-600 font-bold">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <span>クリエイターへのオファー無制限</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <span>AIによる翻訳・文章作成機能搭載</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <span>Googleマップへの動画掲載無料</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <span>初期費用 ¥0・いつでも解約可能</span>
                            </li>
                        </ul>

                        {/* Trial Box - Light Glass Card */}
                        <div className="bg-white border-2 border-indigo-100 rounded-[2rem] p-8 mb-10 max-w-lg mx-auto shadow-xl shadow-indigo-100/50 group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="text-indigo-600 font-black text-sm mb-3 flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> 早期アクセス特典（承認制）
                            </div>
                            <div className="text-slate-900 font-black text-md mb-4 leading-tight">
                                3名分のオファー枠がもらえるトライアルプランで、<br />無料ですぐにサービスをご利用いただけます！
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed space-y-1">
                                <span className="block opacity-60">※クリエイター検索やオファーなど、サービスの機能全てが無料でご利用いただけます。</span>
                                <span className="block opacity-60">※クリエイターへの商品提供や有償オファーをする場合は実費でのご負担となります。</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4 w-full px-4 sm:px-0">
                            <button onClick={() => window.location.href = '/advertiser/gateway'} className="w-full sm:w-auto px-10 sm:px-16 py-5 sm:py-6 bg-slate-900 text-white rounded-2xl font-black text-sm sm:text-xl shadow-2xl hover:bg-slate-800 transition-all items-center justify-center gap-3 mx-auto active:scale-95 flex leading-tight">
                                今すぐ無料で<br className="sm:hidden" />オファーを開始する
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                            </button>
                            <p className="sm:hidden text-[10px] text-slate-400 font-bold">※タップするとログインページへ遷移します</p>
                        </div>
                    </div>

                    {/* =========================================
                      8. UPSELL TEASER (BUZZ OVER) - Low Prominence with Hover
                  ========================================= */}
                    <div
                        onClick={(e) => {
                            if (window.innerWidth < 1024) {
                                e.currentTarget.classList.toggle('opacity-100');
                                e.currentTarget.classList.toggle('opacity-30');
                            }
                        }}
                        className="text-center pt-8 border-t border-slate-100 max-w-3xl mx-auto opacity-30 hover:opacity-100 transition-opacity duration-700 group cursor-pointer lg:cursor-default"
                    >
                        <h4 className="text-xl font-black text-slate-900 mb-3 grayscale group-hover:grayscale-0 transition-all">もっと来店効率を高めたいなら…</h4>
                        <p className="text-[12px] text-slate-500 mb-6 leading-relaxed max-w-sm mx-auto">
                            INSIDERS.で集客に成功した後、「予約導線やGoogleマップの対応が追いつかない」というご相談をいただいています。
                            より広範囲での集客支援が必要でしたら、スマートBPOサービスをご検討ください。
                        </p>
                        <a href="https://buzzover.jp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm bg-indigo-50 px-5 py-3 rounded-2xl border border-indigo-100/50 shadow-sm active:scale-95">
                            インバウンド集客専門のスマートBPO<br className="sm:hidden" />「BUZZ OVER」の詳細を見る <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>

                </div>
            </section >

            {/* =========================================
              9. STICKY FOOTER CTA (Mobile Conversion Trigger)
          ========================================= */}
            {/* --- Sticky Footer CTA (Mobile Only) --- */}
            <div className={`sm:hidden fixed bottom-6 left-4 right-4 z-[100] transition-all duration-500 transform ${showStickyCTA && !isPricingVisible ? 'translate-y-0 opacity-100 animate-slide-up-sticky' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="max-w-md mx-auto">
                    {/* Microcopy Tooltip */}
                    <div className="flex justify-center mb-2">
                    </div>
                    {/* Main Button */}
                    <button
                        onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all duration-700 text-white py-4 px-6 rounded-2xl font-black text-base shadow-[0_15px_30px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3 group relative overflow-hidden active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
                        <span className="text-xl">✨️</span>
                        無料でオファーを試してみる
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="py-8 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                            <div className="text-xl font-black tracking-tighter text-slate-900">INSIDERS.</div>
                            <div className="text-sm font-black text-slate-900">あなたのお店をインバウンドの目的地に。</div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
                                <a href="/privacy" className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 whitespace-nowrap">プライバシーポリシー <ArrowUpRight className="w-3 h-3" /></a>
                                <a href="/terms" className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 whitespace-nowrap">利用規約 <ArrowUpRight className="w-3 h-3" /></a>
                                <a href="/terms-sp" className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 whitespace-nowrap">特定商取引法に基づく表記 <ArrowUpRight className="w-3 h-3" /></a>
                                <a href="https://nots-inc.jp/" target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 whitespace-nowrap">会社概要 <ArrowUpRight className="w-3 h-3" /></a>
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-400 font-bold">© 2026 nots, inc.</div>
                        </div>
                    </div>
                </div>
            </footer>

        </div >
    );
}