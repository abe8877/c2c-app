"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Zap, Wallet, Building2, Star, PlayCircle, Check, Globe, TrendingUp, Target, Activity, Send, ChevronDown, Flame, Award } from 'lucide-react';

// --- i18n Dictionary ---
const dict = {
    en: {
        hero: {
            badge: "For Tier S/A Creators",
            title1: "The world seeks buzz.",
            title2: "We seek your ",
            titleHighlight: "truth.",
            desc: "Tired of mass-produced PR campaigns judged only by follower counts? INSIDERS. is an invite-only network connecting your aesthetic (VIBE) with local Japanese hidden gems that seek your authentic truth.",
            cta: "ENTER THE INSIDERS."
        },
        benefit: {
            title: "The Perfect Match, Zero Friction.",
            desc: "You create stunning content, but get overlooked because of follower metrics. We fix that mismatch with AI.",
            points: [
                {
                    title: "No More \"Follower Count\" Game",
                    desc: "Brands send offers based on your VIBE (aesthetic and tone), not your vanity metrics. Your style is your currency."
                },
                {
                    title: "Aligned Expectations",
                    desc: "Our partners seek permanent assets, not fleeting buzz. No unreasonable revisions or forced scripts that ruin your feed."
                },
                {
                    title: "Local Hidden Gems",
                    desc: "Receive direct offers from authentic Wagyu restaurants, retro bathhouses, and hidden bars that you actually want to introduce to the world."
                }
            ]
        },
        transparency: {
            badge: "Complete Transparency",
            title: "How We Match You",
            desc: "We never sell your 'follower count'. Our AI analyzes the brand's unique VIBE and recommends you as the creator with the perfect aesthetic. That's why painful mismatches never happen.",
            advUi: "ADVERTISER UI",
            creatorUi: "CREATOR UI"
        },
        objection: {
            title1: "Focus on your art.",
            title2: "We handle the friction.",
            items: [
                {
                    title: "No Exclusivity",
                    desc: "We don't tie you down. You are completely free to work with other platforms or take direct clients while being on INSIDERS."
                },
                {
                    title: "Guaranteed Payment",
                    desc: "Zero risk of unpaid invoices or late payments from direct clients. INSIDERS. guarantees and processes your payment securely."
                },
                {
                    title: "Zero Negotiation",
                    desc: "No stressful rate negotiations. Budgets and terms are pre-negotiated by us. You simply click 'Accept' if the offer feels right."
                },
                {
                    title: "Quality Clients Only",
                    desc: "You will only receive offers from vetted, high-literacy brands and local gems that respect your art and understand the value of VIBE."
                }
            ]
        },
        gamification: {
            badge: "Creator Ecosystem",
            title: "Optimize your impact. Keep your style.",
            desc: "You don't need to change what makes you unique. Simply follow INSIDERS.' AI hints to optimize your portfolio, and our algorithm will maximize your visibility to attract the perfect offers.",
            items: [
                {
                    icon: <Flame className="w-5 h-5 text-white" />,
                    title: "The 'HOT' Momentum",
                    desc: "Don't let the buzz cool down. Add a similar video within a week of a hit, and our AI will grant you the [🔥 HOT TRENDING] badge, boosting you to the top of advertiser search results."
                },
                {
                    icon: <Award className="w-5 h-5 text-white" />,
                    title: "'VERIFIED' Authority",
                    desc: "Maintain a sub-24h response rate and aesthetic consistency. Earning the [Tier S / VERIFIED] title isn't just a badge—it's your ultimate proof of quality to top Japanese brands."
                },
                {
                    icon: <Sparkles className="w-5 h-5 text-white" />,
                    title: "AI Curation Feedback",
                    desc: "Even if an offer doesn't match, you're never left in the dark. Our AI provides personalized feedback on 'Missing VIBE' and next steps, acting as your dedicated data-driven producer."
                }
            ]
        },
        cta: {
            title: "Stop Pitching. Start Accepting.",
            desc: "No more cold DMs. No more rate negotiations. Just create your best work.",
            btn: "ENTER THE INSIDERS.",
            note: "*Currently invite-only. Accounts are issued only to creators who pass our curation."
        }
    },
    ja: {
        hero: {
            badge: "Tier S/A クリエイター専用",
            title1: "世間はバズを求める。",
            title2: "私たちは、あなたの",
            titleHighlight: "真実を求めている。",
            desc: "フォロワー数だけで評価される量産型のPR案件に疲れていませんか？ INSIDERS.は、あなたが愛する「日本のローカルな真実（Hidden Gem）」を求める名店と、あなたの審美眼（VIBE）を繋ぐ招待制ネットワークです。",
            cta: "ENTER THE INSIDERS."
        },
        benefit: {
            title: "期待値が完全に一致した、ストレスのないクリエイティブを。",
            desc: "素晴らしい発信をしているのに、フォロワー数が足りないだけで評価されない。私たちはその理不尽なミスマッチをAIで解消します。",
            points: [
                {
                    title: "フォロワー数至上主義の終わり",
                    desc: "企業はあなたのフォロワー数ではなく、あなたの「VIBE（映像のトーンや美学）」に惚れ込んでオファーを出します。あなたのスタイルそのものが価値になります。"
                },
                {
                    title: "期待値の完全一致",
                    desc: "INSIDERS.に参加する広告主は、「量産型のバズ」ではなく「永続的な資産」を求めています。理不尽な修正要求や、あなたの世界観に合わない台本を強要されることはありません。"
                },
                {
                    title: "ローカルな名店からの直接オファー",
                    desc: "誰もが知るチェーン店ではなく、あなたが本当に世界に紹介したいと思える、こだわりの和牛レストランやローカルな銭湯、隠れ家バーからのオファーが直接届きます。"
                }
            ]
        },
        transparency: {
            badge: "完全な透明性",
            title: "私たちがあなたをどう推薦するか",
            desc: "私たちはあなたの「フォロワー数」を企業に売ることはしません。独自のAIが企業の強み（VIBE）を解析し、それに最もマッチする審美眼を持つクリエイターとしてあなたを推薦します。だからこそ、無理な案件やミスマッチは起こりません。",
            advUi: "広告主の画面",
            creatorUi: "あなたの画面"
        },
        objection: {
            title1: "あなたは創るだけ。",
            title2: "すべての摩擦は私たちが吸収する。",
            items: [
                {
                    title: "専属契約なし (No Exclusivity)",
                    desc: "あなたの活動を縛ることは一切ありません。INSIDERS.に登録しながら、他の案件やプラットフォームを利用することも完全に自由です。"
                },
                {
                    title: "報酬完全保証 (Guaranteed Payment)",
                    desc: "企業との直接のやり取りによる未払い・遅延リスクはゼロです。案件完了後、INSIDERS.がクリエイターへ確実・迅速に報酬をお支払いします。"
                },
                {
                    title: "交渉ストレスゼロ (Zero Negotiation)",
                    desc: "面倒な単価交渉は発生しません。予算や条件はすべてプラットフォーム側で調整済み。「この条件で受けるか」をボタン1つで決めるだけです。"
                },
                {
                    title: "優良企業のみ (Quality Clients Only)",
                    desc: "INSIDERS.の理念（VIBEの資産化）に賛同し、事前審査を通過したリテラシーの高いブランド・名店からのオファーのみが届きます。"
                }
            ]
        },
        gamification: {
            badge: "Creator Ecosystem",
            title: "スタイルはそのままに、見せ方をハックせよ。",
            desc: "あなたの活動方針を変える必要はありません。INSIDERS.が提示する「AIのヒント」に従ってポートフォリオを最適化するだけで、アルゴリズムがあなたの価値を最大化し、最適なオファーを引き寄せます。",
            items: [
                {
                    icon: <Flame className="w-5 h-5 text-white" />,
                    title: "The 'HOT' Momentum (トレンドの最大化)",
                    desc: "「バズの熱」を逃さないでください。過去に伸びた動画と同系統の作品を1週間以内に追加するだけで、AIが【🔥 HOT TRENDING】を付与し、広告主の検索結果の最上位へ自動ブーストします。"
                },
                {
                    icon: <Award className="w-5 h-5 text-white" />,
                    title: "'VERIFIED' Authority (プロフェッショナルの証明)",
                    desc: "24時間以内の返信率と、世界観の一貫性を維持してください。基準をクリアして【Tier S / VERIFIED】の称号を獲得することは、日本のトップブランドに対する絶対的な品質証明（名刺）になります。"
                },
                {
                    icon: <Sparkles className="w-5 h-5 text-white" />,
                    title: "AI Curation Feedback (専属プロデュース)",
                    desc: "オファーが見送りになった場合でも、単なる「不採用」では終わりません。AIが「不足していたVIBE」や「次回の最適解」を個別にフィードバックし、専属プロデューサーとしてあなたの成長をサポートします。"
                }
            ]
        },
        cta: {
            title: "営業は終わり。オファーを受け取ろう。",
            desc: "面倒な単価交渉も、DMでの営業も、もう必要ありません。あなたは極上のコンテンツを作るだけ。",
            btn: "ENTER THE INSIDERS.",
            note: "※現在は招待制（Waitlist）となっております。審査を通過した方のみアカウントが発行されます。"
        }
    }
};

type Lang = 'en' | 'ja';

export default function CreatorJoinLandingPage() {
    const [lang, setLang] = useState<Lang>('en');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const t = dict[lang];

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteCode.trim()) {
            window.location.href = `/join/${inviteCode.trim()}`;
        }
    };

    return (
        <div className="min-h-screen bg-black text-slate-50 font-sans selection:bg-white selection:text-black">

            {/* --- Header Actions (Language Toggle & Login) --- */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
                {/* Log in Button */}
                <Link
                    href="/creators/login"
                    className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all shadow-2xl"
                >
                    {lang === 'en' ? 'Log in' : 'ログイン'}
                </Link>

                {/* --- Language Toggle --- */}
                <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center gap-1 shadow-2xl">
                    <button
                        onClick={() => setLang('en')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLang('ja')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'ja' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                        JP
                    </button>
                </div>
            </div>

                {/* 1. HERO SECTION */}
                <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-block border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-8 text-slate-300">
                        {t.hero.badge}
                    </div>
                    <h1 className={`text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6 ${lang === 'ja' ? 'font-serif' : ''}`}>
                        {t.hero.title1}<br />
                        {t.hero.title2}<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-100">{t.hero.titleHighlight}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light mb-12 leading-relaxed">
                        {t.hero.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-bold tracking-wide hover:bg-slate-200 transition-colors duration-300 flex items-center justify-center gap-2 border border-white"
                        >
                            {lang === 'en' ? 'Have an invitation code?' : '招待コードをお持ちの方'} <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                            href="/join/apply"
                            className="w-full sm:w-auto bg-transparent text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2 border border-white/20"
                        >
                            {lang === 'en' ? 'Register Application' : '登録申請をする'}
                        </Link>
                    </div>
                </section>

                {/* 2. THE MISMATCH & BENEFIT */}
                <section className="py-24 bg-zinc-950 px-6 border-y border-white/5">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                {t.benefit.title}
                            </h2>
                            <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                                {t.benefit.desc}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {t.benefit.points.map((point, idx) => (
                                <div key={idx} className="bg-black border border-white/5 p-8 rounded-3xl">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6 text-white">
                                        {idx === 0 && <Star className="w-5 h-5" />}
                                        {idx === 1 && <ShieldCheck className="w-5 h-5" />}
                                        {idx === 2 && <Globe className="w-5 h-5" />}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-4">{point.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-light">{point.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. TRANSPARENCY (Dual UI Mockup Full Version) */}
                <section className="py-24 px-6 max-w-6xl mx-auto overflow-hidden">
                    <div className="text-center mb-16">
                        <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">{t.transparency.badge}</h2>
                        <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-6">{t.transparency.title}</h3>
                        <p className="text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                            {t.transparency.desc}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-center gap-10 lg:gap-16 items-center lg:items-start pb-10">

                        {/* Advertiser UI Mockup */}
                        <div className="flex flex-col items-center">
                            <div className="text-[10px] font-bold text-indigo-400 mb-4 uppercase tracking-widest opacity-80 flex items-center gap-2">
                                <Building2 className="w-3 h-3" /> {t.transparency.advUi}
                            </div>
                            <div className="relative w-[260px] sm:w-[280px] h-[560px] sm:h-[600px] bg-slate-50 rounded-[2.5rem] border-[6px] border-[#f8fafc] shadow-2xl overflow-hidden flex flex-col group ring-1 ring-slate-200">
                                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-white text-slate-900 pb-10">

                                    {/* Screen 0: Search Window */}
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

                                    {/* Screen 1: Analysis Complete */}
                                    <div className="p-6 text-center border-b border-slate-50">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-100 text-emerald-500">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 italic tracking-tighter mb-2">ANALYSIS COMPLETE</h4>
                                        <div className="flex flex-wrap justify-center gap-1.5 mb-8 mt-4">
                                            {['#和モダン', '#隠れ家', '#自然光', '#シズル感', '#行列'].map(tag => (
                                                <span key={tag} className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[9px] font-bold text-slate-700 shadow-sm">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mb-5 flex items-center justify-center gap-2">
                                            推薦クリエイター：
                                            <span className="text-2xl font-black text-slate-900 border-b-2 border-yellow-400 leading-none">24名</span>
                                        </div>
                                    </div>

                                    {/* Screen 2: Creator Catalog */}
                                    <div className="p-5 bg-slate-50/50 border-b border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-black text-slate-900">CREATOR CATALOG</span>
                                                <div className="bg-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">AI選定</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="relative aspect-[9/16] rounded-[24px] overflow-hidden shadow-xl border-4 border-white">
                                                <div className="absolute inset-0 bg-slate-800">
                                                    <img src="https://images.unsplash.com/photo-1515003197210-ce9c856873c2?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-80" alt="Creator" />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10 z-10" />
                                                <div className="absolute bottom-4 left-4 z-20 text-white">
                                                    <div className="text-lg font-black tracking-tight mb-1 uppercase">Elena Tokyo</div>
                                                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> VERIFIED MATCH</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Screen 3: Offer Selection */}
                                    <div className="p-5 bg-white border-b border-slate-100 flex flex-col gap-5 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] text-amber-500 font-bold mb-1 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" /> オファー作成
                                                </div>
                                                <h5 className="text-[13px] font-black text-slate-900">Elena Tokyoさんを招待</h5>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                                <span>🎁</span> 提供プラン
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-3 pb-4 rounded-xl bg-white border-[1.5px] border-slate-900 relative shadow-sm">
                                                    <div className="h-2"></div>
                                                    <div className="text-[9px] text-slate-500 mt-2 font-medium">無料ご招待</div>
                                                    <div className="absolute top-2.5 right-2.5 flex items-center justify-center w-3.5 h-3.5 bg-slate-900 rounded-full">
                                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                    </div>
                                                </div>
                                                <div className="p-3 pb-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                                    <div className="text-[10px] font-bold text-slate-900 mb-1">報酬あり</div>
                                                    <div className="text-[9px] text-slate-500 font-medium">¥50,000</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-1 w-full py-4 bg-black text-white rounded-2xl text-[10px] font-bold flex items-center justify-center gap-2 shadow-xl">
                                            <Send className="w-3.5 h-3.5" /> 招待状を送る
                                        </div>
                                    </div>

                                    {/* Screen 4: Offer Sent */}
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
                                <div className="absolute bottom-4 right-4 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[9px] font-bold shadow-lg animate-bounce hidden lg:block z-20">
                                    Scroll ↓
                                </div>
                            </div>
                        </div>

                        {/* Creator UI Mockup */}
                        <div className="flex flex-col items-center mt-10 lg:mt-0">
                            <div className="text-[10px] font-bold text-rose-400 mb-4 uppercase tracking-widest opacity-80 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> {t.transparency.creatorUi}
                            </div>
                            <div className="relative w-[260px] sm:w-[280px] h-[560px] sm:h-[600px] bg-[#0a0a0a] rounded-[2.5rem] border-[6px] border-[#1f2229] shadow-2xl overflow-hidden ring-1 ring-white/10">
                                <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide p-4 pb-12 text-slate-50">

                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-6 mt-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <div className="text-[10px] text-slate-400">Welcome back,</div>
                                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-0.5">
                                                    <Check className="w-2 h-2" strokeWidth={3} /> VERIFIED
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold tracking-wide">Elena Tokyo</div>
                                        </div>
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-lg" alt="Avatar" />
                                    </div>

                                    {/* Pending Offer */}
                                    <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-[#1a1a1a] to-[#0a0a0a] border border-amber-500/30 p-4 shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)] group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
                                        <div className="flex items-start justify-between mb-3 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shrink-0">
                                                    <span className="text-amber-500 text-lg animate-pulse">🎁</span>
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded inline-block mb-1">1 Pending Offer</div>
                                                    <div className="text-sm font-bold text-white tracking-wide">WAGYU OMAKASE 凛</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-black/60 rounded-xl p-3 border border-white/5 relative z-10 mb-4 backdrop-blur-sm">
                                            <div className="text-[9px] text-slate-400 mb-0.5 uppercase tracking-wider">Offer Details</div>
                                            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                                <Sparkles className="w-3 h-3" /> 無料ご招待 ＋ ¥50,000
                                            </div>
                                        </div>
                                        <button className="w-full bg-amber-500 text-black py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors relative z-10 shadow-lg group-hover:shadow-amber-500/20">
                                            <ShieldCheck className="w-4 h-4" /> Unlock & Accept
                                        </button>
                                    </div>

                                    {/* Exclusive Invites */}
                                    <div className="mb-6">
                                        <h3 className="text-[12px] font-bold mb-4 px-1">Exclusive Invites</h3>
                                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x">
                                            <div className="min-w-[190px] h-[260px] rounded-2xl relative overflow-hidden flex flex-col justify-end p-3.5 shadow-lg border border-white/10 snap-center group">
                                                <img src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=500&q=80" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Wagyu" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10"></div>
                                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[8px] text-white font-bold tracking-wider border border-white/10">FINE DINING</div>
                                                <div className="relative z-10">
                                                    <h4 className="font-bold text-sm mb-1 leading-tight tracking-wide">WAGYU OMAKASE 凛</h4>
                                                    <div className="text-yellow-500 text-[9px] mb-4 flex items-center gap-1 font-medium">
                                                        <Star className="w-2.5 h-2.5 fill-current" /> Elegant & Traditional
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Asset History (Restored) */}
                                    <div>
                                        <h3 className="text-[12px] font-bold mb-4 px-1">Asset History</h3>
                                        <div className="space-y-3">
                                            <div className="bg-[#121212] border border-white/5 rounded-xl p-3.5 flex justify-between items-center shadow-md">
                                                <div>
                                                    <div className="text-[11px] font-bold mb-1 tracking-wide">Sushi Ginza Onodera</div>
                                                    <div className="text-[8px] text-slate-500">2024-03-01</div>
                                                </div>
                                                <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-[7px] font-black tracking-widest uppercase">Approved</div>
                                            </div>
                                            <div className="bg-[#121212] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-md">
                                                <div className="p-3.5 flex justify-between items-center border-b border-white/5">
                                                    <div>
                                                        <div className="text-[11px] font-bold mb-1 tracking-wide">Harajuku Kawaii Cafe</div>
                                                        <div className="text-[8px] text-slate-500">2024-02-15</div>
                                                    </div>
                                                    <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-1 rounded text-[7px] font-black tracking-widest uppercase">Rejected</div>
                                                </div>
                                                <div className="px-3 py-2.5 bg-[#080808] flex items-center justify-between cursor-pointer">
                                                    <div className="text-[9px] text-yellow-500/90 flex items-center gap-1.5 font-medium">
                                                        <Sparkles className="w-3 h-3" /> AI Insight
                                                    </div>
                                                    <ChevronDown className="w-3 h-3 text-slate-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="absolute bottom-4 right-4 bg-rose-500/90 text-white px-3 py-1.5 rounded-full text-[9px] font-bold shadow-lg animate-bounce hidden lg:block z-20">
                                    Scroll ↓
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. OBJECTION HANDLING */}
                <section className="py-24 px-6 border-t border-white/5 bg-black">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-16">
                            {t.objection.title1} <br className="md:hidden" />
                            <span className="text-slate-500">{t.objection.title2}</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {t.objection.items.map((item, idx) => (
                                <div key={idx} className="p-8 border border-white/10 rounded-3xl bg-zinc-950 hover:bg-zinc-900 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                        {idx === 0 && <Zap className="w-5 h-5 text-white" />}
                                        {idx === 1 && <Wallet className="w-5 h-5 text-white" />}
                                        {idx === 2 && <ShieldCheck className="w-5 h-5 text-white" />}
                                        {idx === 3 && <Sparkles className="w-5 h-5 text-white" />}
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 text-white">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. GAMIFICATION / PROFILE OPTIMIZATION */}
                <section className="py-24 px-6 border-t border-white/5 bg-zinc-950">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-3">{t.gamification.badge}</h2>
                            <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-6">{t.gamification.title}</h3>
                            <p className="text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                                {t.gamification.desc}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {t.gamification.items.map((item, idx) => (
                                <div key={idx} className="p-8 border border-white/10 rounded-3xl bg-black hover:border-emerald-500/30 transition-colors group">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. CTA SECTION */}
                <section className="py-32 px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        {t.cta.title}
                    </h2>
                    <p className="text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">{t.cta.desc}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-full font-bold tracking-widest text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
                        >
                            {lang === 'en' ? 'I HAVE AN INVITATION CODE' : '招待コードをお持ちの方'} <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                            href="/join/apply"
                            className="w-full sm:w-auto bg-transparent text-white px-10 py-5 rounded-full font-bold tracking-widest text-sm hover:bg-white/5 transition-all duration-300 border border-white/20 flex items-center justify-center"
                        >
                            {lang === 'en' ? 'APPLY FOR REGISTRATION' : '登録申請をする'}
                        </Link>
                    </div>
                    <p className="mt-6 text-xs text-slate-500 font-light max-w-md mx-auto">
                        {t.cta.note}
                    </p>
                </section>

                {/* Invite Code Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div
                            className="absolute inset-0"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <div className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-black mb-2 text-white text-center">
                                {lang === 'en' ? 'Enter Invitation Code' : '招待コード入力'}
                            </h2>
                            <p className="text-slate-400 text-sm text-center mb-6">
                                {lang === 'en' ? 'Please enter the code you received.' : '受け取った招待コードを入力してください。'}
                            </p>
                            <form onSubmit={handleInviteSubmit} className="flex flex-col gap-4">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. D277KA3X"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-center text-white font-black tracking-widest uppercase focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    {lang === 'en' ? 'ENTER' : '送信する'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            );
}