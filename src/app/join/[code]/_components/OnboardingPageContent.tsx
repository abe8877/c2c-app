// src/app/join/[code]/_components/OnboardingPageContent.tsx
"use client";

import { useState } from 'react';
import { OnboardingForm } from './OnboardingForm';
import { Sparkles } from 'lucide-react';

type Lang = 'en' | 'ja';

const dict = {
    en: {
        invitation: "Confidential Invitation",
        welcome: "Welcome,",
        heroDesc: (handle: string, vibe: string) => (
            <>
                We discovered your perspective via your unique vision. <br />
                Selected brands in Tokyo are seeking <span className="text-white font-medium border-b border-zinc-700 pb-0.5">{vibe}</span> creators of your caliber.
            </>
        ),
        openApp: "Open Application",
        becomeInsider: "Become an INSIDER.",
        applyDesc: (
            <>
                Join our curated community of high-engagement creators.<br />
                Your perspective matters to the world's finest brands.
            </>
        )
    },
    ja: {
        invitation: "限定招待状",
        welcome: "ようこそ、",
        heroDesc: (handle: string, vibe: string) => (
            <>
                あなたの卓越した感性と視点を高く評価し、特別に招待いたしました。<br />
                東京の厳選されたブランドが、<span className="text-white font-medium border-b border-zinc-700 pb-0.5">{vibe}</span>な世界観を持つあなたを求めています。
            </>
        ),
        openApp: "オープン申請",
        becomeInsider: "INSIDER. になる",
        applyDesc: (
            <>
                エンゲージメントの高いクリエイターのための、厳選されたコミュニティ。<br />
                あなたの独自の世界観が、世界屈指のブランドにとって価値になります。
            </>
        )
    }
};

export function OnboardingPageContent({ 
    creator, 
    offer, 
    isApplyMode = false 
}: { 
    creator: any, 
    offer?: any, 
    isApplyMode?: boolean 
}) {
    const [lang, setLang] = useState<Lang>('ja');
    const t = dict[lang];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white font-sans">
            {/* --- Language Toggle --- */}
            <div className="fixed top-6 right-6 z-50 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center gap-1 shadow-2xl">
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

            <section className={`relative ${isApplyMode ? 'h-[40vh]' : 'h-[50vh]'} flex flex-col justify-end p-8 border-b border-white/5`}>
                <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
                    {creator.scouted_video_url ? (
                        <video src={creator.scouted_video_url} className="w-full h-full object-cover grayscale brightness-50" muted autoPlay loop playsInline />
                    ) : (
                        <img src="/images/premium_creators.png" className="w-full h-full object-cover grayscale brightness-50" />
                    )}
                </div>

                <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
                    <p className="text-[10px] tracking-[0.3em] font-medium text-zinc-500 uppercase mb-6">
                        {isApplyMode ? t.openApp : t.invitation}
                    </p>
                    <h1 className="text-5xl md:text-7xl font-light font-playfair tracking-tight mb-4">
                        {isApplyMode ? (
                            <>{lang === 'en' ? "Become an " : ""}<span className="italic">INSIDER.</span>{lang === 'ja' ? " になる" : ""}</>
                        ) : (
                            <>{t.welcome} <span className="italic">@{creator.tiktok_handle}</span></>
                        )}
                    </h1>
                    <div className="text-sm md:text-base text-zinc-400 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
                        {isApplyMode ? t.applyDesc : t.heroDesc(creator.tiktok_handle, creator.vibe_tags?.[0] || 'Exclusive')}
                    </div>
                </div>
            </section>

            <section className="max-w-xl mx-auto px-8 py-16">
                <OnboardingForm creator={creator} offer={offer} isApplyMode={isApplyMode} initialLang={lang} />
            </section>
        </div>
    );
}
