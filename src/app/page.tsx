"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, CheckCircle2, ArrowRight, Sparkles,
    MousePointer2, Send, Crown, Check, AlertTriangle,
    Database, MessageSquare, LayoutGrid, PlayCircle,
    Shield, MapPin, Globe, Repeat, Users, TrendingUp, TrendingDown,
    ArrowUpRight, Menu, X
} from 'lucide-react';

const elenaIcon = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80";

function HeroDualMockups({ isMiniFlow = false }: { isMiniFlow?: boolean }) {
    const [step, setStep] = useState(isMiniFlow ? 4 : 0);
    const [scrollCreator, setScrollCreator] = useState(0);
    const [showMapLink, setShowMapLink] = useState(false);

    // 完全再現：URL入力からオファー完了までのシーケンス制御
    useEffect(() => {
        let isMounted = true;
        const runSequence = async () => {
            while (isMounted) {
                setStep(isMiniFlow ? 4 : 0); 
                setScrollCreator(0);
                setShowMapLink(false);
                
                if (!isMiniFlow) {
                    await new Promise(r => setTimeout(r, 1500));
                    setStep(1); // URLタイピング＆クリック
                    await new Promise(r => setTimeout(r, 1000));
                    setStep(2); // 2. ローディング（魅力言語化中）
                    await new Promise(r => setTimeout(r, 1800));
                    setStep(3); // 3. 分析完了（タグ表示）
                    await new Promise(r => setTimeout(r, 1800));
                }
                
                setStep(4); // 4. クリエイターカタログ（Elena Match）
                await new Promise(r => setTimeout(r, 2200));
                setStep(5); // 5. オファー作成（金額・要素選択）
                await new Promise(r => setTimeout(r, 2500));
                setStep(6); // 6. AI英語生成（JPからENへ変化）
                await new Promise(r => setTimeout(r, 3000));
                
                // Add Map Link Animation
                setShowMapLink(true);
                await new Promise(r => setTimeout(r, 1500));
                
                setStep(7); // 7. 送信完了 (Advertiser Side - SENT!)
                await new Promise(r => setTimeout(r, 2000));
                
                setStep(8); // 8. Transition Step (Hide Advertiser, Prepare Creator)
                await new Promise(r => setTimeout(r, 800));
                
                setStep(9); // 9. クリエイター側：INVITATION RECEIVED表示
                await new Promise(r => setTimeout(r, 2500));
                
                setStep(10); // 10. クリエイター側：ボタンクリック後、メイン画面へ
                
                // なめらかにスクロール (Limit to image bottom)
                setScrollCreator(65); // 65% is usually enough for this png to show bottom
                await new Promise(r => setTimeout(r, 8000));
                
                await new Promise(r => setTimeout(r, 4000));
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
                    zIndex: (step >= 0 && step <= 8) ? 0 : 100
                }}
                transition={{ duration: 1.2, ease: "anticipate" }}
                className="absolute w-[240px] h-[500px] bg-[#0f172a] rounded-[3.5rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden hidden sm:flex flex-col"
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
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="bg-indigo-600 rounded-[2rem] p-6 shadow-2xl border border-indigo-400 w-full"
                                >
                                    <div className="bg-white text-indigo-600 text-[10px] sm:text-xs font-black py-4 rounded-xl text-center shadow-lg uppercase tracking-wider flex items-center justify-center gap-2">
                                        INVITATION RECEIVED <ArrowRight className="w-4 h-4" />
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
                    opacity: (step >= 8 && step <= 10) ? 0 : 1,
                    y: (step >= 8 && step <= 10) ? -80 : 0,
                    scale: (step >= 8 && step <= 10) ? 0.9 : 1,
                    zIndex: (step >= 8 && step <= 10) ? 0 : 10
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
                                    <Sparkles className="w-3 h-3" /> 1,200 Verified Creators
                                </div>
                                <h3 className="text-xl font-black mb-8 text-slate-900 leading-tight italic tracking-tighter">Find your best<br />Inbound Creators</h3>
                                <div className="w-full bg-white border border-slate-200 rounded-2xl flex items-center p-1.5 shadow-sm h-12">
                                    <div className="text-[10px] font-black px-3 border-r border-slate-100 flex items-center gap-1.5">🍱</div>
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
                                <div className="text-base font-black mb-3 text-slate-900 tracking-tighter uppercase">AI AGENT ANALYZING...</div>
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
                                        <h4 className="text-white text-lg font-black mb-6 italic leading-tight">navito_halal さんを招待</h4>
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
                        {step === 7 && (
                            <motion.div key="success-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full px-8 text-center bg-white z-[90] relative">
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-2xl border-[6px] border-white rotate-6">
                                    <Check className="w-12 h-12 text-emerald-500" strokeWidth={5} />
                                </div>
                                <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-3 uppercase">SENT!</h2>
                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-8">Offer Sent to Elena.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'TOP', href: '#top' },
        { name: 'SERVICE', href: '#solution' },
        { name: 'PROMOTION CASE', href: '#viral-wave' },
        { name: 'COMPANY', href: '#' },
        { name: 'CONTACT', href: '#signup' }
    ];

    return (
        <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md z-[110] border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="text-xl font-black tracking-tighter text-slate-900">nots.inc</div>
                
                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="text-[11px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Mobile Hamburger */}
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="lg:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-20 bg-white z-[110] lg:hidden overflow-y-auto px-6 py-12"
                    >
                        <nav className="flex flex-col items-center gap-10">
                            {navLinks.map((link) => (
                                <a 
                                  key={link.name} 
                                  href={link.href} 
                                  onClick={() => setIsOpen(false)}
                                  className="text-xl font-black text-slate-900 uppercase tracking-widest"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-16 w-full h-px bg-slate-100" />
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
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

        return () => {
            clearInterval(chatInterval);
            clearInterval(assetInterval);
            observer.disconnect();
        };
    }, []);

    // --- Handlers ---
    const scrollToDiagnosis = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById('problems')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            <section id="top" className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-slate-50 border-b border-slate-200">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem][mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                        {/* 左：テキストエリア */}
                        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
                            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-[1.2] sm:leading-[1.15]">
                                あなたのお店がインバウンド客の目的地になる。<br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                    ショート動画で訪日客の「行きたい！」をつくる集客インフラ『INSIDERS.』
                                </span>
                            </h1>

                            <p className="text-sm sm:text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                INSIDERS.は、訪日客の旅行計画に影響を与えるクリエイターへ、定額でPR動画を依頼し放題のプラットフォームです。<br className="hidden sm:block" /><br />
                                独自のデータ分析により、「今まさに訪日を計画している外国人のSNS」に表示されているクリエイターを自動で推薦。彼らが発信する動画を通じて、あなたのお店が外国人の「行きたいリスト」に直接入り込みます。<br className="hidden sm:block" />
                                英語ができなくても大丈夫。翻訳や面倒な依頼交渉をすべて引き受けます。
                            </p>

                            <div className="flex flex-col items-center lg:items-start gap-3 w-full sm:w-auto mt-6 lg:mt-0 order-2 lg:order-none">
                                <button ref={heroCTARef} onClick={scrollToDiagnosis} className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                                    クリエイターへのオファーを試してみる
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <span className="text-sm text-slate-400 font-bold flex items-center gap-1.5 justify-center lg:justify-start">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> クレジットカード登録不要・システム利用料¥0でトライアル利用
                                </span>
                            </div>
                        </div>

                        {/* 右：Dual Mockups (Advertiser vs Creator) */}
                        <div className="flex-1 relative w-full flex justify-center lg:justify-center order-3 lg:order-none opacity-90 lg:opacity-100 min-h-[350px] sm:min-h-[600px] overflow-visible">
                            <div className="scale-[0.65] sm:scale-100 origin-center lg:origin-center transform-gpu">
                                <HeroDualMockups />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          2. PROBLEMS SECTION (RICH UI - NEON PAIN)
      ========================================= */}
            <section id="problems" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black mb-4">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>CRITICAL PAINS</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 text-slate-900 leading-tight">
                            インバウンド集客で、<br className="sm:hidden" />
                            こんな「バケツの穴」が空いていませんか？
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {[
                            { 
                                icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />, 
                                color: 'rose', 
                                title: '来店に繋がらない', 
                                reason: '効果の不在', 
                                desc: 'フォロワー数の多さだけで「日本在住の外国人」にPR費用を払ってしまった。バズってもフォロワーは日本人ばかりで来店には結びつかない。' 
                            },
                            { 
                                icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />, 
                                color: 'amber', 
                                title: '現場がパンクする', 
                                reason: '工数の崩壊', 
                                desc: '自力でインフルエンサーを探そうとしても、英語での条件交渉や日程調整に途方もない時間がかかる。レス不足でチャンスを逃す。' 
                            },
                            { 
                                icon: <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />, 
                                color: 'indigo', 
                                title: '利益を搾取される', 
                                reason: '金銭面の負担', 
                                desc: 'TripAdvisorやKlookなどのOTAに20〜30%の手数料を抜かれ続ける「横並びの比較ゲーム」から抜け出せない。' 
                            }
                        ].map((pain, idx) => (
                            <div key={idx} className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-${pain.color}-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-${pain.color}-100 transition-all text-${pain.color}-500 shrink-0`}>
                                        <div className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center">
                                            {pain.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                                        {pain.title}<br />
                                        <span className={`text-[9px] sm:text-sm font-bold text-${pain.color}-500`}>（{pain.reason}）</span>
                                    </h3>
                                </div>
                                <p className="text-slate-500 text-[12px] sm:text-[13px] leading-relaxed font-medium">
                                    {pain.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Bridge Copy */}
                    <div className="mt-20 text-center max-w-3xl mx-auto">
                        <p className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                            これらの「インバウンド集客の常識」を、<br className="sm:hidden" />
                            <span className="text-indigo-600">INSIDERS.が覆します。</span>
                        </p>
                        <div className="mt-10 flex justify-center">
                            <div className="flex flex-col items-center gap-2 animate-bounce">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scroll to Solution</span>
                                <ArrowRight className="w-6 h-6 text-indigo-500 rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          3. DARK MODE SOLUTION AREA
      ========================================= */}
            <div ref={solutionRef} className="bg-[#050505] overflow-hidden py-32 border-y border-white/5 relative">
                {/* Background glow effects */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
                    <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-sm mb-10 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/30 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>THE SOLUTION: DE-COMMODITIZATION</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-10 leading-[1.2]">
                        競合と上位表示を競い合って消耗する必要はありません。<br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 leading-[1.3]">
                            なぜなら、外国人はもっと直感的に探しているから。
                        </span>
                    </h2>

                    <div className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 max-w-3xl mx-auto space-y-6">
                        <p>
                            OTA（予約サイト）の星の数や、価格の安さで競い合う「比較ゲーム」から降りましょう。今の訪日客は他店との比較ではなく、TikTokやInstagramのショート動画を見て「ここに行きたい！」と直感で行き先を決めています。
                        </p>
                        <p>
                            ボトルネックは競合との競争ではありません。彼らの「行きたいリスト」に入れるかどうかです。<br />
                            INSIDERS.を使えば、ネイティブクリエイターの動画の力でリストに入り込み、Googleマップから直接予約される「比較されない集客ルート」が実現します。
                        </p>
                    </div>

                    <div className="pt-8 flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 脱OTA依存
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> オペレーション自動化
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24時間資産型集客
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================
          5. CORE VALUES & UI MOCKUPS (The Proof & Core Narrative)
      ========================================= */}
            <section id="solution" className="py-16 sm:py-24 bg-white border-t border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-6 mt-10 sm:mt-0">
                            貴店を旅の目的地にするために。<br />
                            INSIDERS.が提供する3つの特徴
                        </h2>
                    </div>

                    <div className="space-y-28 lg:space-y-32">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 max-w-6xl mx-auto px-2 sm:px-0">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mb-4">
                                    <Database className="w-5 h-5" /> 01. THE CREATORS
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                    「ここに行きたい！」を生み出す、厳選されたクリエイター群
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-base sm:text-lg mb-8">
                                    我々が提供するのは単なるリストではありません。AIアルゴリズムをハックし、各国の旅行予約者のおすすめタブに常駐する「本物」のインバウンドクリエイターです。
                                    <br />国籍、フォロワー属性、過去の成果データに基づき、貴店と最も相性の良いクリエイターを瞬時に特定します。
                                </p>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto h-[300px] sm:h-[400px] items-center">
                                <div className="relative w-full h-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white group">
                                    <img src="/images/premium_creators.png" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">1,200+ Verified Creators</span>
                                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30">AI engine active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Value 2: THE VIRAL WAVE Re-flow */}
                        <div id="viral-wave" className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 lg:gap-14 max-w-6xl mx-auto px-6 sm:px-0">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-violet-600 font-bold text-sm mb-4">
                                    <MessageSquare className="w-5 h-5" /> 02. THE VIRAL WAVE
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                    言葉の壁を越え、お店の魅力をショート動画で世界へ発信。
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-[15px] sm:text-lg mb-8">
                                    クリエイターが見つかったら、あとは日本語でオファーを送るだけ。AIが完璧な英語に翻訳し、条件交渉もすべて自動化されます。<br />
                                    現場に負荷をかけず、あなたのお店の魅力が「ショート動画」の熱量に乗って、世界中へ拡散されます。
                                </p>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto h-[480px] sm:h-[600px] overflow-visible">
                                <div className="absolute inset-0 bg-violet-50 rounded-[2.5rem] sm:rounded-[3rem] rotate-1 sm:rotate-3 scale-105 -z-10" />
                                <div className="w-full max-w-[300px] flex items-center justify-center h-full">
                                    <div className="scale-[0.7] sm:scale-[0.85] transform-gpu">
                                        <HeroDualMockups isMiniFlow={true} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Value 3: THE LANDMARK (ASSET HUB) */}
                        <div id="landmark" className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 max-w-6xl mx-auto px-6 sm:px-0 pb-10 sm:pb-20">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                                    <LayoutGrid className="w-5 h-5" /> 03. THE LANDMARK
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                    一瞬のバズを、Googleマップ上の「世界から指名されるランドマーク」へ
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-[15px] sm:text-lg mb-8">
                                    クリエイターが作った最高の動画を、数日で流れてしまうSNSのタイムラインで終わらせません。<br />
                                    納品された動画は二次利用の権利がクリア済み。熱狂を生んだショート動画をGoogleマップにそのまま同期・埋め込むことで、あなたのお店はただの「検索される場所」から、世界中の旅行者がスマホを片手に目指してやってくる「目的地（ランドマーク）」へと完全に進化します。
                                </p>
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
                                            <span className="text-[8px] font-black text-emerald-800 uppercase tracking-widest">Secondary use license: Unlimited</span>
                                        </div>
                                        <p className="text-[7px] text-emerald-600 leading-relaxed font-bold">
                                            Googleマップ・自社サイトでの利用に追加費用なし。<br />著作権トラブルのリスクゼロ。
                                        </p>
                                    </div>

                                    {/* Video Asset thumbnails with human portraits */}
                                    <div className="flex gap-3 mb-6">
                                        {[
                                            { color: 'from-pink-500 to-rose-400', label: 'THE WAGYU experience', icon: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=40&h=40&q=80" },
                                            { color: 'from-fuchsia-500 to-indigo-400', label: 'Hidden Gem in Shibuya', icon: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=40&h=40&q=80" },
                                            { color: 'from-emerald-500 to-teal-400', label: 'A5 Beef Melt-in-mouth', icon: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80" }
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
                                                <span className="text-[8px] font-black text-slate-700">RIGHTS CLEAR</span>
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
                                                <span className="text-[8px] font-black text-slate-700">MAP SYNC</span>
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
                                            {assetStep >= 3 ? '自動同期完了：Googleマップに反映されました' : assetStep === 1 ? '動画をアップロード中...' : 'AI Agent が著作権確認と同期を自動実行中...'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          6. THE INBOUND FLYWHEEL (Linear Journey)
      ========================================= */}
            <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.05),transparent_50%)]" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mb-4 bg-indigo-50 px-4 py-1.5 rounded-full">
                        <Repeat className="w-4 h-4" /> The Inbound Flywheel
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-slate-900">
                        単発の「買い切り集客」からの脱却。<br className="hidden sm:block" />
                        インバウンド集客の「正のサイクル」
                    </h2>
                    <p className="text-slate-500 mb-20 max-w-2xl mx-auto text-lg leading-relaxed">
                        ただマップに動画を埋め込むだけではありません。これはあなたのお店を<br className="hidden sm:block" />「24時間外国人を呼び込むデジタル資産」へと進化させるための第一歩です。
                    </p>

                    <div className="relative">
                        {/* Single Horizontal Line (Centered through icons) */}
                        <div className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-rose-500/30 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
                            {[
                                {
                                    icon: <PlayCircle className="w-8 h-8" />,
                                    bg: 'bg-indigo-600',
                                    color: 'text-indigo-600',
                                    title: '1. 認知・爆発',
                                    desc: 'クリエイター動画で、まだあなたを知らない潜在層のスマホへリーチ。',
                                    badge: 'Reach'
                                },
                                {
                                    icon: <Users className="w-8 h-8" />,
                                    bg: 'bg-violet-600',
                                    color: 'text-violet-600',
                                    title: '2. 直接来店',
                                    desc: '動画を見た訪日客が、他の店と比較することなくOTAを通さず直接来店。',
                                    badge: 'Action'
                                },
                                {
                                    icon: <MapPin className="w-8 h-8" />,
                                    bg: 'bg-emerald-600',
                                    color: 'text-emerald-600',
                                    title: '3. 資産化',
                                    desc: 'Googleマップに動画が永続同期され、24時間働くセールスマンとして蓄積。',
                                    badge: 'Asset'
                                },
                                {
                                    icon: <TrendingUp className="w-8 h-8" />,
                                    bg: 'bg-rose-600',
                                    color: 'text-rose-600',
                                    title: '4. 自動流入',
                                    desc: 'マップが最適化され、広告費をかけずとも次の客が自然に集まる。',
                                    badge: 'Growth'
                                },
                            ].map((step, idx) => (
                                <div key={step.title} className="relative group">
                                    <div className="bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative z-10 flex flex-col h-full">
                                        <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center sm:gap-0">
                                            <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-[1.2rem] sm:rounded-[2rem] ${step.bg} text-white flex items-center justify-center mb-0 sm:mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                                                <div className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center">
                                                    {step.icon}
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:items-center">
                                                <div className={`text-[8px] sm:text-[10px] font-black ${step.color} tracking-[0.2em] mb-1 sm:mb-2 uppercase`}>{step.badge}</div>
                                                <h4 className="text-sm sm:text-xl font-black text-slate-900 leading-tight">{step.title}</h4>
                                            </div>
                                        </div>
                                        <p className="mt-3 sm:mt-4 text-[11px] sm:text-sm text-slate-500 leading-relaxed font-medium sm:text-center">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Final Loop Indication */}
                        <div className="mt-16 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl animate-bounce">
                                <Repeat className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className="text-sm font-black text-slate-900 tracking-widest flex items-center gap-3">
                                <div className="w-8 h-px bg-slate-200" />
                                成果がさらなる認知を呼ぶ「インバウンド資産」の完成
                                <div className="w-8 h-px bg-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          7. PRICING & SaaS TRIAL OFFER (インフラ維持費としての正当化)
      ========================================= */}
            <section id="signup" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="group bg-slate-50 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl shadow-indigo-100/50 text-center relative overflow-hidden mb-12 border border-slate-200 transition-all duration-700 hover:shadow-indigo-200/50">
                        {/* Shimmer Sweep - Light version */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(99,102,241,0.03) 45%, rgba(99,102,241,0.06) 50%, rgba(99,102,241,0.03) 55%, transparent 60%)', backgroundSize: '200% 100%', animation: 'hologramShine 3s ease infinite' }} />

                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

                        {/* Special Tag */}
                        <div className="inline-flex items-center gap-2 bg-indigo-100 border border-indigo-200 px-4 py-1.5 rounded-full mb-6">
                            <Crown className="w-4 h-4 text-amber-500" />
                            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Genesis Limited Edition</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">INSIDERS. スタンダード</h2>
                        <p className="text-slate-400 sm:text-slate-500 font-bold mb-10 text-sm sm:text-lg px-2 sm:px-0">単独集客からの解放。24時間稼働する資産インフラを、固定費で。</p>

                        <div className="flex items-end justify-center gap-1 mb-10">
                            <span className="text-5xl sm:text-7xl font-black tracking-tighter text-indigo-600">¥39,800</span>
                            <span className="text-[10px] sm:text-sm text-slate-400 font-black mb-1 sm:mb-2 tracking-widest pl-2">/ month<br className="sm:hidden" /> <span className="text-[8px] font-bold">(税抜)</span></span>
                        </div>

                        <ul className="text-left max-w-sm mx-auto space-y-5 mb-12 text-slate-600 font-bold">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <span>初期費用 ¥0 / いつでも解約可能</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <span>クリエイターアサイン 月間最大3組</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <span>AI自動翻訳・チャット代行機能</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></div>
                                <span>Googleマップ同期・ASSET HUB利用</span>
                            </li>
                        </ul>

                        {/* Trial Box - Light Glass Card */}
                        <div className="bg-white border-2 border-indigo-100 rounded-[2rem] p-8 mb-10 max-w-lg mx-auto shadow-xl shadow-indigo-100/50 group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="text-indigo-600 font-black text-sm mb-3 flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> START YOUR JOURNEY
                            </div>
                            <div className="text-slate-900 font-black text-xl mb-4 leading-tight">
                                最初のオファー成立まで<br />
                                システム利用料 <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent underline decoration-indigo-200">完全無料</span> で利用可能
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed space-y-1">
                                <span className="block italic opacity-60">※クリエイターへの経費（商品・食事提供等）のみの実費負担</span>
                                <span className="block italic opacity-60">※マッチングが成功するまでクレジットカード登録は不要です</span>
                            </p>
                        </div>

                        <Link href="/advertiser/gateway">
                            <button className="hidden sm:flex w-full sm:w-auto px-16 py-6 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-800 transition-all items-center justify-center gap-3 mx-auto active:scale-95">
                                今すぐ無料でオファーを開始する
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </Link>
                    </div>

                    {/* =========================================
                      8. UPSELL TEASER (BUZZ OVER) - Low Prominence with Hover
                  ========================================= */}
                    <div className="text-center pt-8 border-t border-slate-100 max-w-2xl mx-auto opacity-30 hover:opacity-100 transition-opacity duration-700 group">
                        <h4 className="text-xl font-black text-slate-900 mb-3 grayscale group-hover:grayscale-0 transition-all">「集客は成功した。でも、対応する時間すら惜しい…？」</h4>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed font-bold">
                            INSIDERS.で強烈なバズを生み出した後、「Googleマップの多言語更新が追いつかない」「予約の導線最適化まで手が回らない」という嬉しい悲鳴が上がったら、我々の最強BPOパッケージ『BUZZ OVER』の出番です。<br />
                            ダッシュボードすら見なくていい。AIと我々がすべてを巻き取る、究極の丸投げインフラをご用意しています。
                        </p>
                        <a href="https://buzzover.jp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm bg-indigo-50 px-4 py-2 rounded-full">
                            丸投げインフラ「BUZZ OVER」の詳細を見る <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>

                </div>
            </section>

            {/* =========================================
              9. STICKY FOOTER CTA (Mobile Conversion Trigger)
          ========================================= */}
            {/* --- Sticky Footer CTA (Mobile Only) --- */}
            <div className={`sm:hidden fixed bottom-6 left-4 right-4 z-[100] transition-all duration-500 transform ${showStickyCTA ? 'translate-y-0 opacity-100 animate-slide-up-sticky' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="max-w-md mx-auto">
                    {/* Microcopy Tooltip */}
                    <div className="flex justify-center mb-2">
                    </div>
                    {/* Main Button */}
                    <button
                        onClick={scrollToDiagnosis}
                        className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all duration-700 text-white py-4 px-6 rounded-2xl font-black text-base shadow-[0_15px_30px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3 group relative overflow-hidden active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
                        <span className="text-xl">🎁</span>
                        無料で3名にオファーする
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Simple Footer - Clearly Visible */}
            <footer className="py-12 bg-white border-t border-slate-200 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-xl font-black text-slate-900 mb-4">INSIDERS.</div>
                    <div className="text-xs text-slate-500 font-bold">
                        © 2026 nots, Inc. All rights reserved. 訪日客の目的地を、科学する。
                    </div>
                </div>
            </footer>

        </div>
    );
}