"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import { analyzeAssetInsight } from "@/app/actions/analyze-asset-insight";

interface CreatorAiFeedbackProps {
    assetId: string;
    creatorId: string;
    shopId: string;
    shopName: string;
    shopRequirements: string[];
    creatorTags: string[];
}

export default function CreatorAiFeedback({
    assetId,
    creatorId,
    shopId,
    shopName,
    shopRequirements,
    creatorTags,
}: CreatorAiFeedbackProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [insight, setInsight] = useState<{
        creatorAiHint: string;
        missingTags: string[];
    } | null>(null);

    const handleToggle = () => {
        if (!isOpen && !insight && !isPending) {
            startTransition(async () => {
                try {
                    const result = await analyzeAssetInsight({
                        assetId,
                        creatorId,
                        shopId,
                        shopRequirements,
                        creatorTags,
                    });
                    if (result.success) {
                        setInsight({
                            creatorAiHint: result.insight.creatorAiHint,
                            missingTags: result.missingTags,
                        });
                        setIsOpen(true);
                    }
                } catch (error) {
                    console.error("AI Analysis failed:", error);
                }
            });
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="mt-2 border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/50">
            <button
                onClick={handleToggle}
                disabled={isPending}
                className="w-full px-4 py-3 flex items-center justify-between group hover:bg-zinc-900/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {isPending ? (
                        <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 text-teal-500" />
                    )}
                    <span className="text-xs font-bold text-zinc-300">
                        {isPending ? "分析中..." : insight ? "AIプロデューサーのアドバイス" : "✨ AIからの次回アドバイスを見る"}
                    </span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && insight && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-4 pb-4 space-y-4">
                            {/* Missing Tags */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block w-full mb-1">
                                    不足していたVibe:
                                </span>
                                {insight.missingTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded text-[10px] font-bold"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                                {insight.missingTags.length === 0 && (
                                    <span className="text-[10px] text-zinc-600 italic">Vibeの不一致はありませんでした（撮影スタイルの提案を確認してください）</span>
                                )}
                            </div>

                            {/* AI Hint */}
                            <div className="p-3 bg-teal-500/5 border border-teal-500/30 rounded-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <AlertCircle className="w-8 h-8 text-teal-500" />
                                </div>
                                <p className="text-xs leading-relaxed text-teal-50 font-medium relative z-10 whitespace-pre-line">
                                    {insight.creatorAiHint}
                                </p>
                            </div>

                            <p className="text-[10px] text-zinc-500 text-center pb-2 italic">
                                このアドバイスを反映して、次回のマッチングを成功させましょう。
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
