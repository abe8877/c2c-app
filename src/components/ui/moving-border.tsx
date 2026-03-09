"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ButtonWithMovingBorder = ({
    children,
    containerClassName,
    borderClassName,
    duration = 2000,
    className,
    ...otherProps
}: {
    children: React.ReactNode;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
    className?: string;
    [key: string]: any;
}) => {
    return (
        <div
            className={cn(
                "bg-transparent relative text-xl h-16 w-full max-w-[200px] p-[1px] overflow-hidden rounded-full", // コンテナ
                containerClassName
            )}
            {...otherProps}
        >
            <div
                className="absolute inset-0"
                style={{ borderRadius: `inherit` }}
            >
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: duration / 1000,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className={cn(
                        "absolute inset-0 h-full w-full aspect-square bg-[conic-gradient(from_0deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-[0.8]",
                        borderClassName
                    )}
                    style={{
                        // サイズを大きくして回転の中心を合わせるハック
                        width: "100%",
                        height: "1000%",
                        top: "-450%",
                        left: "-0%",
                    }}
                />
            </div>

            <div
                className={cn(
                    "relative bg-slate-900 border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased rounded-full",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
};