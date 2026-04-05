"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, ArrowRight, Star, PlayCircle, MessageCircle, Link as LinkIcon, Loader2, CheckCircle2, Target, Flame, Plus, Globe, User } from "lucide-react";
import Image from "next/image";
import CreatorAiFeedback from "./_components/CreatorAiFeedback";
import { submitAssetDelivery, updateCreatorPortfolio } from "@/app/actions/creator";
import ChatModal from "../advertiser/_components/ChatModal";

export interface Asset {
    id: string;
    shopName: string;
    status: 'pending' | 'approved' | 'rejected' | 'COMPLETED' | 'OFFERED' | 'APPROVED';
    date: string;
    shopRequirements: string[];
    creatorTags: string[];
    ig_handle?: string;
    offerDetails?: {
        plan: 'barter' | 'paid';
        amount: number;
        selectedTags?: string[];
        barterDetails?: string;
    };
}

const dict = {
    en: {
        welcome: "Welcome back,",
        tierCreator: "Creator",
        assetsCreated: "Assets Created",
        vibeValue: "Your VIBE is driving permanent value.",
        nextTier: "Unlock Next Tier",
        algorithm: "Algorithm Mastery",
        hotActive: "HOT TRENDING ACTIVE",
        getHot: "GET \"HOT TRENDING\"",
        hotAchieved: "Achieved (Boosted in Search)",
        hotPending: "0/1 Achieved",
        hotDesc: (keyword: string) => <>Based on your analytics, we recommend adding videos for <strong>"{keyword}"</strong>. This will boost you to the top of related categories.</>,
        hotMaintain: "Your profile is currently boosted at the top of advertiser search results! Keep it up.",
        proveConsistency: "PROVE CONSISTENCY",
        tierSCandidate: "Tier S Candidate",
        consistencyDesc: (keyword: string) => <>Your videos in the <strong>"{keyword}"</strong> genre are highly rated. Increasing consistent content makes it easier to receive high-reward offers.</>,
        exclusiveInvites: "Exclusive Invites",
        viewAll: "View All",
        acceptInvite: "Accept Invite",
        assetHistory: "Asset History",
        deliveredTitle: "🎉 VIBE DELIVERED!",
        deliveredDesc: <>Thank you for submitting the video! We will review the content and <strong>confirm the reward payment</strong>.<br /><br />INSIDERS. ensures no payment failures and supports you all the way. Move on to your next offer with confidence ✨</>,
        chatWithShop: "Mission Chat",
        submitUrl: "Submit Delivery URL",
        inputUrl: "Enter Video URL (TikTok, IG Reels, etc.)",
        submitButton: "Submit",
        hotTag: "HOT",
        invited: "INVITED",
        profileIncomplete: "Profile Icon Not Set",
        profilePrompt: "Update your profile icon to increase your trust and offer rate! 📈",
        updateIcon: "Update Now",
        status: {
            PENDING: "PENDING",
            APPROVED: "APPROVED",
            REJECTED: "REJECTED",
            COMPLETED: "COMPLETED",
            OFFERED: "INVITED",
            approved: "APPROVED",
            rejected: "REJECTED",
            pending: "PENDING",
            rejectOffer: "Decline",
            acceptOffer: "Accept Offer",
            offerDetailsTitle: "Plan Details",
            offerValue: "Offer Value",
            offerAmount: "Reward"
        }
    },
    ja: {
        welcome: "おかえりなさい、",
        tierCreator: "クリエイター",
        assetsCreated: "作成済みアセット",
        vibeValue: "あなたの世界観が永続的な価値を生んでいます。",
        nextTier: "次世代ティアの解放",
        algorithm: "アルゴリズム攻略",
        hotActive: "HOT TRENDING 獲得中",
        getHot: "HOT TRENDING を獲得する",
        hotAchieved: "達成済み (検索ブースト中)",
        hotPending: "0/1 達成",
        hotDesc: (keyword: string) => <>アナリティクスに基づき、<strong>「{keyword}」系</strong>の動画追加を推奨します。追加すると関連カテゴリで最上位にブーストされます。</>,
        hotMaintain: "現在、あなたのプロフィールは広告主の検索結果で最上位にブーストされています！この勢いを維持しましょう。",
        proveConsistency: "一貫性の証明",
        tierSCandidate: "Tier S 候補",
        consistencyDesc: (keyword: string) => <><strong>「{keyword}」ジャンル</strong>での動画が高く評価されています。一貫性のある動画を増やすことで、より高単価な案件オファーが来やすくなります。</>,
        exclusiveInvites: "限定招待",
        viewAll: "すべて見る",
        acceptInvite: "招待を承諾",
        assetHistory: "アセット履歴",
        deliveredTitle: "🎉 VIBE DELIVERED!",
        deliveredDesc: <>動画の提出ありがとうございます！運営にて内容を確認し、<strong>報酬の支払いを確定</strong>させます。<br /><br />INSIDERS.が未払いを防ぎ、確実にサポートしますので、安心して次の案件をお探しください✨</>,
        chatWithShop: "案件進行用チャット",
        submitUrl: "納品URLを提出",
        inputUrl: "動画URLを入力 (TikTok, IG Reels等)",
        submitButton: "提出する",
        hotTag: "HOT",
        invited: "招待中",
        profileIncomplete: "アイコン未設定",
        profilePrompt: "プロフィール画像を設定すると、信頼度が上がりオファー率が劇的にアップします！📈",
        updateIcon: "今すぐ登録",
        status: {
            PENDING: "審査中",
            APPROVED: "承認済み",
            REJECTED: "差し戻し",
            COMPLETED: "完了",
            OFFERED: "招待中",
            approved: "承認済み",
            rejected: "差し戻し",
            pending: "審査中",
            rejectOffer: "辞退する",
            acceptOffer: "オファーを承諾する",
            offerDetailsTitle: "プラン詳細",
            offerValue: "提供内容",
            offerAmount: "報酬"
        }
    }
};

function AssetItem({ asset, lang }: { asset: Asset, lang: 'en' | 'ja' }) {
    const t = dict[lang];
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
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${localStatus === 'APPROVED' || localStatus === 'approved' ? 'bg-teal-500/20 text-teal-500' :
                    localStatus === 'rejected' ? 'bg-zinc-800 text-zinc-500' :
                        localStatus === 'COMPLETED' ? 'bg-blue-500/20 text-blue-500' :
                            localStatus === 'OFFERED' ? 'bg-amber-500/20 text-amber-500' :
                                'bg-zinc-500/10 text-zinc-400'
                    }`}>
                    {(t.status as any)[localStatus] || localStatus}
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
            
            {localStatus === 'OFFERED' && asset.offerDetails && (
                <div className="mt-4 p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-4 text-left">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">{t.status.OFFERED} {t.status.offerDetailsTitle}</span>
                        {asset.offerDetails.plan === 'paid' && (
                            <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                                💰 {t.status.offerAmount} ¥{asset.offerDetails.amount.toLocaleString()}
                            </span>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-amber-500/50 uppercase tracking-widest">{t.status.offerValue}</p>
                            <p className="text-xs font-semibold leading-relaxed text-zinc-200">
                                {asset.offerDetails.barterDetails || "商品のサービス提供"}
                            </p>
                        </div>
                        
                        {asset.offerDetails.selectedTags && asset.offerDetails.selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {asset.offerDetails.selectedTags.map(tag => (
                                    <span key={tag} className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 font-bold uppercase tracking-widest">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={() => {
                                if (confirm('このオファーを承認しますか？')) {
                                    setLocalStatus('APPROVED');
                                    alert('オファーを承諾しました！チャットで来店日程を調整しましょう。');
                                }
                            }}
                            className="flex-1 py-3 bg-amber-500 text-black rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" /> {t.status.acceptOffer}
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('このオファーをお断りしますか？')) {
                                    setLocalStatus('rejected');
                                }
                            }}
                            className="px-4 py-3 bg-zinc-800 text-red-400 border border-red-500/20 rounded-xl text-xs font-black active:scale-95 transition"
                        >
                            {t.status.rejectOffer}
                        </button>
                    </div>
                </div>
            )}

            {(localStatus === 'approved' || localStatus === 'APPROVED' || (localStatus === 'OFFERED' && !asset.offerDetails)) && (
                <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="flex-1 py-2 bg-zinc-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-700 transition"
                        >
                            <MessageCircle className="w-3.5 h-3.5" /> {t.chatWithShop}
                        </button>
                        <button
                            onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                            className="flex-1 py-2 bg-teal-600/20 text-teal-500 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-teal-600/30 transition border border-teal-500/30"
                        >
                            <LinkIcon className="w-3.5 h-3.5" /> {t.submitUrl}
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
                                    <p className="text-xs text-zinc-400 mb-2 font-bold">{t.inputUrl}</p>
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
                                        {t.submitButton}
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
                        <h4 className="text-sm font-black text-teal-300 mb-2 tracking-wide">{t.deliveredTitle}</h4>
                        <p className="text-[10px] text-zinc-300 leading-relaxed font-medium">
                            {t.deliveredDesc}
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
    id: string;
    name: string;
    tier: string;
    avatarUrl: string;
    assetsGenerated: number;
    nextMilestone: number;
    hitKeywords?: string[];
    isHot?: boolean;
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
    initialLang?: 'en' | 'ja';
}

export default function CreatorDashboardContent({
    creatorData,
    exclusiveInvites,
    assets,
    initialLang = 'en'
}: CreatorDashboardContentProps) {
    const [lang, setLang] = useState<'en' | 'ja'>(initialLang);
    const t = dict[lang];
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [isUpdatingPortfolio, setIsUpdatingPortfolio] = useState(false);
    const [showVideoInput, setShowVideoInput] = useState(false);

    const handleAddPortfolioVideo = async () => {
        if (!newVideoUrl) return;
        setIsUpdatingPortfolio(true);
        try {
            await updateCreatorPortfolio(creatorData.id, newVideoUrl);
            setNewVideoUrl("");
            setShowVideoInput(false);
            alert("ポートフォリオに動画を追加しました！");
        } catch (error) {
            console.error(error);
            alert("エラーが発生しました。");
        } finally {
            setIsUpdatingPortfolio(false);
        }
    };

    const targetKeyword = creatorData.hitKeywords?.[0] || "FOOD";

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
                        <p className="text-zinc-400 text-sm mb-1">{t.welcome}</p>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            {creatorData.name}
                            {creatorData.isHot && (
                                <span className="bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-0.5">
                                    <Flame className="w-2.5 h-2.5" /> {t.hotTag}
                                </span>
                            )}
                        </h1>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors bg-white/5"
                        >
                            <Globe className="w-5 h-5" />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/50 relative z-10 flex items-center justify-center bg-zinc-900">
                                {creatorData.avatarUrl ? (
                                    <Image
                                        src={creatorData.avatarUrl}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="w-6 h-6 text-zinc-500" />
                                )}
                            </div>
                            <div className={`absolute inset-0 blur-xl opacity-30 z-0 ${creatorData.avatarUrl ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`}></div>
                        </motion.div>
                    </div>
                </header>

                {!creatorData.avatarUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-6 mb-6"
                    >
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-0.5">{t.profileIncomplete}</p>
                                    <p className="text-xs text-zinc-300 font-medium leading-tight">
                                        {t.profilePrompt}
                                    </p>
                                </div>
                            </div>
                            <button className="bg-red-500 text-white text-[10px] font-black px-3 py-2 rounded-lg whitespace-nowrap hover:bg-red-600 transition shadow-lg shadow-red-500/20">
                                {t.updateIcon}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* 2. Tier Card (The "Black Card" Experience) */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="px-6 mb-8"
                >
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

                        <div className="flex items-center space-x-3 mb-4">
                            <Crown className="w-6 h-6 text-amber-500" />
                            <h2 className="text-lg font-semibold text-amber-500 tracking-widest uppercase">
                                {creatorData.tier} {t.tierCreator}
                            </h2>
                        </div>

                        <div className="mb-6">
                            <p className="text-3xl font-light mb-1">{creatorData.assetsGenerated} <span className="text-sm text-zinc-500 font-normal">{t.assetsCreated}</span></p>
                            <p className="text-xs text-zinc-400">{t.vibeValue}</p>
                        </div>

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

                {/* アルゴリズム攻略セクション */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="px-6 mb-8"
                >
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" /> {t.nextTier}
                            </h3>
                            <span className="text-[9px] text-slate-500 font-medium">{t.algorithm}</span>
                        </div>

                        <div className="space-y-4">
                            {/* ミッション 1: HOTバッジの獲得 */}
                            <div className={`border rounded-xl p-3 relative overflow-hidden group ${creatorData.isHot ? 'bg-orange-500/10 border-orange-500/30' : 'bg-black border-orange-500/20'}`}>
                                {creatorData.isHot && <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full" />}
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                                        🔥 {creatorData.isHot ? t.hotActive : t.getHot}
                                    </span>
                                    <span className={`text-[10px] ${creatorData.isHot ? 'text-orange-400 font-bold' : 'text-zinc-500'}`}>
                                        {creatorData.isHot ? t.hotAchieved : t.hotPending}
                                    </span>
                                </div>

                                {!creatorData.isHot && (
                                    <>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed relative z-10 mb-3">
                                            {t.hotDesc(targetKeyword)}
                                        </p>

                                        {/* 🔴 復元された動画追加UI */}
                                        <div className="relative z-10 flex gap-2">
                                            <input
                                                type="url"
                                                value={newVideoUrl}
                                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                                placeholder="TikTok/IG Reels URL"
                                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none focus:border-orange-500/50"
                                            />
                                            <button
                                                onClick={handleAddPortfolioVideo}
                                                disabled={!newVideoUrl || isUpdatingPortfolio}
                                                className="bg-orange-600 text-white px-3 py-2 rounded-lg text-[10px] font-bold disabled:opacity-50 flex items-center gap-1 hover:bg-orange-500 transition"
                                            >
                                                {isUpdatingPortfolio ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                                {lang === 'en' ? 'Add' : '追加'}
                                            </button>
                                        </div>
                                    </>
                                )}
                                {creatorData.isHot && (
                                    <p className="text-[10px] text-orange-200/70 leading-relaxed relative z-10 mt-1">
                                        {t.hotMaintain}
                                    </p>
                                )}
                            </div>

                            {/* ミッション 2: 一貫性の証明 */}
                            <div className="bg-black border border-white/10 rounded-xl p-3 relative z-10 mt-4">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                        👑 {t.proveConsistency}
                                    </span>
                                    <span className="text-[10px] text-emerald-500">{t.tierSCandidate}</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 leading-relaxed">
                                    {t.consistencyDesc(targetKeyword)}
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
                        <h3 className="text-xl font-semibold">{t.exclusiveInvites}</h3>
                        <button className="text-xs text-zinc-400 flex items-center hover:text-white transition-colors">
                            {t.viewAll} <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>

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
                                        <span>{t.acceptInvite}</span>
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
                        {t.assetHistory}
                    </h3>

                    <div className="space-y-4">
                        {assets.map((asset) => (
                            <AssetItem key={asset.id} asset={asset} lang={lang} />
                        ))}
                    </div>
                </motion.section>

                <style dangerouslySetInnerHTML={{
                    __html: `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />
            </div>
        </div>
    );
}