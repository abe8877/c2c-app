"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, MessageSquareText, Video, X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            // 1. ログイン中のユーザーを取得
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
                // 2. shopsテーブルからフラグを取得
                const { data: shop } = await supabase
                    .from('shops')
                    .select('has_seen_onboarding')
                    .eq('id', user.id)
                    .single();

                // 3. まだ見ていなければモーダルを開く
                if (shop && shop.has_seen_onboarding === false) {
                    setIsOpen(true);
                }
            }
        };
        checkOnboardingStatus();
    }, [supabase]);

    const handleClose = async () => {
        setIsOpen(false);
        if (userId) {
            // 4. 閉じた瞬間にDBのフラグを true に更新
            await supabase
                .from('shops')
                .update({ has_seen_onboarding: true })
                .eq('id', userId);
        }
    };

    const steps = [
        {
            icon: <Sparkles className="w-5 h-5 text-amber-500" />,
            title: "1. VIBE解析 & 検索",
            desc: "AIが貴店と相性の良いインバウンドクリエイターを世界中から抽出し、カタログ化します。",
            color: "bg-amber-50 border-amber-100"
        },
        {
            icon: <Send className="w-5 h-5 text-blue-500" />,
            title: "2. オファー送信",
            desc: "気になるクリエイターに「招待オファー」をワンタップで送信。複雑な条件交渉は不要です。",
            color: "bg-blue-50 border-blue-100"
        },
        {
            icon: <MessageSquareText className="w-5 h-5 text-teal-500" />,
            title: "3. AIコンシェルジュと日程確定",
            desc: "マッチング成立後、専用チャットが開通。言葉の壁はAIが自動翻訳し、日程と要望をスマートに確定させます。",
            color: "bg-teal-50 border-teal-100"
        },
        {
            icon: <Video className="w-5 h-5 text-indigo-500" />,
            title: "4. 来店＆動画アセット納品",
            desc: "クリエイターが来店・撮影。納品されたPR動画は「Asset Hub」で管理し、二次利用も可能です。",
            color: "bg-indigo-50 border-indigo-100"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 px-8 py-6 text-white relative">
                            <button onClick={handleClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                                Welcome to INSIDERS. <span className="text-teal-400">✨</span>
                            </h2>
                            <p className="text-slate-300 text-sm">
                                バズを集客資産に変える、インバウンド特化型マッチングプラットフォームへようこそ。
                            </p>
                        </div>

                        {/* Content (Steps) */}
                        <div className="p-8 overflow-y-auto">
                            <p className="text-sm font-bold text-slate-900 mb-6">ご利用開始から動画納品までの4ステップ</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {steps.map((step, idx) => (
                                    <div key={idx} className={`p-5 rounded-xl border ${step.color} flex flex-col gap-3`}>
                                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h3>
                                            <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={handleClose}
                                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-teal-500/20"
                            >
                                クリエイターマッチングを開始する
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}