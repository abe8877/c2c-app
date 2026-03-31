"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Search, CheckCircle2, ArrowRight, Sparkles,
    MessageSquare, AlertTriangle, ArrowUpRight, Globe, MapPin,
    RefreshCw, LayoutGrid, PlayCircle, MousePointer2, Database, Send,
    Store, Smartphone, TrendingUp, Users, Repeat, Shield, Zap, Crown
} from 'lucide-react';

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
            setAssetStep((prev) => (prev >= 2 ? 0 : prev + 1));
        }, 4000);


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
          1. HERO SECTION (Core Narrative Injected)
      ========================================= */}
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-slate-50 border-b border-slate-200">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem][mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                        {/* 左：テキストエリア */}
                        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
                            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-[1.15]">
                                あなたのお店がインバウンド客の目的地になる。<br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                    ショート動画で「直予約」を生み出す集客インフラ『INSIDERS.』
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                INSIDERS.は「インバウンド専門クリエイター」に、あなたのお店のPR動画を定額でオファーし放題のプラットフォームです。独自の分析技術を用いて、実際に外国人がSNSで参考にしている「信頼できるクリエイター」だけを厳選してマッチング。動画を通じて、あなたのお店が訪日客の「行きたいリスト」に直接入り込むことができます。<br className="hidden sm:block" />
                                <br />英語ができなくても大丈夫。インバウンドクリエイターに特化したシステムが、翻訳や面倒な依頼交渉をすべて引き受けます。
                            </p>

                            <div className="flex flex-col items-center lg:items-start gap-3 w-full sm:w-auto mt-6 lg:mt-0 order-2 lg:order-none">
                                <button ref={heroCTARef} onClick={scrollToDiagnosis} className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                                    無料で3名のクリエイターにオファーする
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <span className="text-sm text-slate-400 font-bold flex items-center gap-1.5 justify-center lg:justify-start">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> クレジットカード登録不要・システム利用料¥0でトライアル
                                </span>
                            </div>
                        </div>

                        {/* 右：シズル感スマホモックアップ */}
                        <div className="flex-1 relative w-full flex justify-center lg:justify-end order-3 lg:order-none opacity-90 lg:opacity-100">
                            {/* Bleed Effect for Mobile */}
                            <div className="relative w-[280px] lg:w-[300px] h-[550px] lg:h-[600px] bg-black rounded-[3rem] border-[8px] lg:border-[10px] border-slate-900 shadow-2xl overflow-hidden shadow-indigo-500/20 flex flex-col justify-end translate-x-4 lg:translate-x-0 rotate-1 lg:rotate-0">
                                {/* TikTok Video Mockup */}
                                <img src="/images/premium_japanese_food_tiktok_1774942957236.png" className="absolute inset-0 w-full h-full object-cover scale-[1.05]" alt="TikTok Sizzle" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                {/* Comments Waterfall */}
                                <div className="relative z-10 px-4 pb-20 overflow-hidden h-40 [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none">
                                    <div className="animate-[slideUp_8s_linear_infinite] flex flex-col gap-3 opacity-90 text-[11px] text-white font-medium drop-shadow-md">
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                            <div className="font-bold shrink-0">@travel_jane</div>
                                            <div>I must go here! 😭🔥</div>
                                        </div>
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                            <div className="font-bold shrink-0">@mat_eats</div>
                                            <div>Added to my list! 🥩</div>
                                        </div>
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                            <div className="font-bold shrink-0">@tokyolover</div>
                                            <div>Wow, where is this??</div>
                                        </div>
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                            <div className="font-bold shrink-0">@alex_k</div>
                                            <div>A5 Wagyu is legendary.</div>
                                        </div>
                                        {/* Loop repeats mentally via css animation */}
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                            <div className="font-bold shrink-0">@sarah_travels</div>
                                            <div>Literally booking flights now ✈️</div>
                                        </div>
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                            <div className="font-bold shrink-0">@mike_d</div>
                                            <div>Need the location ASAP!</div>
                                        </div>
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                            <div className="font-bold shrink-0">@travel_jane</div>
                                            <div>I must go here! 😭🔥</div>
                                        </div>
                                        <div className="flex items-start gap-2 max-w-[85%]">
                                            <div className="font-bold shrink-0">@mat_eats</div>
                                            <div>Added to my list! 🥩</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Magic Popups: Saved -> Reservation */}
                                <div className="absolute bottom-6 left-3 right-3 flex flex-col gap-3 pointer-events-none z-20">
                                    {/* Google Map Saved */}
                                    <div className="animate-[bounce_4s_infinite] bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] flex items-center gap-3 border border-indigo-100">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-slate-900 leading-tight mb-0.5">Saved to "Tokyo Trip" ⭐️</div>
                                            <div className="text-[10px] font-bold text-slate-500">Google Maps</div>
                                        </div>
                                    </div>

                                    {/* New Reservation */}
                                    <div className="animate-[bounce_5s_infinite_0.5s] bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] flex items-center gap-3 border border-rose-100">
                                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                                            <TrendingUp className="w-5 h-5 text-rose-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-slate-900 leading-tight mb-0.5">予約完了 (2名) 🛎️</div>
                                            <div className="text-[10px] font-bold text-slate-500">明日 19:00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          2. PROBLEMS SECTION (RICH UI - NEON PAIN)
      ========================================= */}
            <section id="problems" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black mb-4">
                            <AlertTriangle className="w-4 h-4" />
                            <span>CRITICAL PAINS</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-slate-900 leading-tight">
                            インバウンド集客で、<br className="sm:hidden" />
                            こんな「バケツの穴」が空いていませんか？
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {/* Card 1: Effect */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-rose-50 transition-all">
                                <span className="text-2xl">👻</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight">
                                結局、来店に繋がらない<br />
                                <span className="text-sm font-bold text-rose-500">（効果の不在）</span>
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                「インフルエンサーを呼んだのに、外国人が全然来ない…」<br /><br />
                                フォロワー数の多さだけで「日本在住の外国人」に数十万のPR費用を払ってしまった。バズったとしても、フォロワーは日本人ばかりで実際の「インバウンド客の来店」には結びつかない。
                            </p>
                        </div>

                        {/* Card 2: Operations */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-50 transition-all">
                                <span className="text-2xl">💦</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight">
                                現場がパンクする<br />
                                <span className="text-sm font-bold text-amber-600">（工数の崩壊）</span>
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                「英語のDM対応や交渉で、現場のスタッフが疲弊している…」<br /><br />
                                自力で海外のインフルエンサーを探そうとしても、英語での条件交渉や日程調整に途方もない時間がかかる。レスポンスが遅れて結局チャンスを逃してしまう。
                            </p>
                        </div>

                        {/* Card 3: Profit */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-50 transition-all">
                                <span className="text-2xl">💸</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight">
                                利益を搾取される<br />
                                <span className="text-sm font-bold text-indigo-500">（金銭面の負担）</span>
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                「OTAの高い手数料で、売上は立つのに利益が残らない…」<br /><br />
                                英語メニューを作り、受け入れ態勢を整えても、結局はTripAdvisorやKlookなどのOTAに20〜30%の手数料を抜かれ続ける「横並びの比較ゲーム」から抜け出せない。
                            </p>
                        </div>
                    </div>

                    {/* Bridge Copy */}
                    <div className="mt-20 text-center max-w-3xl mx-auto">
                        <p className="text-lg md:text-xl font-black text-slate-900 mb-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                            <span>偽物への投資</span>
                            <span className="hidden md:block text-slate-300">/</span>
                            <span>英語対応の疲弊</span>
                            <span className="hidden md:block text-slate-300">/</span>
                            <span>高額な手数料</span>
                        </p>
                        <p className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                            この「インバウンド集客の常識」を、<br className="sm:hidden" />
                            <span className="text-indigo-600">INSIDERS.がすべて破壊します。</span>
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
            <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
                            貴店を旅の目的地にするために。<br />
                            INSIDERS.が提供する3つのサービス
                        </h2>
                    </div>

                    <div className="space-y-28 lg:space-y-32">
                        {/* Core Value 1: Data & List (MOAT 1) */}
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 max-w-6xl mx-auto">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mb-4">
                                    <Database className="w-5 h-5" /> 01. THE DATABASE（リスト的価値）
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                    「明日の訪日客」のスマホを覗き見るアルゴリズム解析
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-base sm:text-lg mb-8">
                                    ショート動画はAIガイドブックのようなものです。我々の技術は、フォロワー数ではなく『今まさに訪日を計画している海外旅行客のスマホ（おすすめタブ）』を解析し、実際に注目されているクリエイターだけを抽出することです。「フォロワー数が多いだけの外国人」への依頼は脱却しましょう。「ただの外国人」に騙されないでください。フォロワーが10万人いても、その中に「来月日本に来る人」が何人いるでしょうか？<br /><br />
                                    INSIDERS.のAIは、表面的なフォロワー数には依存しません。独自のスクレイピング技術により、「今まさに日本旅行を計画している海外ユーザーのおすすめタブに表示されている、本物のクリエイター」だけをリアルタイムに逆探知。だから、確実な直予約に繋がるのです。
                                </p>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto h-full items-center">
                                {/* Creator Infinite Ticker Background */}
                                <div className="absolute inset-y-0 -left-12 -right-12 overflow-hidden pointer-events-none opacity-40 ticker-no-hijack">
                                    <div className="flex gap-4 items-center animate-[ticker_20s_linear_infinite] w-max whitespace-nowrap h-full pt-10">
                                        {[
                                            { flag: '🇺🇸', label: '78% Overseas', tag: '✈️ #TokyoTravel Top 1%' },
                                            { flag: '🇬🇧', label: '85% Overseas', tag: '🍜 #JapanFood Top 3%' },
                                            { flag: '🇫🇷', label: '72% Overseas', tag: '🗾 #VisitJapan Top 2%' },
                                            { flag: '🇦🇺', label: '90% Overseas', tag: '✈️ #TokyoEats Top 1%' },
                                            { flag: '🇩🇪', label: '68% Overseas', tag: '🏯 #JapanTrip Top 5%' },
                                            { flag: '🇨🇦', label: '81% Overseas', tag: '🍣 #SushiTokyo Top 1%' },
                                        ].map((data, i) => (
                                            <div key={i} className="relative w-48 h-64 rounded-3xl overflow-hidden border-2 border-slate-100 shadow-xl opacity-80 shrink-0">
                                                <img src="/images/creator_portraits_ticker_1774942974356.png" className="w-full h-full object-cover" />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 shadow-sm">
                                                    <div className="text-[9px] font-black text-white mb-1 flex gap-1 flex-wrap">
                                                        <span className="bg-fuchsia-500 text-white px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(217,70,239,0.8)] animate-[neonPulse_2s_infinite]">{data.flag} {data.label}</span>
                                                        <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(245,158,11,0.6)]">{data.tag}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-indigo-50/80 backdrop-blur-sm rounded-[3rem] -rotate-3 scale-105 -z-10" />
                                <div>
                                    <div className="text-[10px] font-bold text-indigo-500 mb-3 uppercase tracking-widest opacity-90 drop-shadow-sm bg-indigo-50 px-3 py-1 rounded-full relative overflow-hidden group/scan">
                                        ADVERTISER UI — LIVE DEMO
                                        <div className="absolute inset-x-0 h-0.5 bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,1)] animate-[scanning_3s_linear_infinite]" />
                                    </div>
                                    <div className="relative w-full max-w-[280px] h-[580px] bg-slate-50 rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden flex flex-col group mx-auto translate-x-4 lg:translate-x-0 rotate-1 lg:rotate-0 transition-transform duration-700">
                                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-white">
                                            {/* Scrollable Container with All Steps */}
                                            <div className="h-full overflow-y-auto scrollbar-hide py-1">
                                                {/* Step 0: URL Input Header */}
                                                <div className="p-3 border-b border-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] bg-white sticky top-0 z-20">
                                                    <div className="bg-white rounded-xl p-1.5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center gap-2">
                                                        <div className="flex items-center gap-1 px-2 py-1 border-r border-slate-100 scale-90">
                                                            <span className="text-[10px]">🍱</span>
                                                            <span className="text-[9px] font-bold text-slate-800">Food</span>
                                                        </div>
                                                        <div className="flex-1 flex items-center gap-1.5 text-slate-700 font-bold">
                                                            <Search className="w-3 h-3 shrink-0 text-slate-400" />
                                                            <span className="text-[8px] truncate">yakiniku-wagyu.com</span>
                                                        </div>
                                                        <div className="text-white text-[7px] font-black px-2 py-2 rounded-lg shrink-0 scale-90 bg-indigo-600 animate-pulse">
                                                            分析中...
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Step 1: Analysis Result */}
                                                <div className="opacity-100 max-h-none overflow-hidden">
                                                    <div className="p-4 text-center border-b border-slate-100">
                                                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </div>
                                                        <h4 className="text-sm font-black text-slate-900 italic tracking-tighter mb-1">ANALYSIS COMPLETE</h4>
                                                        <p className="text-[7px] text-slate-400 mb-3">貴店の強みを定義しました</p>
                                                        <div className="flex flex-wrap justify-center gap-1 mb-3">
                                                            {['#和モダン', '#隠れ家', '#シズル感', '#A5和牛'].map(tag => (
                                                                <span key={tag} className="px-1.5 py-0.5 bg-slate-50 rounded-md border border-slate-100 text-[7px] font-bold text-slate-700">{tag}</span>
                                                            ))}
                                                        </div>
                                                        <div className="text-[8px] text-slate-400 flex items-center justify-center gap-1">
                                                            推薦クリエイター：
                                                            <span className="text-sm font-black text-slate-900 border-b-2 border-yellow-400 leading-none">24名</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Step 2: Creator Catalog */}
                                                <div className="opacity-100 max-h-none overflow-hidden">
                                                    <div className="p-3 bg-slate-50/50 border-b border-slate-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[9px] font-black text-slate-900">CREATOR CATALOG</span>
                                                            <div className="bg-yellow-400 text-[5px] font-black px-1 rounded">AI選定</div>
                                                        </div>
                                                        <div className="relative aspect-[9/14] rounded-xl overflow-hidden shadow-lg border-2 border-white">
                                                            <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=500&q=80" alt="Food Creator" className="absolute inset-0 w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10 z-10" />
                                                            <div className="absolute top-2 left-2 z-20 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-lg text-[5px] text-white font-bold uppercase">FOOD</div>
                                                            <div className="absolute top-2 right-2 z-20 flex flex-col gap-1">
                                                                <span className="bg-fuchsia-500 text-white text-[5px] font-black px-1 py-0.5 rounded shadow-[0_0_6px_rgba(217,70,239,0.6)] animate-[neonPulse_2s_infinite]">🇺🇸 82% Overseas</span>
                                                                <span className="bg-amber-500 text-white text-[5px] font-black px-1 py-0.5 rounded shadow-[0_0_6px_rgba(245,158,11,0.6)]">✈️ #TokyoEats Top 1%</span>
                                                            </div>
                                                            <div className="absolute bottom-2 left-2 z-20 text-white">
                                                                <div className="text-[10px] font-black tracking-tight">@saki_japan_eats</div>
                                                                <div className="text-[7px] font-bold opacity-80">200k followers</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Step 3: Offer Compose */}
                                                <div className="opacity-100 max-h-none overflow-hidden">
                                                    <div className="p-3">
                                                        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                                                            <div className="text-[8px] font-black text-indigo-600 mb-2 flex items-center gap-1">
                                                                <Send className="w-3 h-3" /> オファーを作成
                                                            </div>
                                                            <div className="space-y-1.5 text-[7px]">
                                                                <div className="bg-white rounded-lg px-2 py-1.5 border border-indigo-100 text-slate-700">📍 焼肉 和牛亭 渋谷店</div>
                                                                <div className="bg-white rounded-lg px-2 py-1.5 border border-indigo-100 text-slate-700">🍽️ A5和牛コース体験（2名分）</div>
                                                                <div className="bg-white rounded-lg px-2 py-1.5 border border-indigo-100 text-slate-700">📅 4月中の希望日</div>
                                                            </div>
                                                            <button className="w-full mt-2 bg-indigo-600 text-white text-[7px] font-black py-1.5 rounded-lg flex items-center justify-center gap-1">
                                                                <Sparkles className="w-2.5 h-2.5" /> AI翻訳してオファー送信
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Step 4: Offer Complete */}
                                                <div className="opacity-100 max-h-none overflow-hidden">
                                                    <div className="p-3">
                                                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
                                                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-200">
                                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="text-[10px] font-black text-emerald-700 mb-1">🎉 オファー送信完了！</div>
                                                            <p className="text-[7px] text-emerald-600 leading-relaxed">AIが英語に翻訳して送信しました。<br />チャットで返信をお待ちください。</p>
                                                            <div className="mt-2 flex gap-1 justify-center">
                                                                    <span className="bg-emerald-100 text-emerald-700 text-[6px] font-bold px-2 py-0.5 rounded-full">残り無料枠: 2/3</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Steps */}
                                        <div className="p-2 bg-white border-t border-slate-100">
                                            <div className="flex items-center justify-center gap-1">
                                                {['URL分析', 'AI解析', 'カタログ', 'オファー', '完了'].map((label, i) => (
                                                    <div key={label} className="flex items-center gap-1">
                                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[5px] font-black transition-all duration-500 bg-indigo-600 text-white scale-110`}>{i + 1}</div>
                                                        {i < 4 && <div className={`w-3 h-0.5 rounded transition-colors duration-500 bg-indigo-600`} />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Value 2: AI Chat UI (UI Value) */}
                        <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 lg:gap-14 max-w-6xl mx-auto">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-violet-600 font-bold text-sm mb-4">
                                    <MessageSquare className="w-5 h-5" /> 02. ZERO-FRICTION CHAT（UI的価値）
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                    英語力ゼロ・摩擦ゼロ。<br />すべてAI翻訳チャットで完結
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-base sm:text-lg mb-8">
                                    英語のメールやInstagramのDMは一切不要です。<br /><br />
                                    プラットフォーム内のチャットで、最新AI（Gemini）がリアルタイムに高精度な自動翻訳を実行。あなたは日本語で入力するだけ。まるで日本人とやり取りしている感覚で、日程調整から条件交渉まで現場の負担ゼロでスムーズに完結します。
                                </p>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto">
                                <div className="absolute inset-0 bg-violet-50 rounded-[3rem] rotate-3 scale-105 -z-10" />
                                <div className="w-[280px] max-w-[85%] bg-white rounded-[2rem] border-[6px] border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[520px] translate-x-6 lg:translate-x-0 -rotate-1 lg:rotate-0 transition-transform duration-700">
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <div className="text-slate-900 text-xs font-bold text-left">Sarah Jenkins</div>
                                            <div className="flex items-center gap-1 text-[8px] text-emerald-500 font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online (AI Translation)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 flex flex-col justify-end">
                                        <div className={`transition-all duration-500 ${chatStep >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                            <div className="bg-white border border-slate-200 text-slate-800 text-xs p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm text-left">
                                                Hello! Thank you for the offer. I am available next week. Can I check the menu beforehand?
                                            </div>
                                        </div>

                                        <div className={`flex justify-end transition-all duration-300 ${chatStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                                            <div className="bg-slate-200 text-slate-500 text-[8px] px-2 py-1 rounded-full flex items-center gap-1">
                                                <MousePointer2 className="w-2 h-2" /> アシスタント返信を使用
                                            </div>
                                        </div>

                                        <div className={`flex flex-col items-end w-full transition-all duration-500 ${chatStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                            <div className="bg-black text-white text-xs p-3 rounded-2xl rounded-tr-none max-w-[85%] relative shadow-[0_10px_20px_-5px_rgba(139,92,246,0.3)] text-left overflow-hidden">
                                                {/* ✨ Particle Magic Reveal */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 opacity-20 pointer-events-none animate-pulse" />

                                                <span className="relative z-10 block animate-[textSwapMagic_8s_infinite] text-transparent bg-clip-text font-medium leading-relaxed">
                                                    Hello! Thank you for the offer. I am available next week. Can I check the menu beforehand?
                                                </span>
                                                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1 text-[8px] text-fuchsia-300 font-bold relative z-10">
                                                    <Sparkles className="w-3 h-3 text-amber-300 animate-spin-slow" /> AI MAGIC TRANSLATION
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white border-t border-slate-100">
                                        <div className="text-[8px] text-slate-400 font-bold mb-2 text-left">アシスタント返信</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button className="bg-white hover:bg-slate-50 text-slate-700 text-[9px] font-bold py-2 rounded-lg border border-slate-200 transition-colors">日程候補</button>
                                            <button className="bg-white hover:bg-slate-50 text-slate-700 text-[9px] font-bold py-2 rounded-lg border border-slate-200 transition-colors">メニュー</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Value 3: ASSET HUB (MOAT 2 / 大義名分) */}
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 max-w-6xl mx-auto">
                            <div className="flex-1 lg:max-w-[480px] text-left">
                                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                                    <LayoutGrid className="w-5 h-5" /> 03. ASSET HUB（アセット的価値）
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                    高額な二次利用料は不要。<br />権利クリア済みの動画を、永続的な「道標」に。
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-base sm:text-lg mb-8">
                                    我々はクリエイターと「訪日客が迷わないための道標（ガイド）を作る」というビジョンで結ばれています。<br /><br />
                                    だからこそ、月額のシステム利用料のみで、納品された動画の「Googleマップおよび自社サイトでの無期限の二次利用許諾」が自動でクリアされます。著作権トラブルのリスクゼロで、毎月「本物の訪日客が惹かれる資産」を自社のマップに蓄積し続けることができます。
                                </p>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto">
                                <div className="absolute inset-0 bg-emerald-50 rounded-[3rem] -rotate-3 scale-105 -z-10" />
                                <div className="w-[340px] max-w-[95%] bg-white rounded-[2rem] border-[6px] border-slate-50 shadow-xl overflow-hidden p-6 -translate-x-4 lg:translate-x-0 rotate-1 lg:rotate-0 transition-transform duration-700">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 text-sm font-black text-slate-900 mb-5 pb-2 border-b border-slate-100 text-left">
                                        <LayoutGrid className="w-4 h-4 text-emerald-600" /> ASSET HUB
                                        <span className="ml-auto bg-emerald-100 text-emerald-700 text-[7px] font-bold px-2 py-0.5 rounded-full">3 ASSETS</span>
                                    </div>

                                    {/* Video Asset Cards */}
                                    <div className="flex gap-3 mb-5">
                                        {[0, 1, 2].map((idx) => (
                                            <div key={idx} className={`relative w-24 h-32 rounded-xl overflow-hidden border-2 transition-all duration-700 ${assetStep >= 1 && idx === 0 ? 'border-emerald-400 animate-[assetGlow_2s_infinite]' : 'border-slate-200'}`}>
                                                <img src="https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <PlayCircle className="w-6 h-6 text-white" />
                                                </div>
                                                {/* 権利クリア済みバッジ */}
                                                <div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5">
                                                    <Shield className="w-2.5 h-2.5 text-white" />
                                                </div>
                                                <div className="absolute bottom-1 inset-x-1">
                                                    <div className="bg-black/60 backdrop-blur-sm rounded-md px-1 py-0.5 text-center">
                                                        <div className="text-[5px] font-bold text-emerald-300">✅ 権利クリア済</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* License Info */}
                                    <div className={`bg-emerald-50 rounded-xl p-3 mb-4 border border-emerald-100 transition-all duration-700 ${assetStep >= 1 ? 'opacity-100' : 'opacity-60'}`}>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                            <span className="text-[8px] font-black text-emerald-800">二次利用許諾：無期限</span>
                                        </div>
                                        <p className="text-[7px] text-emerald-600 leading-relaxed">
                                            Googleマップ・自社サイトでの利用に追加費用なし。<br />著作権トラブルのリスクゼロ。
                                        </p>
                                    </div>

                                    {/* Sync to Maps & Web */}
                                    <div className="grid grid-cols-2 gap-3 relative z-10">
                                        <div className={`border rounded-xl p-3 text-left transition-all duration-500 ${assetStep >= 1 ? 'border-emerald-400 bg-emerald-50/30 shadow-md shadow-emerald-100' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-700 mb-2">
                                                <MapPin className="w-3 h-3 text-red-500" /> Google Maps
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                                                <div className={`h-1.5 rounded-full transition-all duration-1000 ${assetStep >= 2 ? 'bg-emerald-500 w-full' : 'bg-amber-400 w-[60%]'}`} />
                                            </div>
                                            <div className="text-[6px] text-slate-400 font-bold">{assetStep >= 2 ? '✅ 同期完了' : '🔄 同期中...'}</div>
                                        </div>

                                        <div className={`border rounded-xl p-3 text-left transition-all duration-500 ${assetStep >= 1 ? 'border-emerald-400 bg-emerald-50/30 shadow-md shadow-emerald-100' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-700 mb-2">
                                                <Globe className="w-3 h-3 text-blue-500" /> 自社サイト
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                                                <div className={`h-1.5 rounded-full transition-all duration-1000 ${assetStep >= 2 ? 'bg-emerald-500 w-full' : 'bg-amber-400 w-[60%]'}`} />
                                            </div>
                                            <div className="text-[6px] text-slate-400 font-bold">{assetStep >= 2 ? '✅ 同期完了' : '🔄 同期中...'}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-[8px] text-center text-slate-400 font-bold leading-relaxed bg-slate-50 rounded-lg p-2">
                                        💎 毎月蓄積される「道標」が<br />24時間外国人を呼び込むデジタル資産に。
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
                        {/* Horizontal Line for Desktop */}
                        <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500 opacity-20" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
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
                                    {/* Arrow for Desktop */}
                                    {idx < 3 && (
                                        <div className="hidden lg:block absolute top-[40px] -right-4 translate-x-1/2 z-20 text-slate-200">
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    )}
                                    
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative z-10 flex flex-col items-center text-center h-full">
                                        <div className={`w-20 h-20 rounded-[2rem] ${step.bg} text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-500`}>
                                            {step.icon}
                                        </div>
                                        <div className={`text-[10px] font-black ${step.color} tracking-[0.2em] mb-2 uppercase`}>{step.badge}</div>
                                        <h4 className="text-xl font-black text-slate-900 mb-4">{step.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
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

                    <div className="group bg-[#050505] rounded-[2.5rem] p-10 sm:p-14 shadow-2xl shadow-indigo-500/10 text-center relative overflow-hidden mb-12 border border-white/10 hover:border-indigo-500/40 transition-all duration-700 hover:shadow-[0_0_120px_-15px_rgba(99,102,241,0.4)]">
                        {/* Hologram Shine Sweep */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)', backgroundSize: '200% 100%', animation: 'hologramShine 3s ease infinite' }} />
                        {/* Glassmorphism Glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-transparent blur-[100px] rounded-full pointer-events-none group-hover:opacity-100 opacity-40 transition-opacity duration-700" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-violet-500/10 to-transparent blur-[80px] rounded-full pointer-events-none group-hover:opacity-80 opacity-0 transition-opacity duration-700" />

                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500 group-hover:h-1.5 transition-all duration-500" />

                        {/* VIP Badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 px-4 py-1.5 rounded-full mb-6">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Genesis Offer</span>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2">INSIDERS. スタンダード</h2>
                        <p className="text-slate-400 font-medium mb-8">単発の広告費ではなく、デジタル資産を築くための「インフラ維持費」</p>

                        <div className="flex items-end justify-center gap-2 mb-8">
                            <span className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">¥39,800</span>
                            <span className="text-lg text-slate-500 font-bold pb-2">/ 月（税抜）</span>
                        </div>

                        <ul className="text-left max-w-sm mx-auto space-y-4 mb-10 text-slate-200">
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> 初期費用ゼロ / いつでも解約可能
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> クリエイターアサイン 月間最大3組まで
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> AIコンシェルジュチャット（自動翻訳）
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> ASSET HUB（無期限の二次利用許諾・マップ連携）
                            </li>
                        </ul>

                        {/* Free Trial Box - Neon Accent */}
                        <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-2xl p-6 mb-8 max-w-lg mx-auto backdrop-blur-sm group-hover:border-indigo-400/50 transition-colors duration-500">
                            <div className="text-indigo-300 font-bold text-sm mb-2 flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> トライアルでお試しください
                            </div>
                            <div className="text-white font-black text-lg mb-2">
                                最初の3名へのオファー（招待）まで<br className="hidden sm:block" />
                                システム利用料 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse">完全無料</span> でお試しいただけます。
                            </div>
                            <p className="text-xs text-indigo-200/80 leading-relaxed mt-3 text-left">
                                ※あなたが用意するのは、クリエイターへの「体験の無償提供」だけです。<br />
                                ※マッチング・交渉成立後の本契約までクレジットカード登録は不要です。
                            </p>
                        </div>

                        <Link href="/advertiser/gateway">
                            <button className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/50 transition-all flex items-center justify-center gap-2 mx-auto group-hover:shadow-[0_20px_60px_-10px_rgba(99,102,241,0.5)]">
                                無料でクリエイター3名にオファーする
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>

                    {/* =========================================
                      8. UPSELL TEASER (BUZZ OVER)
                  ========================================= */}
                    <div className="text-center pt-8 border-t border-slate-100 max-w-2xl mx-auto">
                        <h4 className="text-xl font-black text-slate-900 mb-3">「集客は成功した。でも、対応する時間すら惜しい…？」</h4>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
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
            <div className={`fixed bottom-6 left-4 right-4 z-[100] transition-all duration-500 transform ${showStickyCTA ? 'translate-y-0 opacity-100 animate-slide-up-sticky' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="max-w-md mx-auto">
                    {/* Microcopy Tooltip */}
                    <div className="flex justify-center mb-2">
                        <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-white/20 animate-bounce relative">
                            ※クレカ登録不要
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
                        </div>
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

            {/* Simple Footer */}
            <footer className="py-12 bg-slate-50 border-t border-slate-200 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-xl font-black text-slate-900 mb-4 opacity-50">INSIDERS.</div>
                    <div className="text-xs text-slate-400 font-medium">
                        © 2026 nots, Inc. All rights reserved. 訪日客の目的地を、科学する。
                    </div>
                </div>
            </footer>

        </div>
    );
}