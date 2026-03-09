"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const FloatingActionBar = ({
    items,
    className,
}: {
    items: { name: string; link: string; icon?: React.ReactNode }[];
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2", // 画面下部中央固定
                className
            )}
            style={{ zIndex: 40 }}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center justify-center gap-4 px-6 py-3 bg-black/80 backdrop-blur-md rounded-full shadow-2xl border border-white/10"
            >
                {items.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.link}
                        className="relative flex items-center justify-center group"
                    >
                        <span className="text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
                            {item.icon}
                            {item.name}
                        </span>
                        {/* ホバー時の下線アニメーション */}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-green-500 transition-all group-hover:w-full" />
                    </Link>
                ))}
            </motion.div>
        </div>
    );
};