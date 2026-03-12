"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Target } from "lucide-react";

interface ShopUpsellBannerProps {
    upsellPlan: "AI_AUTO_TUNE" | "PREMIUM_BOOST" | "NONE";
    upsellMessage: string;
}

export default function ShopUpsellBanner({
    upsellPlan,
    upsellMessage,
}: ShopUpsellBannerProps) {
    if (upsellPlan === "NONE") return null;

    const planConfig = {
        AI_AUTO_TUNE: {
            title: "AI Auto-Tune (PRO)",
            icon: <Zap className="w-5 h-5 text-teal-400" />,
            cta: "AIオートチューンを有効化 (PRO)",
            color: "teal",
            price: "Monthly Subscription",
        },
        PREMIUM_BOOST: {
            title: "Premium Boost",
            icon: <Target className="w-5 h-5 text-amber-400" />,
            cta: "プレミアムブーストを使用 (+¥10,000)",
            color: "amber",
            price: "+¥10,000 / Match",
        },
    };

    const config = planConfig[upsellPlan as keyof typeof planConfig];

    return (
        <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            className="w-full mb-6"
        >
            <div className="relative p-6 rounded-3xl bg-slate-900 border border-teal-500/20 shadow-2xl overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-50" />

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors duration-700" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                                {config.icon}
                            </div>
                            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em]">
                                Optimization Suggestion
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight">
                            {config.title} でマッチング精度を向上
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            {upsellMessage}
                        </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative px-8 py-4 bg-teal-500 text-black font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all overflow-hidden group"
                        >
                            {/* Inner Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            {config.cta}
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            {config.price}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
