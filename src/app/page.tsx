import React from 'react';
import {
    Search, CheckCircle2, ArrowRight, Sparkles, Send,
    Globe, MessageSquare, BadgeCent, Scissors,
    UtensilsCrossed, Tent, AlertTriangle, ArrowUpRight
} from 'lucide-react';

export default function InsidersLP() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

            {/* =========================================
          1. HERO SECTION (ファーストビュー)
      ========================================= */}
            <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

                        {/* Left: Copy & CTA */}
                        <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold mb-6">
                                <AlertTriangle className="w-4 h-4" />
                                <span>代理店の高額マージンや、英語対応に疲れた店舗様へ</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.15]">
                                月額3.98万円で、<br />
                                世界中の訪日客を<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">呼び込む。</span>
                            </h1>
                            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                英語力も、高額なPR代理店も不要です。お店のURLを入れるだけで、AIが「海外から本当に支持されている」本物のクリエイターを自動選出。交渉から来店までスマホひとつで完結する、インバウンド専門クリエイター・マッチングアプリ。
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                                    無料でクリエイターを探す <ArrowRight className="w-5 h-5" />
                                </a>
                                <span className="text-sm text-slate-400 font-medium">初期費用 ¥0 / 14日間トライアル</span>
                            </div>
                        </div>

                        {/* Right: Dual UI Mockups */}
                        <div className="lg:col-span-6 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-100/40 to-violet-100/40 rounded-full blur-3xl -z-10" />

                            <div className="flex flex-row justify-center lg:justify-end gap-4 sm:gap-6 items-start">

                                {/* --- ADVERTISER UI MOCKUP --- */}
                                <div className="flex flex-col items-center translate-y-8">
                                    <div className="text-[10px] font-bold text-indigo-500 mb-3 uppercase tracking-widest opacity-90">ADVERTISER UI</div>
                                    <div className="relative w-[160px] sm:w-[220px] h-[400px] sm:h-[480px] bg-slate-50 rounded-[2rem] border-[6px] border-white shadow-2xl overflow-hidden flex flex-col group">
                                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-white">
                                            {/* Screen 0: Search */}
                                            <div className="p-3 border-b border-slate-50 bg-white">
                                                <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-100 flex items-center gap-1.5">
                                                    <span className="text-[10px]">🍱</span>
                                                    <div className="flex-1 flex items-center gap-1 text-slate-400">
                                                        <Search className="w-3 h-3 shrink-0" />
                                                        <span className="text-[7px] sm:text-[8px] truncate">URLを入力...</span>
                                                    </div>
                                                    <div className="bg-slate-900 text-white text-[6px] sm:text-[7px] font-bold px-1.5 py-1 rounded shrink-0">
                                                        分析 ✨
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Screen 1: Analysis */}
                                            <div className="p-4 text-center border-b border-slate-50">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <h4 className="text-[10px] sm:text-xs font-black text-slate-900 italic tracking-tighter mb-2">ANALYSIS COMPLETE</h4>
                                                <div className="flex flex-wrap justify-center gap-1 mb-3">
                                                    {['#和モダン', '#隠れ家', '#シズル感'].map(tag => (
                                                        <span key={tag} className="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100 text-[6px] sm:text-[7px] font-bold text-slate-600">{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="w-full py-2 bg-slate-900 text-white rounded-full text-[7px] sm:text-[8px] font-bold flex items-center justify-center gap-1">
                                                    候補を見る <ArrowRight className="w-2 h-2" />
                                                </div>
                                            </div>
                                            {/* Screen 2: Catalog */}
                                            <div className="p-3 bg-slate-50/50 border-b border-slate-100">
                                                <div className="flex items-center gap-1 mb-2">
                                                    <span className="text-[8px] sm:text-[9px] font-black text-slate-900">CATALOG</span>
                                                    <div className="bg-yellow-400 text-[5px] font-black px-1 rounded uppercase">AI選定</div>
                                                </div>
                                                <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg border-2 border-white">
                                                    <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=500&q=80" alt="Creator" className="absolute inset-0 w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                                    <div className="absolute bottom-2 left-2 text-white">
                                                        <div className="text-[9px] sm:text-[10px] font-black leading-tight">@saki_japan</div>
                                                        <div className="text-[6px] sm:text-[7px] font-bold opacity-80">200k followers</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Screen 3: Offer */}
                                            <div className="p-4 bg-white text-center">
                                                <div className="text-[7px] text-yellow-600 font-bold mb-1 flex items-center justify-center gap-1"><Sparkles className="w-2 h-2" /> オファー作成</div>
                                                <div className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[7px] sm:text-[8px] font-bold flex items-center justify-center gap-1 shadow-md">
                                                    <Send className="w-2 h-2" /> 招待状を送る
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[6px] font-bold shadow-lg animate-bounce">
                                            Scroll ↓
                                        </div>
                                    </div>
                                </div>

                                {/* --- CREATOR UI MOCKUP --- */}
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] font-bold text-rose-400 mb-3 uppercase tracking-widest opacity-90">CREATOR UI</div>
                                    <div className="relative w-[160px] sm:w-[220px] h-[400px] sm:h-[480px] bg-slate-900 rounded-[2rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-3 sm:p-4 text-white">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="text-[6px] sm:text-[7px] text-slate-400">Welcome back,</div>
                                                    <div className="text-[10px] sm:text-xs font-bold">Elena Tokyo</div>
                                                </div>
                                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" alt="Avatar" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-slate-700" />
                                            </div>
                                            {/* Tier */}
                                            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-2 sm:p-3 mb-4">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400" />
                                                    <span className="text-[7px] sm:text-[9px] font-bold text-yellow-400">TIER S CREATOR</span>
                                                </div>
                                                <div className="flex items-end gap-1 mb-1">
                                                    <span className="text-sm sm:text-lg font-black leading-none">12</span>
                                                    <span className="text-[6px] sm:text-[7px] text-slate-400">Assets Created</span>
                                                </div>
                                                <div className="w-full bg-slate-800 rounded-full h-1 mb-1">
                                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1 rounded-full w-[80%]"></div>
                                                </div>
                                            </div>
                                            {/* Invites */}
                                            <div className="mb-4">
                                                <h3 className="text-[8px] sm:text-[9px] font-bold mb-2">Exclusive Invites</h3>
                                                <div className="flex flex-col gap-2">
                                                    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                                        <div className="h-12 sm:h-16 relative">
                                                            <img src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=500&q=80" className="w-full h-full object-cover opacity-80" />
                                                            <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[5px] font-bold">FINE DINING</div>
                                                        </div>
                                                        <div className="p-1.5 sm:p-2">
                                                            <div className="text-[7px] sm:text-[8px] font-bold truncate mb-1">WAGYU OMAKASE 凛</div>
                                                            <button className="w-full py-1 bg-white text-black text-[6px] sm:text-[7px] font-bold rounded">Accept Invite</button>
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                                        <div className="h-12 sm:h-16 relative">
                                                            <img src="https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=500&q=80" className="w-full h-full object-cover opacity-80" />
                                                            <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[5px] font-bold">NIGHTLIFE</div>
                                                        </div>
                                                        <div className="p-1.5 sm:p-2">
                                                            <div className="text-[7px] sm:text-[8px] font-bold truncate mb-1">TOKYO NEON BAR</div>
                                                            <button className="w-full py-1 bg-white text-black text-[6px] sm:text-[7px] font-bold rounded">Accept Invite</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* History */}
                                            <div>
                                                <h3 className="text-[8px] sm:text-[9px] font-bold mb-2">Asset History</h3>
                                                <div className="bg-slate-800 p-1.5 sm:p-2 rounded-lg border border-slate-700 flex justify-between items-center mb-1">
                                                    <div className="text-[7px] sm:text-[8px] font-bold">Sushi Ginza Onodera</div>
                                                    <div className="text-[5px] sm:text-[6px] font-bold text-emerald-400 bg-emerald-400/10 px-1 py-0.5 rounded">APPROVED</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[6px] font-bold shadow-lg animate-bounce">
                                            Scroll ↓
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          2. PROBLEM SECTION (アンチテーゼ)
      ========================================= */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                            「外国人インフルエンサー」を呼べば、<br className="hidden sm:block" />
                            インバウンド客が来ると思っていませんか？
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            多くの店舗様が「日本在住の外国人」をアサインし、集客に失敗しています。なぜなら、彼らのフォロワーの多くは「日本人」だからです。本当にリーチすべきは、今まさに日本への旅行を計画している「海外の訪日予定層」です。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-2xl">🤔</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">「本物」が見つからない</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">海外に向けて発信している”本物”のクリエイター（日本人を含む）は、自力では見つけられず、偽物の数字に騙されてしまいます。</p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-2xl">💬</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">英語での交渉ができない</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">InstagramのDMで英語のやり取りをしたり、来店時の細かいアテンドをする語学力も時間も、現場のスタッフにはありません。</p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-2xl">💸</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">代理店が高すぎる</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">PR会社やキャスティング会社に依頼すると、高額な中間マージンを取られ、たった1回の施策で数十万円の予算が飛んでいきます。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          3. SOLUTION SECTION (独自の強み)
      ========================================= */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="mb-16 lg:mb-0">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
                                独自のAIデータ基盤が、<br />
                                最適で”本物”の出会いを<br className="hidden sm:block" />全自動化する。
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                私たちは高額な手数料を取る「代理店」ではありません。<br />
                                独自のアルゴリズムで、本当に「海外から支持されている」国内外のクリエイターをスコアリングし、直接マッチングするプラットフォームです。
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">AIマッチング：URLだけで「インサイダー」を発見</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">貴店のURLを入力するだけで、AIがお店の強み（Vibe）を自動解析。代理店が抱えていない、本当に刺さる隠れた才能（インサイダー）を自動推薦します。</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 border border-violet-500/30">
                                        <MessageSquare className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">AI翻訳チャット：日本語だけで交渉完結</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">条件のすり合わせから当日の案内まで、システム内のチャットをAIが全自動で即時翻訳。あなたは日本語を入力するだけで、英語ネイティブとスムーズに商談が可能です。</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                        <BadgeCent className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">破壊的プライシング：代理店マージン「ゼロ」</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">月額39,800円のシステム利用料のみで、毎月最大3組のクリエイターをアサイン可能。さらに、投稿された高品質な動画は自社のSNS等で「二次利用無料」です。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Graphic */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[3rem] blur-3xl opacity-20" />
                            <div className="relative bg-slate-800 border border-slate-700 rounded-[2rem] p-8 shadow-2xl">
                                <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">🏢</div>
                                        <div>
                                            <div className="text-sm font-bold">You (Advertiser)</div>
                                            <div className="text-xs text-slate-400">日本語で入力</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-slate-700">
                                    <p className="text-sm text-slate-300">「来週の火曜日の14時に、看板メニューの和牛を撮影しに来ていただけますか？」</p>
                                </div>

                                <div className="flex justify-center my-4">
                                    <div className="bg-indigo-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> AI Translated
                                    </div>
                                </div>

                                <div className="bg-indigo-900/30 rounded-xl p-4 mb-4 border border-indigo-500/30">
                                    <p className="text-sm text-indigo-200">"Could you come shoot our signature Wagyu beef next Tuesday at 2 PM?"</p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-700 pt-4 mt-4 flex-row-reverse">
                                    <div className="flex items-center gap-3 flex-row-reverse">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Creator" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">Elena Tokyo</div>
                                            <div className="text-xs text-slate-400">Received in English</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          4. TARGET USE-CASE SECTION
      ========================================= */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
                            インバウンド需要を取りこぼしている、<br />
                            あらゆる業態の「救世主」に。
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* BEAUTY */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 transition-transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                                <Scissors className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">BEAUTY</h3>
                            <p className="text-xs font-bold text-rose-500 mb-4 tracking-wider uppercase">個人サロン・ヘッドスパ・ネイル</p>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 mb-1">課題</p>
                                    <p className="text-sm text-slate-700">国内ポータルサイトは外国人が予約できず、英語のDMが殺到して現場がパンク。</p>
                                </div>
                                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                                    <p className="text-xs font-bold text-rose-600 mb-1">効果</p>
                                    <p className="text-sm text-rose-900 font-medium">月額3.98万で、日本の美容技術を世界に発信。高単価なインバウンド指名客だけで席を埋めることができます。</p>
                                </div>
                            </div>
                        </div>

                        {/* CASUAL FOOD */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 transition-transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                                <UtensilsCrossed className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">CASUAL FOOD</h3>
                            <p className="text-xs font-bold text-amber-500 mb-4 tracking-wider uppercase">大衆酒場・カフェ・食べ歩き</p>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 mb-1">課題</p>
                                    <p className="text-sm text-slate-700">予約不要の業態で、外国人に「ここに行きたい」と直感的に思わせる術がない。</p>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                    <p className="text-xs font-bold text-amber-600 mb-1">効果</p>
                                    <p className="text-sm text-amber-900 font-medium">予約導線の整備は不要。ショート動画の「シズル感」だけで、明日から外国人の行列を作れる定常的なPRインフラに。</p>
                                </div>
                            </div>
                        </div>

                        {/* EXPERIENCE */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 transition-transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                <Tent className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">EXPERIENCE</h3>
                            <p className="text-xs font-bold text-emerald-500 mb-4 tracking-wider uppercase">着物・陶芸・ローカル体験</p>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 mb-1">課題</p>
                                    <p className="text-sm text-slate-700">海外OTA（旅行サイト）に依存し、20%以上の高い手数料を搾取されている。</p>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-600 mb-1">効果</p>
                                    <p className="text-sm text-emerald-900 font-medium">海外の旅行計画層に直接動画を届け、OTAを介さない「自社予約（直接予約）」の比率を劇的に引き上げます。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          5. HOW IT WORKS SECTION
      ========================================= */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-16">
                        驚くほど簡単。スマホひとつで、<br />今日からインバウンド集客を。
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl font-black mb-4 border-4 border-white shadow-lg z-10">1</div>
                            <h4 className="text-lg font-bold mb-2">URL入力＆VIBE解析</h4>
                            <p className="text-xs text-slate-500">お店のURLを入力するだけで、AIが貴店の強み（タグ）を自動解析します。</p>
                        </div>
                        <div className="flex flex-col items-center relative">
                            <div className="hidden md:block absolute top-8 -left-[50%] w-full h-[2px] bg-slate-100 -z-10" />
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl font-black mb-4 border-4 border-white shadow-lg z-10">2</div>
                            <h4 className="text-lg font-bold mb-2">クリエイター選定</h4>
                            <p className="text-xs text-slate-500">AIが選出した「海外に刺さる」高相性なクリエイターカタログから招待したい人を選びます。</p>
                        </div>
                        <div className="flex flex-col items-center relative">
                            <div className="hidden md:block absolute top-8 -left-[50%] w-full h-[2px] bg-slate-100 -z-10" />
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl font-black mb-4 border-4 border-white shadow-lg z-10">3</div>
                            <h4 className="text-lg font-bold mb-2">ワンタップでオファー</h4>
                            <p className="text-xs text-slate-500">条件や撮影してほしい要素を選んで送信ボタンを押すだけ。</p>
                        </div>
                        <div className="flex flex-col items-center relative">
                            <div className="hidden md:block absolute top-8 -left-[50%] w-full h-[2px] bg-slate-100 -z-10" />
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-black mb-4 border-4 border-white shadow-lg z-10">4</div>
                            <h4 className="text-lg font-bold mb-2">AIチャットで日程調整</h4>
                            <p className="text-xs text-slate-500">マッチング成立後、AI翻訳付きのチャットで日程を決めるだけ。あとは最高の体験を。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
          6. PRICING & UPSELL (クロージング)
      ========================================= */}
            <section id="pricing" className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* INSIDERS Pricing Box */}
                    <div className="bg-white rounded-[2.5rem] p-10 sm:p-14 shadow-2xl border-2 border-indigo-600 text-center relative overflow-hidden mb-12">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />
                        <h2 className="text-2xl font-black text-slate-900 mb-2">INSIDERS. スタンダード</h2>
                        <p className="text-slate-500 font-medium mb-8">インバウンド集客を、最も安く、最も確実に始める。</p>

                        <div className="flex items-end justify-center gap-2 mb-8">
                            <span className="text-6xl font-black tracking-tighter text-slate-900">¥39,800</span>
                            <span className="text-lg text-slate-400 font-bold pb-2">/ 月（税抜）</span>
                        </div>

                        <ul className="text-left max-w-sm mx-auto space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> 初期費用ゼロ / いつでも解約可能
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> クリエイターアサイン 月間最大3組まで
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> AI自動翻訳チャット機能
                            </li>
                            <li className="flex items-center gap-3 text-slate-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> 投稿された動画の二次利用無料
                            </li>
                        </ul>

                        <button className="w-full sm:w-auto px-12 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all">
                            14日間無料で試してみる
                        </button>
                    </div>

                    {/* Upsell to BUZZ OVER */}
                    <div className="bg-slate-200/50 rounded-3xl p-8 border border-slate-200 text-center">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Enterprise BPO Solution</h4>
                        <p className="text-slate-700 font-bold mb-4">
                            動画からの来店効果を最大化したい。現場の対応もすべて丸投げしたい店舗様へ。
                        </p>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            クリエイターの手配に加え、AIによるGoogleマップの多言語化や予約導線の最適化までを「完全丸投げ」できるインバウンド特化型スマートBPO『BUZZ OVER（月額25万円〜）』もご用意しています。
                        </p>
                        <a href="https://buzzover.jp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                            BUZZ OVER の詳細を見る <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>

                </div>
            </section>

        </div>
    );
}