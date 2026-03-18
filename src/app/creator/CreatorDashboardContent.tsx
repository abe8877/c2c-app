"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, ArrowRight, Star, PlayCircle, MessageCircle, Link as LinkIcon, Loader2, CheckCircle2, Target } from "lucide-react";
import Image from "next/image";
import CreatorAiFeedback from "./_components/CreatorAiFeedback";
import { submitAssetDelivery } from "@/app/actions/creator";
import ChatModal from "../advertiser/_components/ChatModal";

export interface Asset {
    id: string;
    shopName: string;
    status: 'pending' | 'approved' | 'rejected' | 'COMPLETED';
    date: string;
    shopRequirements: string[];
    creatorTags: string[];
    ig_handle?: string;
}

function AssetItem({ asset }: { asset: Asset }) {
    const [localStatus, setLocalStatus] = useState(asset.status);
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [deliveryUrl, setDeliveryUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deliveryUrl) return;
        setIsSubmitting(true);
        try {
            await submitAssetDelivery(asset.id, deliveryUrl);
            setLocalStatus('COMPLETED');
            setShowDeliveryForm(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className={`border rounded-2xl p-4 transition-all ${localStatus === 'rejected'
                ? 'bg-zinc-900/30 border-zinc-800/50 opacity-80'
                : 'bg-zinc-900 border-zinc-800'
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="text-left">
                    <h4 className="font-bold text-sm">{asset.shopName}</h4>
                    <p className="text-[10px] text-zinc-500">{asset.date}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${localStatus === 'approved' ? 'bg-teal-500/20 text-teal-500' :
                    localStatus === 'rejected' ? 'bg-zinc-800 text-zinc-500' :
                        localStatus === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-amber-500/20 text-amber-500'
                    }`}>
                    {localStatus}
                </span>
            </div>

            {localStatus === 'rejected' && (
                <CreatorAiFeedback
                    assetId={asset.id}
                    creatorId="demo-creator-id"
                    shopId="demo-shop-id"
                    shopName={asset.shopName}
                    shopRequirements={asset.shopRequirements}
                    creatorTags={asset.creatorTags}
                />
            )}

            {localStatus === 'approved' && (
                <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="flex-1 py-2 bg-zinc-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-700 transition"
                        >
                            <MessageCircle className="w-3.5 h-3.5" /> AI自動翻訳チャット
                        </button>
                        <button
                            onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                            className="flex-1 py-2 bg-teal-600/20 text-teal-500 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-teal-600/30 transition border border-teal-500/30"
                        >
                            <LinkIcon className="w-3.5 h-3.5" /> 納品URLを提出
                        </button>
                    </div>

                    <AnimatePresence>
                        {showDeliveryForm && (
                            <motion.form
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                                onSubmit={handleSubmit}
                            >
                                <div className="mt-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                                    <p className="text-xs text-zinc-400 mb-2 font-bold">動画URLを入力 (TikTok, IG Reels等)</p>
                                    <input
                                        type="url"
                                        value={deliveryUrl}
                                        onChange={e => setDeliveryUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-500 mb-2"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-2 bg-white text-black rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-zinc-200 transition flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                        提出する
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {localStatus === 'COMPLETED' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, height: 0 }}
                        animate={{ scale: 1, opacity: 1, height: 'auto' }}
                        className="mt-4 p-5 bg-gradient-to-br from-teal-900/40 to-black border border-teal-800/50 rounded-2xl text-center relative overflow-hidden shadow-[0_0_30px_rgba(20,184,166,0.15)] ring-1 ring-teal-500/20"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                            className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-teal-500/10"
                        >
                            <CheckCircle2 className="w-6 h-6 text-teal-400" />
                        </motion.div>
                        <h4 className="text-sm font-black text-teal-300 mb-2 tracking-wide">🎉 VIBE DELIVERED!</h4>
                        <p className="text-[10px] text-zinc-300 leading-relaxed font-medium">
                            動画の提出ありがとうございます！運営にて内容を確認し、<span className="text-teal-400 font-bold">報酬の支払いを確定</span>させます。<br /><br />
                            INSIDERS.が未払いを防ぎ、確実にサポートしますので、安心して次の案件をお探しください✨
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                assetId={asset.id}
                partnerName={asset.shopName}
                currentUserType="creator"
            />
        </div>
    );
}

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
    assets: Asset[];
}

export default function CreatorDashboardContent({
    creatorData,
    exclusiveInvites,
    assets
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

                {/* ユーザーダッシュボード内の「攻略ヒント」セクション */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="px-6 mb-8"
                >
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" /> Unlock Next Tier
                            </h3>
                            <span className="text-[9px] text-slate-500 font-medium">アルゴリズム攻略</span>
                        </div>

                        <div className="space-y-4">
                            {/* ミッション 1: HOTバッジの獲得 */}
                            <div className="bg-black border border-orange-500/20 rounded-xl p-3 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 blur-xl rounded-full" />
                                <div className="flex justify-between items-start mb-1 relative z-10">
                                    <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                                        🔥 GET "HOT TRENDING"
                                    </span>
                                    <span className="text-[10px] text-zinc-500">0/1 達成</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 leading-relaxed relative z-10">
                                    前回高い評価を得た<span className="text-white font-bold">「MATCHA」系の動画</span>の追加を推奨します。動画を追加すると関連カテゴリで上位に表示されやすくなります。
                                </p>
                                <button className="mt-2 text-[9px] bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded font-bold transition-colors">
                                    + 動画リンクを追加
                                </button>
                            </div>

                            {/* ミッション 2: 一貫性の証明 */}
                            <div className="bg-black border border-white/10 rounded-xl p-3 relative z-10">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                        👑 PROVE CONSISTENCY
                                    </span>
                                    <span className="text-[10px] text-emerald-500">Tier S 候補</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 leading-relaxed">
                                    あなたの「FOOD」ジャンルでの動画が高く評価されています。一貫性のある動画を増やすことで、より高単価な案件オファーが来やすくなります。
                                </p>
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

                {/* 4. Asset History (Vertical List) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="px-6 pb-12"
                >
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        Asset History
                    </h3>

                    <div className="space-y-4">
                        {assets.map((asset) => (
                            <AssetItem key={asset.id} asset={asset} />
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
