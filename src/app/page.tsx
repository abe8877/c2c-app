"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search, CheckCircle2, ArrowRight, Sparkles,
    MessageSquare, AlertTriangle, ArrowUpRight, Globe, MapPin,
    RefreshCw, LayoutGrid, PlayCircle, MousePointer2, Database, Send
} from 'lucide-react';

export default function InsidersLP() {
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "INSIDERS.",
        "url": "https://insiders-hub.jp",
        "description": "インバウンド集客に特化した、S/Aランククリエイター限定の招待制マッチングプラットフォーム。AIによるVIBE解析で、ブランドに最適なクリエイターを自動選定します。",
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
          1. HERO SECTION
      ========================================= */}
            <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem][mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold mb-8">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <span>インバウンド専門クリエイター・マッチングプラットフォーム</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.15]">
                        市場に眠る「本物」と出会い、<br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                            熱狂を資産に変える。
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl">
                        「フォロワー数だけの外国人インフルエンサー」に騙されるのは終わりにしませんか。<br />
                        お店のURLを入れるだけで、AIが海外の訪日予定層に本当に刺さるクリエイターを自動推薦。交渉から資産化まで、スマホひとつで完結するインバウンド集客の新しいインフラです。
                    </p>

                    <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                        <a href="#signup" className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group">
                            無料で3名のクリエイターにオファーする
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <span className="text-sm text-slate-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> クレジットカード登録不要・初期費用¥0
                        </span>
                    </div>
                </div>
            </section>

            {/* =========================================
          2. PARADIGM SHIFT (旅ナカ教育)
      ========================================= */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="text-indigo-400 text-xs font-black tracking-widest mb-4 uppercase">New Inbound Motivation</div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                        スマホの中の「AIガイド」に載っていないお店は、<br className="hidden sm:block" />
                        地図から消えているのと同じです。
                    </h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        今のインバウンド客は、旅行中（旅ナカ）にTikTokやリールを開き、「明日のランチ」「今夜行くバー」「明日行ける体験」を直感で決めています。
                        古いガイドブックや検索サイトに頼る時代は終わりました。彼らの“旅ナカ行動”はすべて、スマホの中のショート動画というAIガイドによって支配されています。
                    </p>
                </div>
            </section>

            {/* =========================================
          3. PROBLEM SECTION (スムーズなブリッジ)
      ========================================= */}
            <section className="py-24 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 text-rose-500 font-bold text-sm mb-4 bg-rose-50 px-4 py-1.5 rounded-full">
                            <AlertTriangle className="w-4 h-4" /> The Structural Flaw
                        </div>
                        {/* ★接着剤となるコピー★ */}
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                            「じゃあ、外国人インフルエンサーを呼ぼう！」<br />
                            ……その考えは危険です。
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            動画が必須だからといって、適当な「日本在住の外国人」に数十万払っても外国人は来店しません。なぜなら彼らのフォロワーの多くは日本人だからです。自力で「海外の訪日予定層」に刺さる動画集客をやろうとすると、3つの壁にぶつかります。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-2xl border border-slate-100">🤔</div>
                            <h3 className="text-lg font-black text-slate-900 mb-3">「偽物の数字」に騙される</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                外国人なら誰でもいいわけではありません。「海外の訪日予定層」を本当に動かせる”本物のインサイダー（日本人含む）”を、自力で探し出すことは不可能です。
                            </p>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-2xl border border-slate-100">💬</div>
                            <h3 className="text-lg font-black text-slate-900 mb-3">英語のDMにビビって放置</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                良さそうなクリエイターを見つけても、英語での報酬交渉や条件のすり合わせに尻込みしてしまい、結局声をかけられずにチャンスを逃していませんか？
                            </p>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-2xl border border-slate-100">💸</div>
                            <h3 className="text-lg font-black text-slate-900 mb-3">「単発のお祭り」で予算が尽きる</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                キャスティング会社に依頼すると、中抜きのマージンを取られ1回で20〜30万円。単発のお祭りで終わってしまい、コンスタントに外国人を呼ぶインフラにはなりません。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          4. CORE VALUES & UI MOCKUPS (ソリューション)
      ========================================= */}
            <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
                            市場から見落とされた「本物」を集約。<br />
                            だから、安く、高確率でマッチングする。
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            INSIDERS.は単なるマッチングアプリではありません。3つのコアバリューによって、貴店のインバウンド集客を「資産」へと変えるテクノロジー基盤です。
                        </p>
                    </div>

                    <div className="space-y-32">

                        {/* Core Value 1: Data & List (Scroll UI) */}
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                            <div className="mb-10 w-full">
                                <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mb-4">
                                    <Database className="w-5 h-5" /> 01. THE DATABASE
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">独自のスクレイピング技術による<br />「本物」のクリエイター網</h3>
                                <p className="text-slate-500 leading-relaxed mb-12">
                                    日本の広告主が見落としている、「本当に海外の旅行予定層を動かせる」国内外の優秀なクリエイターを、AIで独自にスコアリングしデータベース化。<br /><br />
                                    貴店のURLを入力するだけで、AIがお店の強み（Vibe）を解析し、最も高いエンゲージメント（予約）を生み出すクリエイターを自動推薦します。
                                </p>
                            </div>

                            <div className="relative flex justify-center w-full">
                                <div className="absolute inset-0 bg-indigo-50 rounded-[3rem] -rotate-3 scale-105 -z-10" />

                                {/* ADVERTISER UI: Scrollable Mockup */}
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] font-bold text-indigo-500 mb-3 uppercase tracking-widest opacity-90">ADVERTISER UI</div>
                                    <div className="relative w-[280px] h-[580px] bg-slate-50 rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden flex flex-col group">
                                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-white">
                                            {/* (Rest of Mockup UI remains same) */}
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

                                                <div className="w-full py-2.5 bg-black text-white rounded-full text-[9px] font-bold flex items-center justify-center gap-2 shadow-lg scale-95">
                                                    マッチング候補を見る <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>

                                            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-slate-900">CREATOR CATALOG</span>
                                                        <div className="bg-yellow-400 text-[6px] font-black px-1 rounded uppercase tracking-tighter">AI選定</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide">
                                                    {['All', '🍱 Food', '💄 Beauty'].map((cat, i) => (
                                                        <div key={cat} className={`px-3 py-1 rounded-full text-[8px] font-bold whitespace-nowrap shadow-sm border ${i === 1 ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-100'}`}>
                                                            {cat}
                                                        </div>
                                                    ))}
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

                                            <div className="p-5 bg-white space-y-4 border-b border-slate-50">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-[8px] text-yellow-600 font-bold mb-0.5 flex items-center gap-1"><Sparkles className="w-2 h-2" /> オファー作成</div>
                                                        <h5 className="text-[10px] font-black text-slate-900 uppercase">saki_japanさんを招待</h5>
                                                    </div>
                                                    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-bold">×</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">🎁 提供プラン</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="p-3 rounded-xl bg-white border-2 border-slate-900 relative">
                                                            <div className="text-[9px] font-black mb-0.5">食事のみ</div>
                                                            <div className="text-[6px] text-slate-400 leading-tight">商品提供のみ</div>
                                                            <div className="absolute top-1.5 right-1.5 flex items-center justify-center w-3 h-3 bg-slate-900 rounded-full"><CheckCircle2 className="w-2 h-2 text-white" /></div>
                                                        </div>
                                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-50 opacity-60">
                                                            <div className="text-[9px] font-bold mb-0.5">報酬あり</div>
                                                            <div className="text-[6px] text-slate-400 leading-tight">謝礼金あり</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full py-3 bg-black text-white rounded-xl text-[9px] font-black flex items-center justify-center gap-2 shadow-xl hover:bg-slate-900 transition-colors">
                                                    <Send className="w-3 h-3" /> 招待状を送る
                                                </div>
                                            </div>

                                            <div className="p-8 bg-white min-h-[200px] flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                </div>
                                                <h4 className="text-xl font-black text-slate-900 italic tracking-tighter mb-3">OFFER SENT!</h4>
                                                <p className="text-[9px] text-slate-400 font-medium leading-relaxed">招待状を送りました。</p>
                                            </div>
                                        </div>

                                        {/* Scroll Hint */}
                                        <div className="absolute bottom-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-[7px] font-bold shadow-lg animate-bounce z-30">
                                            Scroll ↓
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Value 2: AI Chat UI (Animated) */}
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                            <div className="mb-10 w-full">
                                <div className="inline-flex items-center gap-2 text-violet-600 font-bold text-sm mb-4">
                                    <MessageSquare className="w-5 h-5" /> 02. AI CONCIERGE CHAT
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">英語力ゼロで完結。<br />即時翻訳とスマートテンプレート</h3>
                                <p className="text-slate-500 leading-relaxed mb-12">
                                    クリエイターとの英語のやり取りに怯える必要はありません。<br /><br />
                                    Supabase RealtimeとGemini AIを連携させた独自チャットにより、あなたが入力した日本語は即座に美しい英語に翻訳されて相手に届きます。さらに、日程や道案内も「スマートテンプレート」のボタンを押すだけでAIが自動生成。スパムや失礼な対応をシステムが防ぎます。
                                </p>
                            </div>

                            <div className="relative flex justify-center w-full">
                                <div className="absolute inset-0 bg-violet-50 rounded-[3rem] rotate-3 scale-105 -z-10" />
                                <div className="w-[280px] bg-white rounded-[2rem] border-[6px] border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[520px]">
                                    {/* (Chat Mockup UI remains same) */}
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
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                            <div className="mb-10 w-full">
                                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                                    <LayoutGrid className="w-5 h-5" /> 03. THE ASSET
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">バズで終わらせない。<br />獲得した動画を「集客資産」に。</h3>
                                <p className="text-slate-500 leading-relaxed mb-12">
                                    私たちが狙うのは「虚栄のバズ」ではなく、保存（Save）される「熱量のアルゴリズムハック」です。<br /><br />
                                    さらに、タイムラインから流れて消えても効果は終わりません。『ASSET HUB』を使えば、納品された動画をGoogle Mapsに同期させたり、自社HPのウィジェットとして埋め込むことが可能。月額3.98万円で、貴店のすべてのデジタル接点をインバウンド仕様にアップデートし続けます。
                                </p>
                            </div>

                            <div className="relative flex justify-center w-full">
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
                                            <div className="text-[6px] text-slate-400 text-right font-bold">鮮度: {assetStep >= 2 ? '100%' : '60%'}</div>
                                        </div>

                                        <div className={`border rounded-xl p-4 text-left transition-colors duration-500 ${assetStep >= 1 ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                                            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-700 mb-2">
                                                <Globe className="w-3 h-3 text-blue-500" /> Web Widget
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 text-left">
                                                <div className={`h-1.5 rounded-full transition-all duration-1000 ${assetStep >= 2 ? 'bg-emerald-500 w-full' : 'bg-amber-400 w-[60%]'}`} />
                                            </div>
                                            <div className="text-[6px] text-slate-400 text-right font-bold">鮮度: {assetStep >= 2 ? '100%' : '60%'}</div>
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
          5. PRICING & UPSELL (クロージング)
      ========================================= */}
            <section id="signup" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* INSIDERS Pricing Box */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl text-center relative overflow-hidden mb-12">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />
                        <h2 className="text-2xl font-black text-white mb-2">INSIDERS. スタンダード</h2>
                        <p className="text-slate-400 font-medium mb-8">インバウンド集客を、最も安く、最も確実に始める。</p>

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
                                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> ASSET HUB（動画の二次利用・マップ連携）
                            </li>
                        </ul>

                        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-6 mb-8">
                            <div className="text-indigo-300 font-bold text-sm mb-2 flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" /> 初回限定 特別オファー
                            </div>
                            <div className="text-white font-black text-lg">
                                最初の3名へのオファー（招待）まで<br className="hidden sm:block" />
                                <span className="text-yellow-400">完全無料</span>でお試しいただけます。
                            </div>
                            <p className="text-xs text-indigo-200/80 mt-2">※マッチング・交渉成立後の本契約までクレジットカード登録は不要です。</p>
                        </div>

                        <Link href="/advertiser/gateway">
                            <button className="w-full sm:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/50 transition-all">
                                無料でクリエイター3名にオファーする
                            </button>
                        </Link>
                    </div>

                    {/* Upsell to BUZZ OVER */}
                    <div className="text-center pt-8 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Enterprise BPO Solution</h4>
                        <p className="text-slate-600 font-bold mb-3">
                            現場の対応もすべて丸投げしたい。動画からの来店効果を最大化したい店舗様へ。
                        </p>
                        <p className="text-sm text-slate-500 mb-4 max-w-2xl mx-auto">
                            クリエイターの手配に加え、AIによるGoogleマップの多言語化や予約導線の最適化までを「完全丸投げ」できるインバウンド特化型スマートBPO『BUZZ OVER（月額25万円〜）』もご用意しています。
                        </p>
                        <a href="https://buzzover.jp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm">
                            BUZZ OVER の詳細を見る <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>

                </div>
            </section>

        </div>
    );
}