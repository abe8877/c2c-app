"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, MessageSquare, Video, X, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function OnboardingModal({
    controlledOpen,
    onControlledClose
}: {
    controlledOpen?: boolean;
    onControlledClose?: () => void;
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const [userId, setUserId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            // 既にコントロールされている（手動で開かれた）場合は自動チェックをスキップ
            if (controlledOpen !== undefined) return;

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
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
            icon: <Sparkles className="w-5 h-5 text-amber-500" />,
            title: "1. 店舗分析 & マッチング",
            desc: "店舗情報のURLを入力するだけで、貴店と相性の良いインバウンドクリエイターを素早くご提示します。",
            color: "bg-amber-50 border-amber-100"
        },
        {
            icon: <Send className="w-5 h-5 text-blue-500" />,
            title: "2. オファー送信",
            desc: "気になるクリエイターを選択して、案件オファーを送信して下さい。翻訳機能やテンプレを使って簡単に条件交渉が可能です。",
            color: "bg-blue-50 border-blue-100"
        },
        {
            icon: <MessageSquare className="w-5 h-5 text-teal-500" />,
            title: "3. 来店日程の確定・撮影実施",
            desc: "マッチング成立後チャットが開通するので、来店日程やその他の要望があればご調整下さい（トラブル防止の為、メッセージの内容は運営が確認できます）。",
            color: "bg-teal-50 border-teal-100"
        },
        {
            icon: <Video className="w-5 h-5 text-purple-500" />,
            title: "4. 動画納品から依頼完了まで",
            desc: "動画の制作状況は「Asset Hub」から確認できます。納品された動画を確認して承認すると依頼が完了し、動画データのダウンロードや投稿された動画のチェックができるようになります。",
            color: "bg-purple-50 border-purple-100"
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
                        className="absolute inset-0 bg-stone-900/80 backdrop-blur-xl"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="bg-white sm:rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.3)] w-full max-w-2xl relative z-10 overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[95vh]"
                    >
                        {/* Premium Header with Background Pattern */}
                        <div className="bg-[#1A1A1A] px-10 pt-12 pb-10 text-white relative overflow-hidden shrink-0">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] rotate-12" />
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[100px] rounded-full -mr-20 -mt-20" />

                            <button onClick={handleClose} className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all border border-white/10 z-20">
                                <X className="w-6 h-6" />
                            </button>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="text-teal-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Start Your Journey
                                </div>
                                <h2 className="text-4xl font-black mb-3 tracking-tight leading-none">
                                    Welcome to INSIDERS.
                                </h2>
                            </motion.div>
                        </div>

                        {/* Content (Steps) with Improved Layout */}
                        <div className="px-10 py-10 overflow-y-auto flex-1 space-y-8 scrollbar-hide">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] bg-stone-100 flex-1" />
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] whitespace-nowrap">サービス利用の流れ</span>
                                <div className="h-[2px] bg-stone-100 flex-1" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-4">
                                {steps.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        className={`group relative p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px] ${step.color} cursor-default`}
                                    >
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-stone-900 text-lg mb-2 tracking-tight">{step.title}</h3>
                                            <p className="text-xs text-stone-500 font-bold leading-relaxed">{step.desc}</p>
                                        </div>
                                        <div className="absolute top-6 right-6 text-[40px] font-black text-black/5 leading-none select-none">
                                            {idx + 1}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* High-Impact Footer Action */}
                        <div className="p-10 border-t border-stone-100 bg-white shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClose}
                                className="w-full bg-teal-600 text-white font-black text-md py-6 rounded-[2rem] shadow-[0_20px_40px_rgba(13,148,136,0.3)] hover:bg-teal-700 hover:shadow-[0_24px_48px_rgba(13,148,136,0.4)] transition-all flex items-center justify-center gap-4 group"
                            >
                                クリエイターマッチングを開始する
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

