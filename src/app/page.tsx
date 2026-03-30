"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Search, CheckCircle2, ArrowRight, Sparkles,
    MessageSquare, AlertTriangle, ArrowUpRight, Globe, MapPin,
    RefreshCw, LayoutGrid, PlayCircle, MousePointer2, Database, Send,
    Store, Smartphone, TrendingUp, Users, Repeat
} from 'lucide-react';

export default function InsidersLP() {
    // --- State & Refs for GTM Hacks ---
    const [selectedType, setSelectedType] = useState<'A' | 'B' | null>(null);
    const solutionRef = useRef<HTMLDivElement>(null);

    // --- Animation States for Mocks ---
    const [chatStep, setChatStep] = useState(0);
    const [assetStep, setAssetStep] = useState(0);

    useEffect(() => {
        const chatInterval = setInterval(() => {
            setChatStep((prev) => (prev >= 3 ? 0 : prev + 1));
        }, 3000);

        const assetInterval = setInterval(() => {
            setAssetStep((prev) => (prev >= 2 ? 0 : prev + 1));
        }, 4000);

        return () => {
            clearInterval(chatInterval);
            clearInterval(assetInterval);
        };
    }, []);

    // --- Handlers ---
    const handleSelectType = (type: 'A' | 'B') => {
        setSelectedType(type);
        setTimeout(() => {
            solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    };

    const scrollToDiagnosis = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById('diagnosis')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem][mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    {/* Updated Label */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold mb-8 shadow-sm">
                        <RefreshCw className="w-4 h-4 text-indigo-500" />
                        <span>ショート動画での直感を直予約に変えるインフラ</span>
                    </div>

                    <h1 className="text-4xl sm:text-4xl lg:text-4xl font-black tracking-tight text-slate-900 mb-6 leading-[1.15]">
                        あなたのお店を訪日客の目的地に。<br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                            インバウンド集客なら、『INSIDERS.』
                        </span>
                    </h1>

                    {/* Updated Core Narrative Subcopy */}
                    <p className="text-base sm:text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                        INSIDERS.はインバウンドクリエイター特化型プラットフォームです。<br />独自の分析技術を用い、旅マエ・旅ナカの外国人のSNSに表示されているクリエイターを厳選。だから、今まさにSNSを見ながら「行きたいリスト」をつくっている外国人に貴店を知ってもらえる。<br className="hidden sm:block" />
                        <br />英語ができなくても大丈夫。インバウンドクリエイターに特化したシステムが、翻訳や面倒な依頼交渉をすべて引き受けます。<br className="hidden sm:block" />
                        <br />まずは、その威力を「初回3名への無料オファー」でお試しください。
                    </p>

                    <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                        <button onClick={scrollToDiagnosis} className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group">
                            無料で3名のクリエイターにオファーする
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <span className="text-sm text-slate-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> クレジットカード登録不要・システム利用料¥0でトライアル
                        </span>
                    </div>
                </div>
            </section>

            {/* =========================================
          2. SELF-QUALIFICATION (A or B Diagnosis - RICH UI)
      ========================================= */}
            <section id="diagnosis" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-slate-900">
                            あなたは今、インバウンド集客における<br className="sm:hidden" />どちらの「壁」にぶつかっていますか？
                        </h2>
                        <p className="text-slate-500 font-medium text-sm md:text-base">当てはまる方をクリックしてください。</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
                        {/* Button A: Store / 脱OTA */}
                        <button
                            onClick={() => handleSelectType('A')}
                            className={`relative p-8 lg:p-10 rounded-[2.5rem] text-left transition-all duration-500 overflow-hidden group ${selectedType === 'A' ? 'bg-white border-2 border-indigo-600 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)] scale-[1.02]' : 'bg-white/80 border-2 border-transparent hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:-translate-y-1 shadow-sm'}`}
                        >
                            <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl transition-all duration-700 ${selectedType === 'A' ? 'opacity-100 scale-150' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100'}`} />

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 relative z-10 ${selectedType === 'A' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100'}`}>
                                <Store className="w-7 h-7" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-[1.35rem] font-black text-slate-900 mb-4 leading-snug">
                                    インバウンド受け入れ態勢はあるが、海外に知られていない
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    英語メニューもある。サービスには自信がある。でも、結局OTA（予約サイト）に高い手数料を払って載せるしか集客方法がない…。
                                </p>
                            </div>
                        </button>

                        {/* Button B: Smartphone / 摩擦ゼロ */}
                        <button
                            onClick={() => handleSelectType('B')}
                            className={`relative p-8 lg:p-10 rounded-[2.5rem] text-left transition-all duration-500 overflow-hidden group ${selectedType === 'B' ? 'bg-white border-2 border-violet-600 shadow-[0_20px_40px_-15px_rgba(124,58,237,0.2)] scale-[1.02]' : 'bg-white/80 border-2 border-transparent hover:border-violet-200 hover:bg-white hover:shadow-xl hover:-translate-y-1 shadow-sm'}`}
                        >
                            <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl transition-all duration-700 ${selectedType === 'B' ? 'opacity-100 scale-150' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100'}`} />

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 relative z-10 ${selectedType === 'B' ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-violet-50 text-violet-500 group-hover:bg-violet-100'}`}>
                                <Smartphone className="w-7 h-7" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-[1.35rem] font-black text-slate-900 mb-4 leading-snug">
                                    すでにSNS運用には力を入れているが、海外向けはハードルが高い
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    日本人の集客チャネルは確立し、内製もしている。単価の高い外国人客を集客したいが、探すのが面倒だし、英語で依頼オペレーションを回す余裕がない…。
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* =========================================
          3 & 4. DYNAMIC SOLUTION (Fade-in based on selection)
      ========================================= */}
            <div ref={solutionRef} className="bg-slate-900 overflow-hidden transition-all duration-700">
                {selectedType === 'A' && (
                    <section className="py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                            <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-sm mb-6 bg-indigo-900/50 px-4 py-1.5 rounded-full border border-indigo-500/30">
                                <CheckCircle2 className="w-4 h-4" /> あなたへの最適解：脱OTA × 行きたいリスト入り
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                                競合と上位表示を競い合って消耗する必要はありません。<br className="hidden sm:block" />なぜなら、外国人はもっと直感的に探しているから。
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                                OTA（予約サイト）の星の数や、価格の安さで競い合う「比較ゲーム」から降りましょう。今の訪日客は他店との比較ではなく、TikTokやInstagramのショート動画を見て「ここに行きたい！」と直感で行き先を決めています。<br /><br />
                                ボトルネックは競合との競争ではありません。彼らの「行きたいリスト」に入れるかどうかです。
                                INSIDERS.を使えば、ネイティブクリエイターの動画の力でリストに入り込み、Googleマップから直接予約される「比較されない集客ルート」が実現します。
                            </p>
                        </div>
                    </section>
                )}

                {selectedType === 'B' && (
                    <section className="py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                            <div className="inline-flex items-center gap-2 text-violet-400 font-bold text-sm mb-6 bg-violet-900/50 px-4 py-1.5 rounded-full border border-violet-500/30">
                                <CheckCircle2 className="w-4 h-4" /> あなたへの最適解：摩擦ゼロ × オペレーション革命
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                                日本人向けのSNS集客はもう限界。<br className="hidden sm:block" />でも、「英語の壁」で現場をパンクさせたくないですよね？
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                                海外のインフルエンサーを探す手間、時差のある英語でのDM交渉…。単価の高い訪日客を呼びたいだけなのに、現場スタッフを疲弊させては本末転倒です。<br /><br />
                                INSIDERS.なら、自店舗のURLを入れるだけでAIが最適なクリエイターを自動推薦。交渉から日程調整まで、すべて「AI自動翻訳チャット（UI的価値）」で完結。あなたは日本語でチャットするだけです。
                            </p>
                        </div>
                    </section>
                )}
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

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto">
                                <div className="absolute inset-0 bg-indigo-50 rounded-[3rem] -rotate-3 scale-105 -z-10" />
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] font-bold text-indigo-500 mb-3 uppercase tracking-widest opacity-90">ADVERTISER UI</div>
                                    <div className="relative w-[280px] h-[580px] bg-slate-50 rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden flex flex-col group">
                                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-white">
                                            {/* UI Header */}
                                            <div className="p-3 border-b border-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] bg-white sticky top-0 z-20">
                                                <div className="bg-white rounded-xl p-1.5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center gap-2">
                                                    <div className="flex items-center gap-1 px-2 py-1 border-r border-slate-100 scale-90">
                                                        <span className="text-[10px]">🍱</span>
                                                        <span className="text-[9px] font-bold text-slate-800">Food</span>
                                                    </div>
                                                    <div className="flex-1 flex items-center gap-1.5 text-slate-400">
                                                        <Search className="w-3 h-3 shrink-0" />
                                                        <span className="text-[8px] truncate">URLを入力して...</span>
                                                    </div>
                                                    <div className="bg-black text-white text-[7px] font-black px-2 py-2 rounded-lg shrink-0 scale-90">
                                                        分析 ✨
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Analysis Result */}
                                            <div className="p-5 text-center border-b border-slate-100">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-emerald-50 text-emerald-600">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <h4 className="text-lg font-black text-slate-900 italic tracking-tighter mb-2">ANALYSIS COMPLETE</h4>
                                                <p className="text-[8px] text-slate-400 mb-5 leading-tight">分析の結果、貴店の強みは<br />以下のように定義されました。</p>

                                                <div className="flex flex-wrap justify-center gap-1 mb-6">
                                                    {['#和モダン', '#隠れ家', '#自然光', '#シズル感', '#行列のできる店'].map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[8px] font-bold text-slate-700 shadow-sm">{tag}</span>
                                                    ))}
                                                </div>

                                                <div className="text-[9px] text-slate-400 mb-4 flex items-center justify-center gap-1.5">
                                                    推薦クリエイター：
                                                    <span className="text-lg font-black text-slate-900 border-b-2 border-yellow-400 leading-none">24名</span>
                                                </div>
                                            </div>
                                            {/* Creator Catalog */}
                                            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-slate-900">CREATOR CATALOG</span>
                                                        <div className="bg-yellow-400 text-[6px] font-black px-1 rounded uppercase tracking-tighter">AI選定</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden group/card shadow-xl border-2 border-white">
                                                        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=500&q=80" alt="Food Creator" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10 z-10" />
                                                        <div className="absolute top-2 left-2 z-20 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-lg text-[6px] text-white font-bold uppercase">FOOD</div>
                                                        <div className="absolute bottom-3 left-3 z-20 text-white">
                                                            <div className="text-xs font-black tracking-tight mb-0.5">@saki_japan</div>
                                                            <div className="text-[8px] font-bold opacity-80">200k followers</div>
                                                        </div>
                                                    </div>
                                                </div>
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
                                <div className="w-[280px] bg-white rounded-[2rem] border-[6px] border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[520px]">
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
                                            <div className="bg-black text-white text-xs p-3 rounded-2xl rounded-tr-none max-w-[85%] relative shadow-md text-left">
                                                Regarding the content: Please include our signature 'Matcha Parfait' and the interior vibe.
                                                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1 text-[8px] text-white/60 font-bold">
                                                    <Sparkles className="w-2 h-2" /> NOTS Translated
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
                                <div className="w-[340px] bg-white rounded-[2rem] border-[6px] border-slate-50 shadow-xl overflow-hidden p-6">
                                    <div className="flex items-center gap-2 text-sm font-black text-slate-900 mb-6 pb-2 border-b border-slate-100 text-left">
                                        <RefreshCw className="w-4 h-4 text-emerald-600" /> コンテンツの集客資産化
                                    </div>

                                    {/* Fake Video Asset */}
                                    <div className="mb-6 flex flex-col items-start">
                                        <div className="text-[9px] font-bold text-slate-500 mb-3 uppercase tracking-widest">獲得した動画 (ASSET)</div>
                                        <div className={`relative w-28 h-40 rounded-xl overflow-hidden border border-slate-200 transition-all duration-700 z-20 ${assetStep === 1 ? 'translate-x-32 translate-y-16 scale-50 opacity-50' : assetStep === 2 ? 'opacity-0' : 'translate-x-0 opacity-100'}`}>
                                            <img src="https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <PlayCircle className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sync Destinations */}
                                    <div className="grid grid-cols-2 gap-4 relative z-10">
                                        <div className={`border rounded-xl p-4 text-left transition-colors duration-500 ${assetStep >= 1 ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-700 mb-2">
                                                <MapPin className="w-3 h-3 text-red-500" /> Google Maps Sync
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 text-left">
                                                <div className={`h-1.5 rounded-full transition-all duration-1000 ${assetStep >= 2 ? 'bg-emerald-500 w-full' : 'bg-amber-400 w-[60%]'}`} />
                                            </div>
                                        </div>

                                        <div className={`border rounded-xl p-4 text-left transition-colors duration-500 ${assetStep >= 1 ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-700 mb-2">
                                                <Globe className="w-3 h-3 text-blue-500" /> Web Widget
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 text-left">
                                                <div className={`h-1.5 rounded-full transition-all duration-1000 ${assetStep >= 2 ? 'bg-emerald-500 w-full' : 'bg-amber-400 w-[60%]'}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-[9px] text-center text-slate-400 font-bold leading-relaxed">
                                        動画を同期して、貴店のデジタル接点を<br />自動でインバウンド仕様にアップデート。
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* =========================================
          6. THE INBOUND FLYWHEEL (正のサイクルの可視化)
      ========================================= */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 text-rose-500 font-bold text-sm mb-4 bg-rose-50 px-4 py-1.5 rounded-full">
                        <Repeat className="w-4 h-4" /> The Inbound Flywheel
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-slate-900">
                        単発の「買い切り集客」からの脱却。<br className="hidden sm:block" />
                        インバウンド集客の「正のサイクル」
                    </h2>
                    <p className="text-slate-500 mb-16 max-w-2xl mx-auto text-lg">
                        ただマップに動画を埋め込むだけではありません。これはあなたのお店を「24時間外国人を呼び込むデジタル資産」へと進化させるための第一歩です。
                    </p>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line for Desktop */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-200 via-emerald-200 to-rose-200 z-0" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-indigo-50 flex items-center justify-center mb-6">
                                <PlayCircle className="w-10 h-10 text-indigo-500" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-2">1. 認知・爆発</h4>
                            <p className="text-sm text-slate-500">本物のクリエイターの動画で、海外の潜在層のスマホに強烈にリーチします。</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-violet-50 flex items-center justify-center mb-6">
                                <Users className="w-10 h-10 text-violet-500" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-2">2. 直予約・来店</h4>
                            <p className="text-sm text-slate-500">動画を見たZ世代が、OTAを通さずに直感で来店・予約に繋がります。</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-emerald-50 flex items-center justify-center mb-6">
                                <MapPin className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-2">3. 動画の資産化</h4>
                            <p className="text-sm text-slate-500">権利クリア済の動画をGoogleマップに同期し、お店の道標をアップデート。</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-rose-50 flex items-center justify-center mb-6">
                                <TrendingUp className="w-10 h-10 text-rose-500" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-2">4. 永続的な自然流入</h4>
                            <p className="text-sm text-slate-500">マップが「インバウンド仕様」になることで、次の訪日客が自然に集まり続けます。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          7. PRICING & SaaS TRIAL OFFER (インフラ維持費としての正当化)
      ========================================= */}
            <section id="signup" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl text-center relative overflow-hidden mb-12">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />

                        <h2 className="text-3xl font-black text-white mb-2">INSIDERS. スタンダード</h2>
                        <p className="text-slate-400 font-medium mb-8">単発の広告費ではなく、デジタル資産を築くための「インフラ維持費」</p>

                        <div className="flex items-end justify-center gap-2 mb-8">
                            <span className="text-6xl font-black tracking-tighter text-white">¥39,800</span>
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

                        {/* Free Trial Box */}
                        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-6 mb-8 max-w-lg mx-auto">
                            <div className="text-indigo-300 font-bold text-sm mb-2 flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" /> トライアルでお試しください
                            </div>
                            <div className="text-white font-black text-lg mb-2">
                                最初の3名へのオファー（招待）まで<br className="hidden sm:block" />
                                システム利用料 <span className="text-yellow-400">完全無料</span> でお試しいただけます。
                            </div>
                            <p className="text-xs text-indigo-200/80 leading-relaxed mt-3 text-left">
                                ※あなたが用意するのは、クリエイターへの「体験の無償提供」だけです。<br />
                                ※マッチング・交渉成立後の本契約までクレジットカード登録は不要です。
                            </p>
                        </div>

                        <Link href="/advertiser/gateway">
                            <button className="w-full sm:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/50 transition-all flex items-center justify-center gap-2 mx-auto">
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

        </div>
    );
}