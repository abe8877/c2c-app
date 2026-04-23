"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AtSign, UserPlus, Smile, Target, X, ArrowRight, Search, LetterText, HeartHandshake, Smartphone, TrendingUp } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function OnboardingModal({
    controlledOpen,
    onControlledClose
}: {
    controlledOpen?: boolean;
    onControlledClose?: () => void;
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const [userId, setUserId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            if (controlledOpen === undefined) {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: shop } = await supabase
                    .from('shops')
                    .select('has_seen_onboarding')
                    .eq('id', user.id)
                    .single();

                if (shop && shop.has_seen_onboarding === false) {
                    setInternalOpen(true);
                }
            }
        };
        checkOnboardingStatus();
    }, [supabase, controlledOpen]);

    // モーダルが閉じられたときにステップをリセットする
    useEffect(() => {
        if (!isOpen) {
            setActiveStep(1);
        }
    }, [isOpen]);

    const handleClose = async () => {
        if (controlledOpen !== undefined) {
            onControlledClose?.();
        } else {
            setInternalOpen(false);
            if (userId) {
                await supabase
                    .from('shops')
                    .update({ has_seen_onboarding: true })
                    .eq('id', userId);
            }
        }
    };

    const steps = [
        {
            icon: <Search className="w-6 h-6 text-indigo-600" />,
            title: "1. 最適なアンバサダーとマッチング",
            desc: "まずは貴店のGoogleマップやインスタグラムのURLを入力してみてください。1,000組以上のリストから最適なアンバサダーを厳選して提案します。",
            color: "bg-indigo-50"
        },
        {
            icon: <HeartHandshake className="w-6 h-6 text-blue-600" />,
            title: "2. お気に入りの3名にオファーを送信",
            desc: "動画をチェックしてアンバサダーにオファーを送ってみましょう。テンプレから簡単に送信可能ですが、依頼理由を丁寧に記入すると受諾率が高まります。",
            color: "bg-blue-50"
        },
        {
            icon: <Smartphone className="w-6 h-6 text-teal-600" />,
            title: "3. 簡単なやり取りで案件進行",
            desc: "オファーが受諾されたらチャットで来店日程を決めて、あとは待つだけ。アンバサダーが来店して撮影を行い、動画投稿直前までスムーズに進めてくれます。",
            color: "bg-teal-50"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
            title: "4. 動画看板としてフル活用",
            desc: "納品された動画を承諾すると、アンバサダーのSNSに投稿されて依頼が完了します。Googleマップにも動画を掲載して、インバウンド来店を加速させましょう。",
            color: "bg-purple-50"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-[3rem] relative z-10 shadow-2xl flex flex-col overflow-hidden"
                    >
                        <button onClick={handleClose} className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-20">
                            <X size={20} />
                        </button>

                        {/* Header Section */}
                        <div className="px-8 pt-12 pb-6 text-center">
                            <div className="flex items-center justify-center gap-3 mb-10">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all duration-300">
                                    Step {activeStep} of {steps.length}
                                </span>
                                <div className="flex gap-1.5 items-center">
                                    {steps.map((_, i) => {
                                        const stepNum = i + 1;
                                        return (
                                            <div
                                                key={i}
                                                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${stepNum === activeStep ? 'w-8 bg-indigo-600' : 'w-1.5 bg-slate-200'
                                                    }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-indigo-600 font-bold text-sm tracking-tight">Welcome to INSIDERS.</h3>
                                <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-[1.3]">
                                    アンバサダーが貴店の魅力を世界に発信し<br />
                                    インバウンド来店を創出します！
                                </h2>
                            </div>
                        </div>

                        {/* Steps List */}
                        <div className="px-8 py-4 overflow-y-auto flex-1 space-y-6">
                            {steps.map((step, idx) => {
                                const stepNum = idx + 1;
                                const isActive = stepNum === activeStep;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{
                                            opacity: isActive ? 1 : 0.4,
                                            filter: isActive ? 'grayscale(0)' : 'grayscale(1)',
                                            x: 0,
                                            scale: isActive ? 1 : 0.98
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut"
                                        }}
                                        onClick={() => setActiveStep(stepNum)}
                                        className="flex gap-5 group cursor-pointer transition-all duration-300"
                                    >
                                        <div className="shrink-0 flex flex-col items-center">
                                            <div className={`w-14 h-14 aspect-square rounded-2xl ${step.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                {step.icon}
                                            </div>
                                            {idx < steps.length - 1 && (
                                                <div className="w-px h-full bg-slate-100 my-2" />
                                            )}
                                        </div>
                                        <div className="pb-4 pt-1">
                                            <h4 className="font-black text-slate-900 text-[15px] mb-1.5 leading-snug transition-colors group-hover:text-indigo-600">
                                                {step.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Footer Action */}
                        <div className="p-8 pb-10">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClose}
                                className="w-full bg-indigo-600 text-white font-black text-center text-[15px] py-5 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                            >
                                アンバサダーマッチングを開始
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}