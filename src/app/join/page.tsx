import React from 'react';
import Link from 'next/link';
import { Search, CheckCircle2, ArrowRight, Sparkles, Send, ShieldCheck, Zap, Wallet, Building2, Crown, Star, PlayCircle, ChevronDown, Check } from 'lucide-react';

export default function CreatorLandingPage() {
    return (
        <div className="min-h-screen bg-black text-slate-50 font-sans selection:bg-white selection:text-black">

            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                <div className="inline-block border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-8 text-slate-300">
                    For Tier S/A Creators
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
                    Beyond the <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-100">Buzz.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light mb-12 leading-relaxed">
                    バズは消費され、VIBEは資産になる。<br className="hidden md:block" />
                    日本のローカルビジネスと真の価値を繋ぐ、プロフェッショナル・クリエイターのための招待制ネットワーク。
                </p>
                <Link
                    href="/join"
                    className="bg-white text-black px-8 py-4 rounded-full font-bold tracking-wide hover:bg-slate-200 transition-colors duration-300 flex items-center gap-2"
                >
                    Apply for Invitation <ArrowRight className="w-4 h-4" />
                </Link>
            </section>

            {/* 2. THE PROBLEM & SOLUTION (The Missing Link) */}
            <section className="py-24 bg-zinc-950 px-6 border-y border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                        Japan has the best spots.<br />
                        You have the best content.<br />
                        <span className="text-slate-500">But something is missing.</span>
                    </h2>
                    <div className="space-y-6 text-slate-400 text-lg font-light leading-relaxed">
                        <p>
                            素晴らしい発信をするインバウンドクリエイターと、それを求める日本の名店。両者は「言語の壁」「日本の独特な商習慣」「条件交渉のリテラシー不足」によって、すれ違っています。
                        </p>
                        <p className="text-white font-medium text-xl border-l-2 border-white pl-6 py-2">
                            INSIDERS. is your Professional Bridge.
                        </p>
                        <p>
                            私たちがその間に立ちます。面倒な価格交渉、契約書の締結、翻訳、撮影許可の取得、支払いトラブルの回避。これらすべての「摩擦（Friction）」を私たちが吸収します。あなたはただ、極上のコンテンツを作り、日本のVIBEを表現することだけに集中してください。
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. TRANSPARENCY (Dual UI Mockup) */}
            <section className="py-24 px-6 max-w-6xl mx-auto overflow-hidden">
                <div className="text-center mb-16">
                    <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Complete Transparency</h2>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-6">How We Match You</h3>
                    <p className="text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        私たちはあなたの「フォロワー数」を企業に売ることはしません。独自のAIが企業の強み（VIBE）を解析し、それに最もマッチする審美眼を持つクリエイターとしてあなたを推薦します。だからこそ、無理な案件やミスマッチは起こりません。
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row justify-center gap-10 lg:gap-16 items-center lg:items-start pb-10">

                    {/* =========================================
              ADVERTISER UI: Scrollable Mockup
          ============================================= */}
                    <div className="flex flex-col items-center">
                        <div className="text-[10px] font-bold text-indigo-400 mb-4 uppercase tracking-widest opacity-80 flex items-center gap-2">
                            <Building2 className="w-3 h-3" /> ADVERTISER UI
                        </div>
                        <div className="relative w-[260px] sm:w-[280px] h-[560px] sm:h-[600px] bg-slate-50 rounded-[2.5rem] border-[6px] border-[#f8fafc] shadow-2xl overflow-hidden flex flex-col group ring-1 ring-slate-200">
                            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-white text-slate-900 pb-10">

                                {/* --- Screen 0: Search Window --- */}
                                <div className="p-4 border-b border-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] bg-white relative z-10">
                                    <div className="bg-white rounded-xl p-2 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-2 py-1 border-r border-slate-100 scale-90">
                                            <span className="text-[12px]">🍱</span>
                                            <span className="text-[10px] font-bold text-slate-800">Food</span>
                                        </div>
                                        <div className="flex-1 flex items-center gap-1.5 text-slate-400">
                                            <Search className="w-4 h-4 shrink-0" />
                                            <span className="text-[10px] truncate">URLを入力して...</span>
                                        </div>
                                        <div className="bg-black text-white text-[9px] font-black px-3 py-2 rounded-lg shrink-0 scale-90">
                                            分析 ✨
                                        </div>
                                    </div>
                                </div>

                                {/* --- Screen 1: Analysis Complete --- */}
                                <div className="p-6 text-center border-b border-slate-50">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-100 text-emerald-500">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 italic tracking-tighter mb-2">ANALYSIS COMPLETE</h4>
                                    <p className="text-[10px] text-slate-400 mb-6 leading-tight">分析の結果、貴店の強みは<br />以下のように定義されました。</p>
                                    <div className="flex flex-wrap justify-center gap-1.5 mb-8">
                                        {['#和モダン', '#隠れ家', '#自然光', '#シズル感', '#行列'].map(tag => (
                                            <span key={tag} className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[9px] font-bold text-slate-700 shadow-sm">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="text-[10px] text-slate-400 mb-5 flex items-center justify-center gap-2">
                                        推薦クリエイター：
                                        <span className="text-2xl font-black text-slate-900 border-b-2 border-yellow-400 leading-none">24名</span>
                                    </div>
                                    <div className="w-full py-3 bg-black text-white rounded-full text-[10px] font-bold flex items-center justify-center gap-2 shadow-lg scale-95 hover:bg-slate-800 transition-colors">
                                        マッチング候補を見る <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>

                                {/* --- Screen 2: Creator Catalog --- */}
                                <div className="p-5 bg-slate-50/50 border-b border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-black text-slate-900">CREATOR CATALOG</span>
                                            <div className="bg-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">AI選定</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="relative aspect-[9/16] rounded-[24px] overflow-hidden group/card shadow-xl border-4 border-white">
                                            {/* Dummy Creator Image */}
                                            <div className="absolute inset-0 bg-slate-800">
                                                <img src="https://images.unsplash.com/photo-1515003197210-ce9c856873c2?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-80" alt="Creator" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10 z-10" />
                                            <div className="absolute bottom-4 left-4 z-20 text-white">
                                                <div className="text-[11px] font-bold opacity-80 mb-0.5">200k followers</div>
                                                <div className="text-lg font-black tracking-tight mb-1 uppercase">saki_japan</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- Screen 3: Offer Selection (Screenshot Match) --- */}
                                <div className="p-5 bg-white border-b border-slate-100 flex flex-col gap-5 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] text-amber-500 font-bold mb-1 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> オファー作成
                                            </div>
                                            <h5 className="text-[13px] font-black text-slate-900">SAKI_JAPANさんを招待</h5>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-bold border border-slate-100">×</div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                            <span>🎁</span> 提供プラン
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-3 pb-4 rounded-xl bg-white border-[1.5px] border-slate-900 relative shadow-sm">
                                                <div className="h-2"></div>
                                                <div className="text-[9px] text-slate-500 mt-2 font-medium">商品提供のみ</div>
                                                <div className="absolute top-2.5 right-2.5 flex items-center justify-center w-3.5 h-3.5 bg-slate-900 rounded-full">
                                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                </div>
                                            </div>
                                            <div className="p-3 pb-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                                <div className="text-[10px] font-bold text-slate-100 bg-white inline-block mb-1 text-transparent select-none">報酬あり</div>
                                                <div className="text-[9px] text-slate-300 font-medium">謝礼金あり</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                            <span>📷</span> 撮影で盛り込んでほしい要素
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <div className="px-3 py-1.5 rounded-lg text-[9px] font-bold bg-black text-white shadow-sm">看板メニュー</div>
                                            <div className="px-3 py-1.5 rounded-lg text-[9px] font-bold bg-black text-white shadow-sm">店内の雰囲気</div>
                                            <div className="px-3 py-1.5 rounded-lg text-[9px] font-bold bg-white text-slate-400 border border-slate-200">接客</div>
                                        </div>
                                    </div>

                                    <div className="mt-1 w-full py-4 bg-black text-white rounded-2xl text-[10px] font-bold flex items-center justify-center gap-2 shadow-xl">
                                        <Send className="w-3.5 h-3.5" /> 招待状を送る
                                    </div>
                                </div>

                                {/* --- Screen 4: Offer Sent (Screenshot Match) --- */}
                                <div className="py-12 px-6 bg-white min-h-[220px] flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 border-2 border-emerald-300 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        <Check className="w-6 h-6" strokeWidth={3} />
                                    </div>
                                    <h4 className="text-[22px] font-black text-slate-900 italic tracking-tighter mb-3">OFFER SENT!</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        招待状を送りました。
                                    </p>
                                </div>

                            </div>

                            {/* Floating Scroll Indicator */}
                            <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[9px] font-bold shadow-lg animate-bounce hidden lg:block z-20">
                                Scroll ↓
                            </div>
                        </div>
                    </div>

                    {/* =========================================
              CREATOR UI: Reconstructed from Code
          ============================================= */}
                    <div className="flex flex-col items-center">
                        <div className="text-[10px] font-bold text-rose-400 mb-4 uppercase tracking-widest opacity-80 flex items-center gap-2">
                            CREATOR UI <Sparkles className="w-3 h-3" />
                        </div>
                        <div className="relative w-[260px] sm:w-[280px] h-[560px] sm:h-[600px] bg-[#0a0a0a] rounded-[2.5rem] border-[6px] border-[#1f2229] shadow-2xl overflow-hidden ring-1 ring-white/10">
                            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide p-4 pb-12 font-sans text-slate-50">

                                {/* --- Creator Header --- */}
                                <div className="flex justify-between items-center mb-6 mt-2">
                                    <div>
                                        <div className="text-[10px] text-slate-400 mb-0.5">Welcome back,</div>
                                        <div className="text-sm font-bold tracking-wide">Elena Tokyo</div>
                                    </div>
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                                        className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-lg"
                                        alt="Avatar"
                                    />
                                </div>

                                {/* --- Tier Card --- */}
                                <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 mb-6 relative overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none"></div>
                                    <div className="flex items-center gap-1.5 text-yellow-500 mb-4 relative z-10">
                                        <Crown className="w-3.5 h-3.5" strokeWidth={2.5} />
                                        <span className="text-[10px] font-black tracking-widest uppercase">Tier S Creator</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-1 relative z-10">
                                        <span className="text-3xl font-light text-white">12</span>
                                        <span className="text-[10px] text-slate-400 font-medium">Assets Created</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 mb-5 relative z-10">Your VIBE is driving permanent value.</p>

                                    <div className="flex justify-between text-[8px] text-slate-400 mb-1.5 relative z-10 font-medium tracking-wide">
                                        <span>Progress to SS-Tier</span>
                                        <span>12 / 15</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative z-10">
                                        <div className="bg-yellow-500 w-[80%] h-full rounded-full"></div>
                                    </div>
                                </div>

                                {/* --- Exclusive Invites --- */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4 px-1">
                                        <h3 className="text-[12px] font-bold">Exclusive Invites</h3>
                                        <span className="text-[9px] text-slate-400 flex items-center gap-1 cursor-pointer">View All <ArrowRight className="w-2.5 h-2.5" /></span>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x">
                                        {/* Invite 1 */}
                                        <div className="min-w-[190px] h-[260px] rounded-2xl relative overflow-hidden flex flex-col justify-end p-3.5 shadow-lg border border-white/10 snap-center group">
                                            <img src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=500&q=80" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Wagyu" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10"></div>
                                            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[8px] text-white font-bold tracking-wider border border-white/10">FINE DINING</div>
                                            <div className="relative z-10">
                                                <h4 className="font-bold text-sm mb-1 leading-tight tracking-wide">WAGYU OMAKASE 凛</h4>
                                                <div className="text-yellow-500 text-[9px] mb-4 flex items-center gap-1 font-medium">
                                                    <Star className="w-2.5 h-2.5 fill-current" /> Elegant & Traditional
                                                </div>
                                                <button className="w-full bg-white text-black py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors">
                                                    <PlayCircle className="w-3.5 h-3.5" /> Accept Invite
                                                </button>
                                            </div>
                                        </div>
                                        {/* Invite 2 */}
                                        <div className="min-w-[190px] h-[260px] rounded-2xl relative overflow-hidden flex flex-col justify-end p-3.5 shadow-lg border border-white/10 snap-center group">
                                            <img src="https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=500&q=80" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Bar" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10"></div>
                                            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[8px] text-white font-bold tracking-wider border border-white/10">NIGHTLIFE</div>
                                            <div className="relative z-10">
                                                <h4 className="font-bold text-sm mb-1 leading-tight tracking-wide">TOKYO NEON BAR</h4>
                                                <div className="text-yellow-500 text-[9px] mb-4 flex items-center gap-1 font-medium">
                                                    <Star className="w-2.5 h-2.5 fill-current" /> Cyberpunk & Edgy
                                                </div>
                                                <button className="w-full bg-white text-black py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors">
                                                    <PlayCircle className="w-3.5 h-3.5" /> Accept Invite
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- Asset History --- */}
                                <div>
                                    <h3 className="text-[12px] font-bold mb-4 px-1">Asset History</h3>
                                    <div className="space-y-3">
                                        {/* Item 1 */}
                                        <div className="bg-[#121212] border border-white/5 rounded-xl p-3.5 flex justify-between items-center shadow-md">
                                            <div>
                                                <div className="text-[11px] font-bold mb-1 tracking-wide">Sushi Ginza Onodera</div>
                                                <div className="text-[8px] text-slate-500">2024-03-01</div>
                                            </div>
                                            <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-[7px] font-black tracking-widest uppercase">Approved</div>
                                        </div>

                                        {/* Item 2 (Rejected + AI) */}
                                        <div className="bg-[#121212] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-md">
                                            <div className="p-3.5 flex justify-between items-center border-b border-white/5">
                                                <div>
                                                    <div className="text-[11px] font-bold mb-1 tracking-wide">Harajuku Kawaii Cafe</div>
                                                    <div className="text-[8px] text-slate-500">2024-02-15</div>
                                                </div>
                                                <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-1 rounded text-[7px] font-black tracking-widest uppercase">Rejected</div>
                                            </div>
                                            <div className="px-3 py-2.5 bg-[#080808] flex items-center justify-between cursor-pointer hover:bg-black transition-colors">
                                                <div className="text-[9px] text-yellow-500/90 flex items-center gap-1.5 font-medium">
                                                    <Sparkles className="w-3 h-3" /> AIからの次回アドバイスを見る
                                                </div>
                                                <ChevronDown className="w-3 h-3 text-slate-600" />
                                            </div>
                                        </div>

                                        {/* Item 3 */}
                                        <div className="bg-[#121212] border border-white/5 rounded-xl p-3.5 flex justify-between items-center shadow-md">
                                            <div>
                                                <div className="text-[11px] font-bold mb-1 tracking-wide">Shinjuku Golden Gai Bar</div>
                                                <div className="text-[8px] text-slate-500">2024-03-10</div>
                                            </div>
                                            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded text-[7px] font-black tracking-widest uppercase">Pending</div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Top Notch & Bottom Fade (PWA feel) */}
                            <div className="absolute top-0 inset-x-0 h-6 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-none z-30">
                                <div className="w-12 h-1 bg-white/20 rounded-full" />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-30" />
                            <div className="absolute bottom-4 right-4 bg-rose-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[9px] text-white font-bold animate-bounce hidden lg:block z-40">
                                Scroll ↓
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. OBJECTION HANDLING (Squashing reasons not to register) */}
            <section className="py-24 px-6 border-t border-white/5 bg-black">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Focus on your art. <br className="md:hidden" />
                        <span className="text-slate-500">We handle the friction.</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="p-8 border border-white/10 rounded-3xl bg-zinc-950 hover:bg-zinc-900 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">No Exclusivity (専属契約なし)</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">
                                あなたの活動を縛ることは一切ありません。INSIDERS.に登録しながら、他の案件やプラットフォームを利用することも完全に自由です。
                            </p>
                        </div>

                        <div className="p-8 border border-white/10 rounded-3xl bg-zinc-950 hover:bg-zinc-900 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Guaranteed Payment (報酬完全保証)</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">
                                企業との直接のやり取りによる未払い・遅延リスクはゼロです。案件完了後、INSIDERS.がクリエイターへ確実・迅速に報酬をお支払いします。
                            </p>
                        </div>

                        <div className="p-8 border border-white/10 rounded-3xl bg-zinc-950 hover:bg-zinc-900 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Zero Negotiation (交渉ストレスゼロ)</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">
                                面倒な単価交渉は発生しません。予算や条件はすべてプラットフォーム側で企業と調整済み。「この条件で受けるか」をボタン1つで決めるだけです。
                            </p>
                        </div>

                        <div className="p-8 border border-white/10 rounded-3xl bg-zinc-950 hover:bg-zinc-900 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Quality Clients Only (優良企業のみ)</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">
                                INSIDERS.の理念（VIBEの資産化）に賛同し、事前審査を通過したリテラシーの高いブランド・名店からのオファーのみが届きます。
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-32 px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
                    Ready to make your mark?
                </h2>
                <Link
                    href="/join"
                    className="inline-block bg-white text-black px-10 py-5 rounded-full font-bold tracking-widest text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                    ENTER THE INSIDERS.
                </Link>
                <p className="mt-6 text-xs text-slate-500 font-light">
                    ※現在は招待制（Waitlist）となっております。審査を通過した方のみアカウントが発行されます。
                </p>
            </section>
        </div>
    );
}