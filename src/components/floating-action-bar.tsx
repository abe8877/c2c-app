"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export const FloatingActionBar = ({
    items,
    className,
    hintedLink,
    hintMessage,
    activeLink,
}: {
    items: { name: string; link: string; icon?: React.ReactNode, onClick?: () => void }[];
    className?: string;
    hintedLink?: string;
    hintMessage?: string;
    activeLink?: string;
}) => {
    return (
        <div
            className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 w-max max-w-[95vw]", // Changed width to fit content and fit viewport
                className
            )}
            style={{ zIndex: 100 }} // Increased z-index
        >
            <AnimatePresence>
                {hintedLink && hintMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-indigo-600 text-white text-[11px] font-black rounded-xl shadow-2xl whitespace-nowrap z-[110] flex items-center gap-2"
                    >
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        {hintMessage}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-indigo-600" />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center justify-center gap-4 sm:gap-6 px-6 py-3 bg-black/80 backdrop-blur-md rounded-full shadow-2xl border border-white/10"
            >
                {items.map((item, idx) => {
                    const isHinted = hintedLink === item.link;
                    const content = (
                        <>
                            <span className={cn(
                                "text-white/70 group-hover:text-white transition-colors text-[11px] sm:text-sm font-bold flex items-center gap-1 sm:gap-2 whitespace-nowrap",
                                (activeLink === item.link || isHinted) && "text-white"
                            )}>
                                {item.icon}
                                <span>{item.name}</span>
                            </span>
                            {/* ホバー時またはアクティブ時の下線アニメーション */}
                            <span className={cn(
                                "absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] bg-indigo-500 transition-all rounded-full",
                                activeLink === item.link ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100",
                                isHinted && "bg-yellow-400"
                            )} />
                        </>
                    );

                    if (item.onClick) {
                        return (
                            <button
                                key={idx}
                                onClick={item.onClick}
                                className={cn(
                                    "relative flex items-center justify-center group py-1",
                                    isHinted && "animate-pulse"
                                )}
                            >
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={item.link}
                            className={cn(
                                "relative flex items-center justify-center group py-1",
                                isHinted && "animate-pulse"
                            )}
                        >
                            {content}
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
};