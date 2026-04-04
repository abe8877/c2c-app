// src/components/onboarding/TermsOfCuration.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface TermsOfCurationProps {
}

export default function TermsOfCuration({ }: TermsOfCurationProps) {
    const [agreements, setAgreements] = useState({
        asset: false,
        integrity: false,
        curation: false,
        legal: false,
    });

    const allChecked = Object.values(agreements).every(Boolean);

    const toggleAgreement = (key: keyof typeof agreements) => {
        setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const manifestos = [
        {
            id: 'asset',
            title: 'Asset Utilization',
            desc: 'I agree that the content I provide is not a temporary trend, but a permanent business asset for the brand.',
            jp: '提供するコンテンツが一時的な消費ではなく、ブランドの永続的な資産として活用されることに同意します。',
        },
        {
            id: 'integrity',
            title: 'Professional Integrity',
            desc: 'I commit to maintaining the standard of a Tier S/A creator, delivering authentic value without relying on superficial virality.',
            jp: '表層的なバズに依存せず、Tier S/Aクリエイターとして真の価値を届けるプロ意識を誓約します。',
        },
        {
            id: 'curation',
            title: 'Transparent Curation',
            desc: 'I understand that assignments are driven by VIBE matching and quality, not just follower metrics.',
            jp: 'アサインメントがフォロワー数ではなく、ブランドのVIBEとの適合性と品質によって決定されることを理解します。',
        },
    ];

    return (
        <div className="max-w-xl mx-auto px-6 py-12 text-slate-50 font-sans selection:bg-white selection:text-black">

            {/* Header */}
            <div className="mb-12">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-3">The Manifesto.</h2>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                    INSIDERS.へようこそ。プラットフォームへ参加する前に、私たちの理念への宣誓と、法的規約への同意をお願いします。
                </p>
            </div>

            {/* 1. Manifesto (Vibe Agreement) */}
            <div className="space-y-6 mb-10">
                {manifestos.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 group cursor-pointer"
                        onClick={() => toggleAgreement(item.id as keyof typeof agreements)}
                    >
                        <div className={`mt-1 w-5 h-5 flex-shrink-0 flex items-center justify-center border transition-all duration-300 ${agreements[item.id as keyof typeof agreements]
                                ? 'bg-white border-white'
                                : 'bg-transparent border-white/30 group-hover:border-white/60'
                            }`}>
                            {agreements[item.id as keyof typeof agreements] && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold tracking-wide text-white mb-1">{item.title}</h3>
                            <p className="text-[11px] text-slate-300 font-light leading-relaxed mb-0.5">{item.desc}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{item.jp}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-10" />

            {/* 2. Legal Agreement (Terms & Privacy) */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Legal & Compliance</span>
                </div>

                <div
                    className="flex items-start gap-4 group cursor-pointer"
                    onClick={() => toggleAgreement('legal')}
                >
                    <div className={`mt-1 w-5 h-5 flex-shrink-0 flex items-center justify-center border transition-all duration-300 ${agreements.legal ? 'bg-white border-white' : 'bg-transparent border-white/30 group-hover:border-white/60'
                        }`}>
                        {agreements.legal && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                    </div>
                    <div>
                        <p className="text-xs text-slate-300 font-light leading-relaxed mb-1">
                            I have read and agree to the{' '}
                            <Link href="/legal/terms" target="_blank" className="text-white font-medium underline underline-offset-4 hover:text-slate-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/legal/privacy" target="_blank" className="text-white font-medium underline underline-offset-4 hover:text-slate-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                                Privacy Policy
                            </Link>.
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                            利用規約およびプライバシーポリシーを確認し、法的な拘束力を持つこれらに同意します。
                        </p>
                    </div>
                </div>
            </div>

            {/* Submit Button (Animated) */}
            <motion.div
                initial={false}
                animate={{
                    opacity: allChecked ? 1 : 0.4,
                    y: allChecked ? 0 : 5
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <button
                    type="submit"
                    disabled={!allChecked}
                    className={`w-full py-4 text-xs font-black tracking-widest uppercase transition-all duration-500 flex items-center justify-center gap-2 ${allChecked
                            ? 'bg-white text-black shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:bg-slate-200'
                            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                        }`}
                >
                    ENTER THE INSIDERS.
                </button>
            </motion.div>

        </div>
    );
}