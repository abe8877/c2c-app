"use client";

import React from 'react';
import { Globe, Smartphone, TrendingUp, Users, CheckCircle, ArrowRight, Star, Play, Search, ShieldCheck, Zap, Instagram, MousePointerClick, MessageSquare, Camera, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { GuidedSearchBar } from '@/app/_components/GuidedSearchBar';

// src/app/page.tsx の features 配列を更新
const features = [
    {
        title: "厳選された在日クリエイター",
        description: "URLを入力するだけで、あなたの店のVIBEを解析。「海外から見た日本」の文脈を理解したネイティブクリエイターを中心としたネットワーク。",
        header: (
            <div className="relative w-full h-full min-h-[12rem] rounded-xl overflow-hidden border bg-gray-50">
                <img
                    src="/images/demo-ui-profile.png"
                    alt="Creator Profile UI"
                    className="absolute inset-0 w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
            </div>
        ),
        className: "",
    },
    {
        title: "工数ゼロでインバウンド専門クリエイターに依頼。",
        description: "条件を選ぶだけで、英語での案件依頼が完了。報酬形態や撮影時のオーダーも簡単に指定できます。",
        header: (
            <div className="relative w-full h-full min-h-[12rem] rounded-xl overflow-hidden border bg-gray-50">
                <img
                    src="/images/demo-ui-offer.png"
                    alt="AI Matching UI"
                    className="absolute inset-0 w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
            </div>
        ),
        className: "md:col-span-2",
    },
    {
        title: "安心のAIチャット翻訳",
        description: "英語が苦手でも大丈夫。日程調整や条件交渉は、AIテンプレートを選ぶだけで自動翻訳。",
        header: (
            <div className="relative w-full h-full min-h-[12rem] rounded-xl overflow-hidden border bg-gray-50">
                <img
                    src="/images/demo-ui-chat.png"
                    alt="AI Chat UI"
                    className="absolute inset-0 w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
            </div>
        ),
        className: "",
    },
    {
        title: "成果が見えるダッシュボード",
        description: "投稿後の来店効果や、どの国から注目されているかをデータで可視化。",
        header: (
            <div className="relative w-full h-full min-h-[12rem] rounded-xl overflow-hidden border bg-gray-50">
                <img
                    src="/images/demo-ui-dashboard.png"
                    alt="Dashboard UI"
                    className="absolute inset-0 w-full h-full object-cover object-left hover:scale-105 transition-transform duration-500"
                />
            </div>
        ),
        className: "md:col-span-2",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-yellow-500 selection:text-black">

            {/* Navigation */}
            <nav className="fixed w-full bg-white/90 backdrop-blur-md border-b border-stone-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tighter text-black">NOTS <span className="text-yellow-500">C2C</span></span>
                            <span className="hidden md:inline-block text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded">BETA</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-sm font-bold text-stone-500 hover:text-black transition">機能・特徴</a>
                            <a href="#flow" className="text-sm font-bold text-stone-500 hover:text-black transition">ご利用の流れ</a>
                            <a href="#pricing" className="text-sm font-bold text-stone-500 hover:text-black transition">料金プラン</a>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/admin">
                                <button className="hidden md:block px-4 py-2 text-xs font-bold text-stone-400 hover:text-black transition">
                                    Admin Login
                                </button>
                            </Link>
                            <Link href="/demo/advertiser">
                                <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-stone-800 transition shadow-lg flex items-center gap-2">
                                    デモを試す <ArrowRight size={16} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        在日外国人クリエイターと直接つながる
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                        インバウンド集客を、<br />
                        もっと<span className="text-yellow-500">直感的</span>に。
                    </h1>
                    <p className="mt-6 text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
                        「募集ページ作成」はもう不要。<br />
                        AIがお店の雰囲気を解析し、最適な「日本通」の外国人クリエイターをご提案。<br />
                        月額3.9万円で、世界への発信をあなたの手で。
                    </p>

                    <div className="mt-12 max-w-4xl mx-auto">
                        <GuidedSearchBar />
                        <p className="mt-4 text-xs text-stone-400 font-bold uppercase tracking-widest">
                            No registration required for preview analysis
                        </p>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-yellow-100 to-stone-100 rounded-full blur-3xl -z-10 opacity-60"></div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">NOTS C2Cの強み</h2>
                        <p className="text-stone-500">面倒な作業はAIに任せて、あなたは「選ぶ」だけ。</p>
                    </div>

                    <BentoGrid>
                        {features.map((item, i) => (
                            <BentoGridItem
                                key={i}
                                title={item.title}
                                description={item.description}
                                header={item.header}
                                className={item.className}
                            />
                        ))}
                    </BentoGrid>
                </div>
            </section>

            {/* ★ New Section: Usage Flow (Inspired by toridori) */}
            <section id="flow" className="py-24 bg-stone-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">HOW IT WORKS</h2>
                        <h3 className="text-3xl md:text-4xl font-bold">ご利用の流れ</h3>
                        <p className="text-stone-500 mt-4">他社サービスのような「募集して待つ」時間は必要ありません。<br />最短1分でオファー送信まで完了します。</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-stone-200 -z-10 transform scale-x-90"></div>

                        {/* Step 1 */}
                        <div className="relative bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 border-4 border-stone-50">1</div>
                            <div className="h-16 flex items-center justify-center mb-4 text-stone-300">
                                <Search size={48} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">URLを入力</h4>
                            <p className="text-xs text-stone-500 leading-relaxed">
                                InstagramやGoogleマップのURLを入れるだけ。AIがお店の魅力を解析します。
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 border-4 border-stone-50">2</div>
                            <div className="h-16 flex items-center justify-center mb-4 text-stone-300">
                                <MousePointerClick size={48} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">クリエイター選択</h4>
                            <p className="text-xs text-stone-500 leading-relaxed">
                                相性の良いクリエイターが自動で提案されます。気に入った人にオファーを送信。
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 border-4 border-stone-50">3</div>
                            <div className="h-16 flex items-center justify-center mb-4 text-stone-300">
                                <MessageSquare size={48} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">日程調整</h4>
                            <p className="text-xs text-stone-500 leading-relaxed">
                                マッチングしたらチャットで日程決め。AI翻訳・定型文があるので英語不要です。
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center">
                            <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6 border-4 border-stone-50">4</div>
                            <div className="h-16 flex items-center justify-center mb-4 text-yellow-400">
                                <Camera size={48} />
                            </div>
                            <h4 className="font-bold text-lg mb-2">来店・投稿</h4>
                            <p className="text-xs text-stone-500 leading-relaxed">
                                クリエイターが来店し、撮影・体験。後日、魅力的な動画がSNSで拡散されます。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section (Updated with "Secondary Use" appeal) */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
                    <p className="text-stone-500 mb-12">
                        他社では有料オプションとなる機能も、<br />
                        NOTSなら「コミコミ」で提供します。
                    </p>

                    <div className="bg-stone-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-12">
                            <div className="md:w-1/2">
                                <div className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded mb-4">POPULAR</div>
                                <h3 className="text-3xl font-bold mb-2">C2C Lite</h3>
                                <p className="text-stone-400 text-sm mb-6">
                                    インバウンド集客を始めたい店舗様向け。<br />
                                    競合他社 (5万円〜) より約20%お得。
                                </p>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-6xl font-bold tracking-tighter">¥39,800</span>
                                    <span className="text-stone-500 font-medium">/ 月 (税抜)</span>
                                </div>
                                <Link href="/demo/advertiser">
                                    <button className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-stone-200 transition shadow-lg flex items-center justify-center gap-2">
                                        無料でデモを試す <ArrowRight size={18} />
                                    </button>
                                </Link>
                            </div>

                            <div className="md:w-1/2 flex flex-col justify-center">
                                <p className="text-xs font-bold text-stone-500 uppercase mb-4 tracking-wider">ALL INCLUDED:</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-yellow-400 flex-shrink-0" />
                                        <div>
                                            <span className="font-bold text-sm block">在日外国人クリエイターと直接マッチング</span>
                                            <span className="text-xs text-stone-400">月3組まで招待可能</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-yellow-400 flex-shrink-0" />
                                        <div>
                                            <span className="font-bold text-sm block">二次利用・シェア OK</span>
                                            <span className="text-xs text-yellow-400">他社では+5,000円〜 → 0円</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-yellow-400 flex-shrink-0" />
                                        <div>
                                            <span className="font-bold text-sm block">撮影内容のAI指示だし</span>
                                            <span className="text-xs text-yellow-400">構図指定オプション相当 → 0円</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-yellow-400 flex-shrink-0" />
                                        <div>
                                            <span className="font-bold text-sm block">AI翻訳チャット</span>
                                            <span className="text-xs text-stone-400">英語対応スタッフ不要</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-stone-50 rounded-2xl border border-stone-100 inline-block">
                        <p className="text-sm text-stone-500 mb-2 font-bold">さらに本格的な戦略・運用代行をご希望の方は</p>
                        <Link href="/demo/upgrade" className="text-stone-900 font-bold border-b border-stone-900 hover:text-yellow-600 hover:border-yellow-600 transition flex items-center justify-center gap-1">
                            上位プラン (Strategic BPO) を見る <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-stone-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-2xl font-black tracking-tighter text-black">NOTS <span className="text-yellow-500">C2C</span></div>
                    <p className="text-stone-400 text-sm">© 2026 NOTS Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}