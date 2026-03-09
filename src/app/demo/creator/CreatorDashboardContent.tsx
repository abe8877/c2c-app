"use client";

import { motion } from "framer-motion";
import { Crown, ArrowRight, Star, PlayCircle } from "lucide-react";
import Image from "next/image";

interface CreatorData {
    name: string;
    tier: string;
    avatarUrl: string;
    assetsGenerated: number;
    nextMilestone: number;
}

interface ExclusiveInvite {
    id: string;
    name: string;
    genre: string;
    vibe: string;
    thumbnail: string;
}

interface CreatorDashboardContentProps {
    creatorData: CreatorData;
    exclusiveInvites: ExclusiveInvite[];
}

export default function CreatorDashboardContent({
    creatorData,
    exclusiveInvites
}: CreatorDashboardContentProps) {
    return (
        <div className="min-h-screen bg-zinc-950 flex justify-center selection:bg-amber-500/30">
            <div className="w-full max-w-md bg-black text-white min-h-screen relative shadow-2xl border-x border-zinc-900 pb-20 font-sans overflow-x-hidden">

                {/* 1. Header & VIP Status */}
                <header className="px-6 pt-12 pb-6 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-zinc-400 text-sm mb-1">Welcome back,</p>
                        <h1 className="text-2xl font-bold tracking-tight">{creatorData.name}</h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative"
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/50 relative z-10">
                            <Image
                                src={creatorData.avatarUrl}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Glowing effect behind avatar */}
                        <div className="absolute inset-0 bg-amber-500 blur-xl opacity-30 z-0"></div>
                    </motion.div>
                </header>

                {/* 2. Tier Card (The "Black Card" Experience) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="px-6 mb-8"
                >
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

                        <div className="flex items-center space-x-3 mb-4">
                            <Crown className="w-6 h-6 text-amber-500" />
                            <h2 className="text-lg font-semibold text-amber-500 tracking-widest uppercase">
                                {creatorData.tier} Creator
                            </h2>
                        </div>

                        <div className="mb-6">
                            <p className="text-3xl font-light mb-1">{creatorData.assetsGenerated} <span className="text-sm text-zinc-500 font-normal">Assets Created</span></p>
                            <p className="text-xs text-zinc-400">Your VIBE is driving permanent value.</p>
                        </div>

                        {/* Progress to Next Tier */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>Progress to SS-Tier</span>
                                <span>{creatorData.assetsGenerated} / {creatorData.nextMilestone}</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(creatorData.assetsGenerated / creatorData.nextMilestone) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                                />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 3. Exclusive Invites (Horizontal Scroll) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="px-6 flex justify-between items-end mb-4">
                        <h3 className="text-xl font-semibold">Exclusive Invites</h3>
                        <button className="text-xs text-zinc-400 flex items-center hover:text-white transition-colors">
                            View All <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>

                    {/* Horizontal scroll container hiding scrollbar */}
                    <div className="flex overflow-x-auto pb-4 px-6 space-x-4 snap-x snap-mandatory scrollbar-hide">
                        {exclusiveInvites.map((invite, index) => (
                            <motion.div
                                key={invite.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                className="flex-none w-64 h-80 relative rounded-2xl overflow-hidden snap-center group cursor-pointer border border-zinc-800/50"
                            >
                                <Image
                                    src={invite.thumbnail}
                                    alt={invite.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    unoptimized={invite.thumbnail.includes('unsplash.com')}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 p-5 w-full">
                                    <div className="flex items-center space-x-1 mb-2">
                                        <span className="px-2 py-0.5 bg-zinc-800/80 backdrop-blur-md rounded-md text-[10px] uppercase tracking-wider text-zinc-300">
                                            {invite.genre}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold leading-tight mb-1">{invite.name}</h4>
                                    <div className="flex items-center text-xs text-zinc-400 mb-4">
                                        <Star className="w-3 h-3 mr-1 text-amber-500" />
                                        {invite.vibe}
                                    </div>

                                    <button className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg flex justify-center items-center space-x-2 active:scale-95 transition-transform">
                                        <PlayCircle className="w-4 h-4" />
                                        <span>Accept Invite</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Global Style to hide scrollbar */}
                <style dangerouslySetInnerHTML={{
                    __html: `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />
            </div>
        </div>
    );
}
