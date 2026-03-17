"use client";

import React, { useState } from 'react';
import { CheckCircle, Calendar, ArrowRight, TrendingUp, Users, Search, BarChart3, QrCode, FileText, ChevronLeft, User, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function UpgradePage() {
    const [step, setStep] = useState<'intro' | 'booking'>('intro');

    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans">

            {/* Header */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-stone-100 bg-white sticky top-0 z-20">
                <Link href="/advertiser" className="text-2xl font-bold tracking-tighter">NOTS <span className="text-yellow-500">PRO</span></Link>
                <div className="text-xs font-bold bg-stone-100 px-3 py-1 rounded text-stone-500">Strategic BPO Program</div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-16">

                {step === 'intro' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Hero Section */}
                        <div className="text-center mb-20">
                            <div className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full mb-6">
                                Strategic Partner
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                                目の前を歩く訪日客を、<br />
                                これ以上<span className="text-yellow-500">「素通り」</span>させない。
                            </h1>
                            <p className="text-lg text-stone-500 max-w-3xl mx-auto leading-relaxed">
                                C2Cプラットフォームでの動画発信は、あくまで「認知」の入り口です。<br />
                                NOTS PROは、市場分析から来店計測、改善レポートまでを一気通貫で提供し、<br />
                                <span className="font-bold text-stone-800">「バズ」を確実な「資産（ASSET）」に変える</span>ための戦略パートナーです。
                            </p>
                        </div>

                        {/* Solution Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mb-20">
                            {/* 1. Analysis */}
                            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 relative overflow-hidden group hover:shadow-lg transition">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                    <Search size={120} />
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">ブルーオーシャン分析</h3>
                                <p className="text-sm text-stone-500 leading-relaxed mb-4">
                                    需要はあるのに競合がいない「空き地」を特定。
                                    感覚ではなく、データに基づいた「勝てるキーワード」と「VIBE」を設計します。
                                </p>
                                <ul className="text-xs text-stone-600 space-y-2 font-bold">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> 競合ギャップ解析 (BOS)</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> インバウンド需要予測</li>
                                </ul>
                            </div>

                            {/* 2. Measurement */}
                            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 relative overflow-hidden group hover:shadow-lg transition">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                    <QrCode size={120} />
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">スマートビジットパス</h3>
                                <p className="text-sm text-stone-500 leading-relaxed mb-4">
                                    「動画を見て本当に来たのか？」を可視化。
                                    アプリ不要の独自システムで、オフラインの来店コンバージョンを正確に計測します。
                                </p>
                                <ul className="text-xs text-stone-600 space-y-2 font-bold">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> 来店CV計測 (QR設置のみ)</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> クーポン/抽選機能連携</li>
                                </ul>
                            </div>

                            {/* 3. Strategy */}
                            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 relative overflow-hidden group hover:shadow-lg transition">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                    <FileText size={120} />
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-6">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">羅針盤レポート</h3>
                                <p className="text-sm text-stone-500 leading-relaxed mb-4">
                                    動画のコメントや反応から、訪日客の「隠れた本音」を発掘。
                                    次にどんな施策を打てば良いかが一目でわかる戦略レポートを提供します。
                                </p>
                                <ul className="text-xs text-stone-600 space-y-2 font-bold">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-yellow-500" /> 顧客インサイト発掘</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-yellow-500" /> 翌月の改善アクション提案</li>
                                </ul>
                            </div>
                        </div>

                        {/* ★ Updated CTA Section (Positive Tone) */}
                        <div className="bg-stone-900 text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-stone-800 p-4 rounded-full">
                                        <HeartHandshake size={48} className="text-yellow-500" />
                                    </div>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                    世界中から愛される店を、<br />
                                    一緒につくりませんか？
                                </h2>
                                <p className="text-stone-400 mb-10 text-lg leading-relaxed">
                                    NOTSは単なるツールではありません。<br />
                                    貴店の魅力を世界に翻訳し、経営を次のステージへ導くパートナーです。<br />
                                    まずは無料の戦略診断で、貴店の「可能性」をお話しさせてください。
                                </p>
                                <button
                                    onClick={() => setStep('booking')}
                                    className="bg-yellow-500 text-black px-12 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-lg flex items-center gap-2 mx-auto"
                                >
                                    無料戦略ミーティングを予約 <ArrowRight size={20} />
                                </button>
                            </div>

                            {/* Background Abstract */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse"></div>
                                <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse delay-1000"></div>
                            </div>
                        </div>

                    </div>
                )}

                {/* Booking Step (Same as before) */}
                {step === 'booking' && (
                    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
                        <button onClick={() => setStep('intro')} className="mb-8 text-stone-500 hover:text-black flex items-center gap-2 font-bold"><ChevronLeft size={20} /> サービス紹介に戻る</button>

                        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden flex flex-col md:flex-row">
                            <div className="bg-stone-50 p-8 md:w-1/3 border-r border-stone-100">
                                <div className="w-20 h-20 bg-stone-300 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md">
                                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-xl mb-1">阿部 周平</h3>
                                <div className="text-xs font-bold text-yellow-600 bg-yellow-100 inline-block px-2 py-0.5 rounded mb-4">Chief Strategist</div>
                                <p className="text-sm text-stone-500 leading-relaxed mb-6">
                                    貴店のエリア・業態に合わせ、ブルーオーシャン分析を用いた最適なインバウンド戦略をその場でご提案します。
                                </p>
                                <div className="space-y-3 text-sm font-bold text-stone-700">
                                    <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> オンライン / 30分</p>
                                    <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Google Meet</p>
                                </div>
                            </div>

                            <div className="p-8 md:w-2/3">
                                <h3 className="text-2xl font-bold mb-6">日程を選択</h3>
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="font-bold text-lg">2026年 3月</span>
                                        <div className="flex gap-2">
                                            <button className="p-1 hover:bg-stone-100 rounded"><ChevronLeft size={20} /></button>
                                            <button className="p-1 hover:bg-stone-100 rounded"><ChevronLeft size={20} className="rotate-180" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-stone-400 font-bold">
                                        <span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {[...Array(31)].map((_, i) => (
                                            <button key={i} className={`h-10 rounded-lg flex items-center justify-center font-bold text-sm transition
                                        ${i === 12 ? 'bg-black text-white shadow-lg' : 'hover:bg-stone-100 text-stone-600'}
                                        ${i < 10 ? 'opacity-30 cursor-not-allowed' : ''}
                                    `}>
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-stone-100 pt-6">
                                    <h4 className="font-bold mb-4 text-sm text-stone-400">3月13日(金) の空き枠</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button className="py-2 border border-stone-200 rounded-lg font-bold text-stone-600 text-sm hover:border-black hover:text-black transition">10:00</button>
                                        <button className="py-2 bg-black text-white rounded-lg font-bold text-sm shadow-md transform scale-105">13:30</button>
                                        <button className="py-2 border border-stone-200 rounded-lg font-bold text-stone-600 text-sm hover:border-black hover:text-black transition">15:00</button>
                                    </div>
                                </div>

                                <button className="w-full mt-8 py-4 bg-yellow-400 text-black rounded-xl font-bold text-lg hover:bg-yellow-300 transition shadow-lg">
                                    予約を確定する
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}