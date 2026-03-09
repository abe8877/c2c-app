"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { X, Play, Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardItem = {
    title: string;
    description: string;
    src: string;
    stats?: { views: string; likes: string };
    ctaText: string;
    ctaLink?: string;
    ctaAction?: () => void;
    content: () => React.ReactNode;
};

export const ExpandableCardDemo = ({ cards }: { cards: CardItem[] }) => {
    const [active, setActive] = useState<(typeof cards)[0] | boolean | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }
        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && typeof active === "object" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-50"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0 grid place-items-center z-[60] p-4">
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.05 } }}
                            className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white rounded-full h-8 w-8 z-50"
                            onClick={() => setActive(null)}
                        >
                            <X className="h-5 w-5 text-black" />
                        </motion.button>

                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className="w-full max-w-4xl h-full max-h-[90vh] md:h-[600px] flex flex-col md:flex-row bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl"
                        >
                            {/* LEFT: Short Video Preview (Vertical) */}
                            <div className="relative w-full md:w-[400px] h-[400px] md:h-full bg-black">
                                <motion.div layoutId={`image-${active.title}-${id}`} className="h-full w-full">
                                    <img
                                        src={active.src}
                                        alt={active.title}
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                    {/* Stats Overlay */}
                                    <div className="absolute bottom-4 left-4 flex gap-4 text-white text-sm font-medium">
                                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {active.stats?.views || "120k"}</span>
                                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {active.stats?.likes || "4.5k"}</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* RIGHT: Content & AI Analysis */}
                            <div className="flex-1 flex flex-col overflow-y-auto">
                                <div className="flex justify-between items-start p-6 border-b">
                                    <div>
                                        <motion.h3
                                            layoutId={`title-${active.title}-${id}`}
                                            className="font-bold text-2xl text-neutral-800 dark:text-neutral-200"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.description}-${id}`}
                                            className="text-neutral-500 dark:text-neutral-400 text-sm mt-1"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>
                                    {active.ctaAction ? (
                                        <motion.button
                                            layoutId={`button-${active.title}-${id}`}
                                            onClick={() => {
                                                setActive(null);
                                                active.ctaAction?.();
                                            }}
                                            className="px-6 py-2 text-sm rounded-full font-bold bg-green-600 hover:bg-green-700 text-white transition-colors"
                                        >
                                            {active.ctaText}
                                        </motion.button>
                                    ) : (
                                        <motion.a
                                            layoutId={`button-${active.title}-${id}`}
                                            href={active.ctaLink}
                                            target="_blank"
                                            className="px-6 py-2 text-sm rounded-full font-bold bg-green-600 hover:bg-green-700 text-white transition-colors"
                                        >
                                            {active.ctaText}
                                        </motion.a>
                                    )}
                                </div>

                                <div className="p-6 relative">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-neutral-600 text-sm md:text-base dark:text-neutral-400 flex flex-col gap-4"
                                    >
                                        {typeof active.content === "function"
                                            ? active.content()
                                            : active.content}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>

            {/* LIST VIEW: Grid Layout for Short Videos */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
                {cards.map((card, index) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={`card-${card.title}-${id}`}
                        onClick={() => setActive(card)}
                        className="group relative flex flex-col rounded-2xl cursor-pointer bg-white dark:bg-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        {/* Thumbnail: 9:16 Aspect Ratio */}
                        <div className="aspect-[9/16] w-full relative overflow-hidden bg-black">
                            <motion.div layoutId={`image-${card.title}-${id}`} className="w-full h-full">
                                <img
                                    src={card.src}
                                    alt={card.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </motion.div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                            {/* Play Icon (Hover Effect) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                                </div>
                            </div>

                            {/* Text Info Overlay (Bottom) */}
                            <div className="absolute bottom-0 left-0 w-full p-4 text-white z-10">
                                <motion.h3
                                    layoutId={`title-${card.title}-${id}`}
                                    className="font-bold text-lg leading-tight truncate"
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${card.description}-${id}`}
                                    className="text-white/80 text-xs truncate mt-1"
                                >
                                    {card.description}
                                </motion.p>
                            </div>

                            {/* Stats Badge (Top Right) */}
                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
                                <Eye className="w-3 h-3" />
                                {card.stats?.views || "10k"}
                            </div>
                        </div>

                        {/* Hidden button for layout Id consistency */}
                        <motion.button
                            layoutId={`button-${card.title}-${id}`}
                            className="hidden"
                        />
                    </motion.div>
                ))}
            </ul>
        </>
    );
};