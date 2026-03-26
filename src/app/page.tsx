"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Search, CheckCircle2, ArrowRight, Sparkles,
    MessageSquare, AlertTriangle, ArrowUpRight, Globe, MapPin,
    RefreshCw, LayoutGrid, PlayCircle, MousePointer2, Database, Send,
    Store, Smartphone
} from 'lucide-react';

export default function InsidersLP() {
    // --- State & Refs for GTM Hacks ---
    const [selectedType, setSelectedType] = useState<'A' | 'B' | null>(null); // 'A' | 'B' | null
    const solutionRef = useRef<HTMLDivElement>(null);

    // --- Animation States for Mocks ---
    const [chatStep, setChatStep] = useState(0);
    const [assetStep, setAssetStep] = useState(0);

    useEffect(() => {
        // Chat Animation Loop
        const chatInterval = setInterval(() => {
            setChatStep((prev) => (prev >= 3 ? 0 : prev + 1));
        }, 3000);

        // Asset Drag & Drop Animation Loop
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
        // 少し遅らせてスムーススクロール（UIの魔法を演出）
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
        "url": "https://insiders-hub.jp/invite",
        "description": "OTAの搾取と英語DMの疲弊を終わらせる。本物の訪日クリエイターと繋がり、バズを永続的な直予約アセットに変えるインフラ。",
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
          1. HERO SECTION (Challenger Copy)
      ========================================= */}
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem][mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold mb-8 shadow-sm">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span>特別招待コードをお持ちの方限定ページ</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.15]">
                        「OTAの高い手数料」も、「英語DMの疲弊」も、今日で終わる。<br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                            訪日客の直感（ショート動画）を、直予約に変える最強のインフラ。
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl">
                        URLを入れるだけで、AIが「本物の訪日クリエイター」とマッチング。<br />
                        システム利用料（月額39,800円）は<strong>【完全無料】</strong>。<br className="hidden sm:block" />
                        代理店の中抜きはゼロ。あなたが用意するのは、クリエイターへの「最高のおもてなし（体験の無償提供）」だけです。
                    </p>

                    <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                        <button onClick={scrollToDiagnosis} className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group">
                            自店舗のURLを入れて、完全無料でAIマッチングを試す
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <span className="text-sm text-slate-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> クレジットカード登録不要・初期費用¥0
                        </span>
                    </div>
                </div>
            </section>

            {/* =========================================
          2. SELF-QUALIFICATION (A or B Diagnosis)
      ========================================= */}
            <section id="diagnosis" className="py-20 bg-slate-50 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-slate-900">
                            あなたは今、インバウンド集客におけるどちらの「壁」にぶつかっていますか？
                        </h2>
                        <p className="text-slate-500 font-medium">当てはまる方をクリックしてください。</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Button A */}
                        <button
                            onClick={() => handleSelectType('A')}
                            className={`p-8 rounded-3xl border-2 text-left transition-all duration-300 group ${selectedType === 'A' ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.02]' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
                        >
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                                <Store className={`w-7 h-7 ${selectedType === 'A' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight">
                                インバウンド受け入れ態勢はあるが、<br />海外に知られていない
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                英語メニューもある。サービスには自信がある。でも、 결국OTA（予約サイト）に高い手数料を払って載せるしか集客方法がない…。
                            </p>
                        </button>

                        {/* Button B */}
                        <button
                            onClick={() => handleSelectType('B')}
                            className={`p-8 rounded-3xl border-2 text-left transition-all duration-300 group ${selectedType === 'B' ? 'bg-white border-violet-600 shadow-xl shadow-violet-100 scale-[1.02]' : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-md'}`}
                        >
                            <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6">
                                <Smartphone className={`w-7 h-7 ${selectedType === 'B' ? 'text-violet-600' : 'text-violet-400'}`} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight">
                                SNS集客のプロだが、<br />海外向けのやり方・英語対応が分からない
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                日本人の集客はやり尽くした。単価の高い外国人を呼びたいが、海外インフルエンサーの探し方も、英語DMを返す余裕も現場にはない…。
                            </p>
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
                                <CheckCircle2 className="w-4 h-4" /> あなたへの最適解：脱OTA × アセット構築
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                                準備は完璧なのに、OTA（予約サイト）に<br className="hidden sm:block" />20〜30%の利益を搾取されていませんか？
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                                これからの訪日旅行者は、OTAの横並び比較を見ません。彼らはInstagramやTikTokのショート動画で直感で決め、Googleマップから直接予約します。<br /><br />
                                INSIDERS.を使えば、本物のクリエイターが作る高品質な動画を無期限で二次利用可能（アセット的価値）。Googleマップに動画を同期させ、OTAを通さない「手数料0%の直予約ルート」が完成します。
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
          5. CORE VALUES & UI MOCKUPS (The Proof)
      ========================================= */}
            <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
                            インバウンド集客のすべてを、このプラットフォームに。<br />
                            INSIDERS.が提供する「3つの圧倒的価値」
                        </h2>
                    </div>

                    <div className="space-y-32">
                        {/* Core Value 1: Data & List (Scroll UI) */}
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                            <div className="flex-1 lg:max-w-xl text-left">
                                <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mb-4">
                                    <Database className="w-5 h-5" /> 01. THE DATABASE（リスト的価値）
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">「偽物」は排除。<br />本物の訪日クリエイター網</h3>
                                <p className="text-slate-500 leading-relaxed text-base sm:text-lg mb-8">
                                    「外国人フォロワーのいない日本在住インフルエンサー」に騙されるのは終わりにしましょう。我々は独自のスクレイピングとAIで、海外向けの発信力を持つ本物だけを厳選しています。<br /><br />
                                    貴店のURLを入力するだけで、AIがお店の強み（Vibe）を解析し、最も刺さるクリエイターを自動推薦します。
                                </p>
                            </div>

                            <div className="flex-1 relative flex justify-center w-full lg:w-auto">
                                <div className="absolute inset-0 bg-indigo-50 rounded-[3rem] -rotate-3 scale-105 -z-10" />
                                {/* ADVERTISER UI: Scrollable Mockup */}
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

                        {/* Core Value 2: AI Chat UI (Animated) */}
                        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-16">
                            <div className="flex-1 lg:max-w-xl text-left">
                                <div className="inline-flex items-center gap-2 text-violet-600 font-bold text-sm mb-4">
                                    <MessageSquare className="w-5 h-5" /> 02. ZERO-FRICTION CHAT（UI的価値）
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">英語力ゼロ・摩擦ゼロ。<br />すべてAI翻訳チャットで完結</h3>
                                <p className="text-slate-500 leading-relaxed text-base sm:text-lg mb-8">
                                    英語のメールやInstagramのDMは一切不要です。<br /><br />
                                    プラットフォーム内のチャットで、最新AI（Gemini）がリアルタイムに高精度な自動翻訳を実行。あなたは日本語で入力するだけ。まるで日本人とやり取りしている感覚で、日程調整から条件交渉までスムーズに完結します。
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

                        {/* Core Value 3: ASSET HUB (Drag & Drop Mock) */}
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                            <div className="flex-1 lg:max-w-xl text-left">
                                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                                    <LayoutGrid className="w-5 h-5" /> 03. ASSET HUB（アセット的価値）
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">バズを「永続的な資産」へ。<br />マップ連動で直予約を最大化</h3>
                                <p className="text-slate-500 leading-relaxed text-base sm:text-lg mb-8">
                                    一般的なインフルエンサー施策は「投稿して終わり（二次利用不可）」です。<br /><br />
                                    INSIDERS.なら、マッチング成立時点で動画の無期限・無償での二次利用許諾を自動取得。納品された動画をGoogleマップや自社サイトに同期し、OTAを通さない「永続的な直予約ルート」を構築します。
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
          6. PRICING & THE GENESIS OFFER (Skin in the game)
      ========================================= */}
            <section id="signup" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="bg-slate-900 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl text-center relative overflow-hidden mb-12">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-yellow-400 to-amber-600" />
                        <div className="inline-flex items-center justify-center gap-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
                            <Sparkles className="w-4 h-4" /> 3枠限定・特別招待コード適用中
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">The Genesis Offer</h2>
                        <p className="text-slate-400 font-medium mb-8">システム利用料・仲介手数料が「完全無料」の特別招待</p>

                        <div className="flex flex-col items-center justify-center gap-2 mb-8 bg-black/30 p-6 rounded-2xl border border-white/10 max-w-md mx-auto">
                            <div className="flex items-center gap-4 text-slate-400 line-through decoration-red-500/50 decoration-2">
                                <span>システム利用料</span>
                                <span>¥39,800/月</span>
                            </div>
                            <div className="flex items-end gap-2 text-white">
                                <span className="text-xl font-bold pb-2">永久免除</span>
                                <span className="text-6xl font-black tracking-tighter text-yellow-400">¥0</span>
                            </div>
                            <div className="text-sm text-slate-300 font-bold mt-2">マッチング・仲介手数料も ¥0</div>
                        </div>

                        <div className="text-left max-w-md mx-auto mb-10 bg-white rounded-2xl p-6 text-slate-900">
                            <h4 className="font-black text-center mb-4 text-lg border-b border-slate-100 pb-4">【お客様にご負担いただくもの】</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-sm font-bold">クリエイターへの「体験の無償提供」<br /><span className="text-xs text-slate-500 font-normal">（Barter: お食事、宿泊、施術など）</span></span>
                                </li>
                                <li className="flex items-start gap-2 opacity-60">
                                    <CheckCircle2 className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                                    <span className="text-xs font-medium">※さらに強力なトップ層を呼びたい場合は、任意の「特別現金報酬」を上乗せ設定することも可能です。</span>
                                </li>
                            </ul>
                        </div>

                        <Link href="/advertiser/gateway">
                            <button className="w-full sm:w-auto px-12 py-5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-2xl font-black text-lg shadow-xl shadow-yellow-900/20 transition-all flex items-center justify-center gap-2 mx-auto">
                                今すぐ、無料枠を使ってクリエイターを招待する
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>

                    {/* =========================================
                      7. UPSELL TEASER (BUZZ OVER)
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