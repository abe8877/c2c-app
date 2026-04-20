"use client";

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatModal from "./ChatModal";
import {
    Search, MapPin, ChevronDown, Check, Globe, RefreshCw, Star, Info, Layers,
    CheckCircle, ChevronRight, MessageSquare, Play, Sparkles, Send, Users,
    AlertCircle, Camera, Bell, User, Gift, DollarSign, X, AlertTriangle,
    Trash2, ChevronLeft, ArrowRight, Clock, MessageCircle, UploadCloud,
    Plus, Instagram, MessageSquareQuote, BarChart3, TrendingUp, Home,
    Calendar, Map, Trash, Menu, CheckCircle2, Flame, Crown, Target,
    SettingsIcon, Video, Loader2,
    Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { analyzeAssetInsight } from "@/app/actions/analyze-asset-insight";
import { analyzeShopVibe, saveShopVibeTags } from "@/app/actions/analyze-shop-vibe";
import { offerCreator } from '@/app/actions/offer-creator';
import { translateText } from '@/app/actions/translate';
import { createClient } from '@/utils/supabase/client';
import ShopUpsellBanner from "./ShopUpsellBanner";
import ShopSettingsModal from "./ShopSettingsModal";
import OnboardingModal from "./OnboardingModal";
import { FloatingActionBar } from '@/components/floating-action-bar';
import { HelpCircle } from 'lucide-react';

export interface Asset {
    id: string;
    client_tag: string;
    creator_id: string;
    status: string;
    video_url?: string;
    created_at?: string;
    updated_at?: string;
    approved_at?: string;
    filming_at?: string;
    delivered_at?: string;
    creator?: {
        name: string;
        tiktok_handle?: string;
        portfolio_video_urls?: string[];
        avatar_url?: string;
    };
}

export interface Creator {
    id: string;
    name: string;
    genre: string[];
    ethnicity: string;
    nationality?: string;
    vibe_tags: string[];
    followers: string;
    thumbnail_url: string | null;
    portfolio_video_urls?: string[];
    tier?: 'S' | 'A' | 'B' | '-';
    vibeMatchScore?: number;
    matchedClusters?: string[];
    avatar?: string; // Added for offerCreator
    is_verified?: boolean;
    response_rate?: 'HIGH' | 'MEDIUM' | 'LOW';
    is_public?: boolean;
    is_hot?: boolean;
    is_ai_recommended?: boolean;
    review_status?: string;
    offer_count?: number;
    pricing_guide?: string;
}

const AnimatedCounter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) {
            setCount(end);
            return;
        }

        const totalDuration = 1000;
        const increment = end / (totalDuration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}</span>;
};

const genreEmoji: Record<string, string> = { FOOD: '🍣', BEAUTY: '💅', TRAVEL: '⛩️', EXPERIENCE: '🧖‍♀️', LIFESTYLE: '✨' };
const ethnicityEmoji: Record<string, string> = { AMERICA: '🇺🇸', EUROPE: '🇪🇺', ASIA: '🌏', AFRICA: '🌍' };

// --- Helper: Convert TikTok URL to Embed URL ---
const getTikTokEmbedUrl = (url: string) => {
    if (!url) return null;
    // 形式: https://www.tiktok.com/@user/video/7123456789...
    // 埋め込み用: https://www.tiktok.com/embed/v2/7123456789...
    const match = url.match(/\/video\/(\d+)/);
    if (match && match[1]) {
        return `https://www.tiktok.com/embed/v2/${match[1]}?autoplay=1&mute=1`;
    }
    return url; // 変換できない場合はそのまま返す
};

// --- Sub-component: Portfolio Video Modal ---
const PortfolioVideoModal = ({ isOpen, onClose, videoUrls, creatorName }: { isOpen: boolean; onClose: () => void; videoUrls: string[]; creatorName: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = videoUrls.length;

    const goNext = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % total); };
    const goPrev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + total) % total); };

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const currentUrl = videoUrls[currentIndex];
    const embedUrl = getTikTokEmbedUrl(currentUrl);
    const isDirectVideo = currentUrl?.match(/\.(mp4|mov|webm|ogv)(\?.*)?$/i);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
                    onClick={onClose}
                >
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
                        <div className="space-y-1">
                            <h3 className="text-white font-black text-xl tracking-tighter">Portfolio</h3>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={12} className="text-yellow-400" /> @{creatorName}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/10 transition-all active:scale-95"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative flex items-center h-[70vh] md:h-[85vh] aspect-[9/16] justify-center" onClick={(e) => e.stopPropagation()}>
                        {/* Prev Button - Absolute */}
                        <button
                            onClick={goPrev}
                            disabled={total <= 1}
                            className={`absolute left-[-60px] p-3 rounded-full transition-all z-30 ${total <= 1 ? 'hidden' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-transform active:scale-90 hover:scale-110'}`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <motion.div
                            key={currentIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20"
                        >
                            {isDirectVideo ? (
                                <video
                                    src={currentUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <iframe
                                    src={embedUrl || undefined}
                                    className="w-full h-full border-none"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            )}
                        </motion.div>

                        {/* Next Button - Absolute */}
                        <button
                            onClick={goNext}
                            disabled={total <= 1}
                            className={`absolute right-[-60px] p-3 rounded-full transition-all z-30 ${total <= 1 ? 'hidden' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-transform active:scale-90 hover:scale-110'}`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {total > 1 && (
                        <div className="absolute bottom-10 flex gap-2">
                            {videoUrls.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 transition-all duration-300 rounded-full ${i === currentIndex ? 'w-8 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'w-1.5 bg-white/20'}`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CreatorCard = ({
    creator,
    onOffer,
    onPlayVideo,
    priority = false
}: {
    creator: Creator;
    onOffer: (c: Creator) => void;
    onPlayVideo: (urls: string[]) => void;
    priority?: boolean;
}) => {
    const [isTapped, setIsTapped] = useState(false);
    const hasVideos = creator.portfolio_video_urls && creator.portfolio_video_urls.length > 0;
    const hasScore = creator.vibeMatchScore !== undefined && creator.vibeMatchScore > 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsTapped(!isTapped)}
            className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            {/* Premium Fallback Background (Visible if img fails or is missing) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-teal-950 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2 border border-white/10">
                    <Sparkles className="w-6 h-6 text-teal-500/50" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-teal-500/50 uppercase">INSIDERS.</span>
                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">Verifying Vibe</span>
            </div>

            {/* Thumbnail */}
            {creator.thumbnail_url && (
                <Image
                    src={creator.thumbnail_url}
                    alt={creator.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={true}
                    priority={priority}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5 z-10 flex-wrap">
                {(() => {
                    const safeGenres = Array.isArray(creator.genre)
                        ? creator.genre
                        : creator.genre ? [creator.genre] : [];
                    return safeGenres.slice(0, 3).map((g: string) => (
                        <span
                            key={g}
                            className="backdrop-blur-md bg-black/30 text-white text-[10px] px-2 py-0.5 rounded border border-white/20 font-bold flex items-center gap-1"
                        >
                            {genreEmoji[g] || '✨'} {g}
                        </span>
                    ));
                })()}
                {creator.is_hot && (
                    <span className="backdrop-blur-md bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded border border-orange-400/50 font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                        <Flame className="w-2.5 h-2.5 fill-current" /> HOT
                    </span>
                )}
                {(parseInt(creator.followers.replace(/,/g, '')) >= 50000 || (creator.offer_count ?? 0) >= 10) && (
                    <span className="backdrop-blur-md bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded border border-amber-400/50 font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                        <Crown className="w-2.5 h-2.5 fill-current" /> 人気
                    </span>
                )}
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-left">
                {/* VIBEマッチ度バッジ - Moved above name as requested */}
                {hasScore && (
                    <div className="mb-2">
                        <span className={`text-[11px] font-black tracking-tight whitespace-nowrap ${(creator.vibeMatchScore ?? 0) >= 90
                            ? 'text-amber-400'
                            : (creator.vibeMatchScore ?? 0) >= 80
                                ? 'text-teal-400'
                                : 'text-white/70'
                            }`}>
                            マッチ度 {creator.vibeMatchScore}%
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-white font-black text-base tracking-tight">@{creator.name}</h3>
                    {creator.is_verified && (
                        <div className="bg-teal-500/20 backdrop-blur-md border border-teal-400/50 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-[0_0_10px_rgba(20,184,166,0.3)] group/verified">
                            <CheckCircle2 className="w-2.5 h-2.5 text-teal-400" />
                            <span className="text-[8px] font-black text-teal-400 uppercase tracking-tighter">Verified</span>

                            {/* Simple Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 text-white text-[9px] rounded-lg opacity-0 invisible group-hover/verified:opacity-100 group-hover/verified:visible transition-all z-50 pointer-events-none border border-white/10">
                                本人確認済みの公式メンバーです。確実にマッチングします。
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90" />
                            </div>
                        </div>
                    )}
                    {creator.is_ai_recommended && (
                        <div className="bg-indigo-500/20 backdrop-blur-md border border-indigo-400/50 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.3)] group/ai">
                            <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">AI RECOMMENDED</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5 overflow-hidden">
                    {/* FOLLOWERS - Unified Glass Box UI */}
                    <div className="flex items-center gap-1.5 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/15 backdrop-blur-md rounded border border-white/10 w-fit truncate max-w-full">
                        <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/50 shrink-0" />
                        <span className="truncate">{creator.followers} followers</span>
                    </div>

                    {/* AUDIENCE - Vertical stack, Unified Glass Box UI */}
                    <div className="flex items-center gap-1.5 text-white/90 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/15 backdrop-blur-md rounded border border-white/10 w-fit truncate max-w-full">
                        <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/50 shrink-0" />
                        <span className="truncate">AUDIENCE: {creator.nationality || (creator.ethnicity === 'ASIA' ? 'Asia' : creator.ethnicity === 'AMERICA' ? 'North America' : creator.ethnicity === 'EUROPE' ? 'Europe' : creator.ethnicity || 'Global')}</span>
                    </div>

                    {/* PRICING GUIDE - Multi-line supported */}
                    {creator.pricing_guide && (
                        <div className="flex items-start gap-1.5 text-white text-[9px] sm:text-[10px] font-black tracking-tight px-2 py-1.5 bg-indigo-500/30 backdrop-blur-md rounded border border-indigo-400/30 w-fit max-w-full shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-300 shrink-0 mt-0.5" />
                            <span className="leading-tight">{creator.pricing_guide}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Hover Overlay: Buttons */}
            <div className={`absolute inset-0 bg-black/40 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4 ${isTapped ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 pointer-events-none sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto'}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); onOffer(creator); }}
                    className="w-[140px] bg-white text-black font-black px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 sm:transform sm:translate-y-4 sm:group-hover:translate-y-0 hover:scale-105 active:scale-95 text-[10px] flex items-center justify-center gap-1.5 uppercase tracking-wide"
                >
                    ✨ オファーを送る
                </button>

                {hasVideos && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPlayVideo(creator.portfolio_video_urls!); }}
                        className="w-[140px] bg-white/20 backdrop-blur-md text-white font-bold px-4 py-2.5 rounded-full border border-white/30 transition-all duration-500 sm:delay-75 sm:transform sm:translate-y-4 sm:group-hover:translate-y-0 hover:bg-white/30 active:scale-95 text-[10px] flex items-center justify-center gap-2 uppercase tracking-tight"
                    >
                        <Play className="w-3 h-3 fill-current" /> 動画を見る {creator.portfolio_video_urls!.length > 1 ? `(${creator.portfolio_video_urls!.length})` : ''}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// --- サブコンポーネント: 資産展開セクション ---
const AssetDeploymentSection = ({ freshness, setFreshness, synced, setSynced, clientTag, latestAssetUrl, freeOffers, isPremium, isFetchingInfo }: any) => {
    const handleGoogleMapsSync = () => {
        if (latestAssetUrl) {
            const a = document.createElement('a');
            a.href = latestAssetUrl;
            a.download = 'nots_asset_video.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        setSynced(true);
        setFreshness(100);
        alert("動画をダウンロードしました。Googleマップアプリを開いて投稿してください。");
    };

    const handleCopyWidgetCode = () => {
        // window.location.origin を使用して動的にホスト名を取得
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://manekey.com';
        const code = `<iframe src="${origin}/embed/${clientTag}" width="100%" height="600px" frameborder="0" style="border-radius:24px;"></iframe>`;
        navigator.clipboard.writeText(code);
        alert("埋め込みコードをコピーしました！自社HPに貼り付けてください。");
    };
    return (
        <section className="space-y-8 py-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <RefreshCw className="w-6 h-6 text-green-600" />
                    コンテンツの集客資産化
                </h2>
                <p className="text-gray-600 text-sm font-medium">
                    獲得した動画をフル活用しましょう！
                    動画を埋め込んで貴店の集客チャネルを強化できます。
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-left">
                {/* 1. Google Maps Sync */}
                <div className="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col ring-1 ring-stone-100">
                    <div className="p-6 border-b bg-stone-50 flex justify-between items-center">
                        <h3 className="font-black text-sm flex items-center gap-2 uppercase tracking-tight">
                            <MapPin className="w-5 h-5 text-red-500" /> Google Maps Sync
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider">
                            Inbound 必須
                        </span>
                    </div>

                    <div className="p-6 space-y-6 flex-1">


                        <div className="border rounded-[24px] p-5 bg-stone-50 relative ring-1 ring-stone-200/50 overflow-hidden">
                            <AnimatePresence>
                                {synced && (
                                    <motion.div
                                        initial={{ y: 50, x: -50, scale: 0.5, opacity: 0 }}
                                        animate={{ y: 0, x: 0, scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.8, type: "spring" }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl ring-4 ring-blue-500"
                                    >
                                        <video autoPlay loop muted className="w-full h-full object-cover">
                                            <source src="https://assets.mixkit.co/videos/preview/mixkit-people-eating-at-a-restaurant-4433-large.mp4" type="video/mp4" />
                                        </video>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex gap-3 mb-4">
                                <div className="w-10 h-10 bg-white rounded-full border-2 border-white shadow-sm ring-1 ring-stone-200" />
                                <div>
                                    <div className="w-24 h-3 bg-stone-200 rounded mb-1.5" />
                                    <div className="flex items-center gap-3">
                                        {!isPremium && !isFetchingInfo && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full animate-pulse shadow-sm h-fit">
                                                <Sparkles size={12} className="text-yellow-600" />
                                                <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">
                                                    Remaining {freeOffers}/3 Free Offers
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="aspect-square bg-white rounded-xl border shadow-sm ring-1 ring-stone-100" />
                                <div className="aspect-square bg-white rounded-xl border shadow-sm ring-1 ring-stone-100" />
                                <div className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-700 shadow-md ${synced ? 'bg-black ring-2 ring-blue-500' : 'bg-stone-100 border-2 border-dashed border-stone-300'}`}>
                                    {synced ? (
                                        <video autoPlay loop muted className="w-full h-full object-cover rounded-xl opacity-90">
                                            <source src="https://assets.mixkit.co/videos/preview/mixkit-people-eating-at-a-restaurant-4433-large.mp4" type="video/mp4" />
                                        </video>
                                    ) : (
                                        <span className="text-[8px] font-black text-stone-400 text-center leading-tight uppercase tracking-widest">New<br />Video</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-stone-50">
                        <button
                            onClick={handleGoogleMapsSync}
                            disabled={synced}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${synced ? 'bg-stone-200 text-stone-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg active:scale-95'}`}
                        >
                            {synced ? <><Check className="w-4 h-4 inline mr-1" /> 同期済み (再ダウンロード)</> : <>Google Maps に投稿する</>}
                        </button>
                    </div>
                </div>

                {/* 2. Web Widget */}
                <div className="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col ring-1 ring-stone-100">
                    <div className="p-6 border-b bg-stone-50 flex justify-between items-center">
                        <h3 className="font-black text-sm flex items-center gap-2 uppercase tracking-tight">
                            <Globe className="w-5 h-5 text-purple-600" /> Web Widget
                        </h3>
                        <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider">自動更新</span>
                    </div>

                    <div className="p-6 space-y-6 flex-1 relative group">
                        <div className="w-full h-72 border rounded-[24px] overflow-hidden relative shadow-inner bg-white ring-1 ring-stone-200/50">
                            <div className="h-10 bg-stone-900 flex items-center px-4 justify-between">
                                <div className="w-16 h-1.5 bg-stone-700 rounded-full" />
                            </div>
                            <div className="h-32 bg-stone-50 flex items-center justify-center border-b font-black text-lg text-stone-200 uppercase tracking-tighter italic">YOUR WEBSITE</div>
                            <div className="absolute -bottom-10 left-0 right-0 p-5 bg-white/70 backdrop-blur-xl transition-all duration-700 group-hover:-translate-y-10 border-t border-white/20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest leading-none">Guest Vibe (Live)</span>
                                </div>
                                <div className="flex gap-3 overflow-x-hidden">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="min-w-[75px] h-[100px] bg-stone-900 rounded-xl overflow-hidden relative shadow-lg ring-1 ring-white/20">
                                            <img src={`https://picsum.photos/150/200?random=${i + 20}`} className="w-full h-full object-cover opacity-80" alt="" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-stone-500 px-4 leading-relaxed font-bold">埋め込みコードを貼るだけで、<br />納品された動画が<span className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">自社HPで自動更新</span>されます。</p>
                    </div>

                    <div className="p-4 border-t bg-stone-50">
                        <button
                            onClick={handleCopyWidgetCode}
                            className="w-full py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            ウィジェットコードをコピー
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- サブコンポーネント: 解析中画面 ---
function AnalyzingScreen() {
    return (
        <div className="text-center py-40 animate-in fade-in zoom-in duration-500">
            <div className="relative w-32 h-32 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-yellow-500 animate-pulse" size={48} />
            </div>
            <h2 className="text-2xl font-black tracking-tighter mb-4 uppercase">貴店の魅力を言語化中...</h2>
            <div className="inline-flex flex-col items-center gap-3 text-stone-400 font-black text-xs uppercase tracking-widest">
                <p className="animate-pulse">URLを分析しています...</p>
                <p className="animate-pulse delay-700">親和性の高いクリエイターを選定しています...</p>
            </div>
        </div>
    );
}

// --- サブコンポーネント: VIBE確認画面 ---
function VibeCheckScreen({ onConfirm, tags, onRemoveTag, count = 16, selectedGenre, initialGenre }: any) {
    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex p-4 bg-green-100 rounded-full text-green-700 mb-6 shadow-sm"><CheckCircle size={40} strokeWidth={3} /></div>
                <h2 className="text-4xl font-black tracking-tighter mb-3 uppercase">Analysis Complete</h2>
                <p className="text-stone-500 font-medium text-sm">分析の結果、貴店の魅力は以下のように定義されました。</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-stone-100 mb-8 ring-1 ring-stone-200/50">
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-8 text-center">Detected Vibe Tags</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                    {tags.map((tag: string, i: number) => (
                        <div
                            key={i}
                            className="group relative px-6 py-4 bg-neutral-50 text-stone-800 rounded-2xl font-black text-sm sm:text-lg animate-in zoom-in duration-300 flex items-center gap-2 shadow-sm border border-stone-200 overflow-hidden"
                        >
                            <span>{tag}</span>
                            <button
                                onClick={() => onRemoveTag(tag)}
                                className="w-7 h-7 flex items-center justify-center bg-stone-100 hover:bg-red-100 text-stone-400 hover:text-red-600 rounded-full transition-all ml-1"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                    {tags.length === 0 && <p className="text-stone-300 italic">タグがありません</p>}
                </div>
                <div className="mt-12 pt-12 border-t border-stone-100 text-center space-y-15">
                    <p className="text-xs sm:text-sm font-bold text-stone-400 flex flex-col sm:flex-row items-center justify-center gap-2">貴店と好相性のクリエイター：<span className="text-xl sm:text-4xl text-black font-black underline underline-offset-8 decoration-yellow-400 decoration-4">{count}名（{selectedGenre || initialGenre || '全ジャンル'}）</span></p>
                    <button onClick={onConfirm} className="w-full sm:w-auto px-8 sm:px-14 py-4 sm:py-5 bg-black text-white rounded-full font-black text-sm sm:text-lg hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 group">
                        <span className="truncate">マッチング候補を見る</span> <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

const ChatSheet = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [chatMessages, setChatMessages] = useState([
        { id: 1, type: "received", text: "Hello! Thank you for the offer. I am available next week.", translated: false },
        { id: 2, type: "received", text: "Can I check the menu beforehand?", translated: false },
        { id: 3, type: "sent", text: "Regarding the content: Please include our signature 'Matcha Parfait' and the interior vibe.", translated: true },
        { id: 4, type: "received", text: "Noted! I'll make sure to capture that.", translated: false },
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const nextId = useRef(5);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const assistantTemplates: Record<string, { sent: string; reply: string }> = {
        schedule: {
            sent: "Here are my available dates: March 10 (Mon), March 12 (Wed), or March 14 (Fri), anytime after 14:00. Please let me know which works best for you!",
            reply: "March 12 (Wed) at 15:00 works perfectly for me! I'll put it in my calendar. 📅",
        },
        location: {
            sent: "Here's our location info:\n📍 Shibuya, Tokyo — 3 min walk from Shibuya Station (Hachiko Exit)\nGoogle Maps: https://maps.google.com/...\nLook for the green noren curtain at the entrance!",
            reply: "Got it, thanks! I know the area well. I'll plan to arrive 15 min early to scout some angles outside too. 🎥",
        },
        menu: {
            sent: "Here's our recommended menu for filming:\n🍵 Signature Matcha Parfait (¥1,200)\n🍰 Seasonal Strawberry Mille-feuille (¥980)\n🫖 Premium Gyokuro Tea Set (¥1,500)\nAll items will be complimentary during your visit!",
            reply: "These look amazing! I'll definitely feature the Matcha Parfait as the hero shot. The tea set will also make great B-roll. Can't wait! 🍵✨",
        },
        filming: {
            sent: "Here are our filming requests:\n📸 Must-haves: Matcha Parfait close-up, interior ambiance, natural lighting shots\n⏱ Preferred: 15-30 sec Reel format\n🎵 Style: Calm lo-fi or ambient BGM\n❌ Please avoid: Kitchen back area, other customers' faces",
            reply: "Perfect brief! I was thinking a cinematic lo-fi style would suit the space. I'll bring my gimbal for smooth interior shots. Will share a rough cut within 48hrs after the shoot! 🎬",
        },
    };

    const handleAssistantReply = (type: string) => {
        const template = assistantTemplates[type];
        if (!template) return;

        const sentMsg = { id: nextId.current++, type: "sent" as const, text: template.sent, translated: true };
        setChatMessages(prev => [...prev, sentMsg]);
        scrollToBottom();

        setTimeout(() => {
            const replyMsg = { id: nextId.current++, type: "received" as const, text: template.reply, translated: false };
            setChatMessages(prev => [...prev, replyMsg]);
            scrollToBottom();
        }, 1200);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    style={{ width: 320, maxWidth: 320 }}
                    className="fixed top-0 bottom-0 right-0 bg-white shadow-2xl z-[70] border-l flex flex-col font-sans overflow-hidden"
                >
                    <div className="h-14 border-b flex items-center justify-between px-4 bg-white shrink-0">
                        <h2 className="font-bold text-base text-gray-900">Sarah Jenkins</h2>
                        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="bg-green-50 border-b border-green-100 px-3 py-1.5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-green-700">Online (AI Translation)</span>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-b border-yellow-100 px-3 py-1.5 text-center shrink-0">
                        <p className="text-[9px] text-yellow-800 flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> 推奨テンプレートをご利用ください
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 bg-gray-50 min-w-0">
                        {chatMessages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex min-w-0 ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 text-xs rounded-2xl shadow-sm whitespace-pre-line break-words overflow-hidden ${msg.type === "sent"
                                        ? "bg-black text-white rounded-tr-none"
                                        : "bg-white text-gray-800 border rounded-tl-none"
                                        }`}
                                >
                                    {msg.text}
                                    {msg.translated && (
                                        <div className="mt-1.5 pt-1.5 border-t border-white/20 flex items-center gap-1 text-[9px] text-gray-400">
                                            <Sparkles className="w-2.5 h-2.5" /> NOTS Translated
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="bg-white border-t p-3 shrink-0">
                        <p className="text-[10px] font-bold text-gray-400 mb-2">アシスタント返信</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleAssistantReply('schedule')} className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-gray-50 transition-colors group active:scale-95">
                                <Clock className="w-4 h-4 text-gray-500 mb-0.5 group-hover:text-black" />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-black">日程候補</span>
                            </button>
                            <button onClick={() => handleAssistantReply('location')} className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-gray-50 transition-colors group active:scale-95">
                                <MapPin className="w-4 h-4 text-gray-500 mb-0.5 group-hover:text-black" />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-black">地図情報</span>
                            </button>
                            <button onClick={() => handleAssistantReply('menu')} className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-gray-50 transition-colors group active:scale-95">
                                <RefreshCw className="w-4 h-4 text-gray-500 mb-0.5 group-hover:text-black" />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-black">メニュー</span>
                            </button>
                            <button onClick={() => handleAssistantReply('filming')} className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-gray-50 transition-colors group active:scale-95">
                                <Camera className="w-4 h-4 text-gray-500 mb-0.5 group-hover:text-black" />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-black">撮影要望</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const OfferModal = ({ isOpen, onClose, creator, onSend }: { isOpen: boolean; onClose: () => void; creator: Creator | null; onSend: (details: any) => void }) => {
    const creatorName = creator?.name || '';
    const isHot = !!creator?.is_hot;
    const followers = typeof creator?.followers === 'string'
        ? parseInt(creator.followers.replace(/,/g, ''), 10)
        : creator?.followers || 0;

    // CTOからの提案: フォロワー数5万以上、またはHOTバッジありを「高需要」と判定
    const followersStr = typeof creator?.followers === 'string' ? creator.followers : '0';
    const followersNum = parseInt(followersStr.replace(/,/g, '')) || 0;
    const isHighDemand = followersNum >= 50000 || (creator?.offer_count ?? 0) >= 10;

    const [plan, setPlan] = useState<'barter' | 'paid'>('barter');
    const [amount, setAmount] = useState<number>(15000);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram Reels']);
    const [selectedTags, setSelectedTags] = useState<string[]>(['看板メニュー', '店内の雰囲気']);
    const [barterDetails, setBarterDetails] = useState('');
    const [invitationMessage, setInvitationMessage] = useState('');
    const [isManualMessage, setIsManualMessage] = useState(false);
    const [isTranslating, setIsTranslating] = useState<string | null>(null);

    // 移植項目: 撮影条件 & NG事項
    const [shootingTime, setShootingTime] = useState('Flexible');
    const [staffAppearance, setStaffAppearance] = useState('OK');
    const [ngItems, setNgItems] = useState('');

    // 同意事項
    const [consent, setConsent] = useState({
        creative: false,
        noDirect: false,
        cancel: false
    });
    const isAllAgreed = consent.creative && consent.noDirect && consent.cancel;

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const togglePlatform = (platform: string) => {
        setSelectedPlatforms(prev => prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]);
    };

    const handleTranslate = async (text: string, field: 'barter' | 'message' | 'ng') => {
        if (!text) return;
        setIsTranslating(field);
        try {
            const result = await translateText(text);
            if (result.success && result.translatedText) {
                if (field === 'barter') setBarterDetails(result.translatedText);
                else if (field === 'message') setInvitationMessage(result.translatedText);
                else if (field === 'ng') setNgItems(result.translatedText);
            } else {
                // 🔴 API側からエラーが返ってきた場合の丁寧なエラーメッセージ
                console.error("Translation API returned an error:", result.error);
                alert("翻訳に失敗しました。もう一度お試しください。エラーが解消しない場合は、お手数ですが外部の翻訳ツールをご使用下さい。");
            }
        } catch (e) {
            // 🔴 ネットワークエラー等でクラッシュした場合の丁寧なエラーメッセージ
            console.error("Translation Error:", e);
            alert("翻訳に失敗しました。もう一度お試しください。エラーが解消しない場合は、お手数ですが外部の翻訳ツールをご使用下さい。");
        } finally {
            setIsTranslating(null);
        }
    };

    // Update message when barterDetails or plan changes, but only if user hasn't heavily customized it? 
    // For now, let's keep it simple as in the current code where it was a defaultValue.
    // Changing to controlled for easier translation.
    useEffect(() => {
        if (!isManualMessage) {
            setInvitationMessage(`Hi ${creatorName}! We love your style.\nOur shop has a perfect match with your style.\nWe'd like to invite you for our Experience${plan === 'paid' ? ` with \u00a5${amount.toLocaleString()} reward` : ''}.`);
        }
    }, [plan, amount, barterDetails, creatorName, isManualMessage]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <div className="bg-[#1A1A1A] px-6 py-5 flex items-center justify-between shrink-0">
                            <div>
                                <div className="text-yellow-500 text-xs font-bold flex items-center gap-1 mb-1">
                                    <Sparkles className="w-3 h-3" /> オファー作成
                                </div>
                                <h2 className="text-white text-xl font-bold">{creatorName} さんを招待</h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 overflow-y-auto">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <Gift className="w-4 h-4" /> 依頼形式
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPlan('barter')}
                                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${plan === 'barter' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-[12px] flex items-center gap-2">🎁 ギフティング</div>
                                            {plan === 'barter' && <CheckCircle className="w-5 h-5 text-black" />}
                                        </div>
                                        <div className="text-[12px] text-gray-500">商品提供のみ</div>
                                    </div>
                                    <div
                                        onClick={() => setPlan('paid')}
                                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${plan === 'paid' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-[12px] flex items-center gap-2">💰 報酬付きオファー</div>
                                            {plan === 'paid' && <CheckCircle className="w-5 h-5 text-black" />}
                                        </div>
                                        <div className="text-[12px] text-gray-500">商品提供 + 謝礼金</div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {plan === 'paid' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-sm font-bold text-gray-700">謝礼金額（¥）</label>
                                                    <input
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(Number(e.target.value))}
                                                        className="w-32 text-right font-bold bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    {[5000, 15000, 30000].map((val) => (
                                                        <button
                                                            key={val}
                                                            onClick={() => setAmount(val)}
                                                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${amount === val ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                                                        >
                                                            ¥{val.toLocaleString()}
                                                        </button>
                                                    ))}
                                                </div>
                                                {creator?.pricing_guide && (
                                                    <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-500">
                                                        <div className="flex items-start gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                                            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                                            <div className="space-y-1">
                                                                <div className="text-[11px] font-black text-indigo-600 tracking-tight leading-none">{creator.pricing_guide}</div>
                                                                <p className="text-[8px] text-indigo-400 font-bold leading-tight">直近の動画パフォーマンスに基づいて、随時変動します。<br />この金額を下回るオファーでも受諾される可能性がございます。</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {isHighDemand && (
                                    <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-4">
                                        <div>
                                            <p className="font-black text-amber-900 text-sm mb-1">👑 人気クリエイターへのオファー</p>
                                            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                                                こちらのクリエイターは人気のため、<span className="font-black">報酬付きオファー</span>を推奨します。無報酬の場合、オファー承諾率が著しく低下する可能性があります。
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" /> 希望する投稿媒体（ショート動画のみ）
                                </label>

                                <div className="flex flex-wrap gap-2.5">
                                    {['TikTok', 'Instagramリール', 'YouTubeショート', 'クリエイターに任せる・相談したい'].map(platform => (
                                        <button
                                            key={platform}
                                            onClick={() => togglePlatform(platform)}
                                            className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all duration-200 ${selectedPlatforms.includes(platform) ? 'bg-black text-white border-black shadow-md scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                        >
                                            {platform}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <Camera className="w-4 h-4" /> 撮影で盛り込んでほしい要素
                                </label>

                                <div className="flex flex-wrap gap-2.5">
                                    {['看板メニュー', '店内の雰囲気', 'スタッフの接客', '外観・看板', 'アクセス情報', '利用シーン'].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all duration-200 ${selectedTags.includes(tag) ? 'bg-black text-white border-black shadow-md scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Shooting Conditions & NG Items (Ported from ChatModal) */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> 撮影条件 & NG事項
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">希望撮影時間</p>
                                        <select
                                            value={shootingTime}
                                            onChange={(e) => setShootingTime(e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-black"
                                        >
                                            <option value="Flexible">Flexible</option>
                                            <option value="Lunch">Lunch</option>
                                            <option value="Dinner">Dinner</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">スタッフ映り込み</p>
                                        <select
                                            value={staffAppearance}
                                            onChange={(e) => setStaffAppearance(e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-black"
                                        >
                                            <option value="OK">OK</option>
                                            <option value="NG">NG</option>
                                            <option value="Ask Creator">Ask Creator</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5 flex flex-col">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">注意事項（撮影時や動画でのNG事項があれば）</p>
                                    </div>
                                    <div className="relative group">
                                        <textarea
                                            value={ngItems}
                                            onChange={(e) => setNgItems(e.target.value)}
                                            placeholder="例：他のお客様の顔は映さないでください。厨房内の撮影はご遠慮ください。"
                                            className="w-full h-20 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-black resize-none"
                                        />
                                        <div className="md:absolute md:bottom-3 md:right-3 mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex justify-end">
                                            <button
                                                onClick={() => handleTranslate(barterDetails, 'barter')}
                                                disabled={isTranslating === 'barter'}
                                                className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm
                                                ${isTranslating === 'barter' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                                            >
                                                {isTranslating === 'barter' ? (
                                                    <>
                                                        <RefreshCw size={10} className="animate-spin" /> 翻訳中...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={10} className="text-yellow-500" /> 日本語で入力してAI翻訳
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Barter Details */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <Gift className="w-4 h-4" /> クリエイターへの提供内容（英語）
                                    <span className="text-red-500 text-xs">*</span>
                                </label>

                                <div className="relative group">
                                    <textarea
                                        value={barterDetails}
                                        onChange={(e) => setBarterDetails(e.target.value)}
                                        placeholder="例：ヘッドスパ60分無料、看板メニュー「〇〇セット」の提供"
                                        className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed font-sans outline-none focus:ring-2 focus:ring-black resize-none"
                                    />
                                    {/* PCでは入力欄内、モバイルでは入力欄外に配置 */}
                                    <div className="md:absolute md:bottom-3 md:right-3 mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex justify-end">
                                        <button
                                            onClick={() => handleTranslate(barterDetails, 'barter')}
                                            disabled={isTranslating === 'barter'}
                                            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm
                                                ${isTranslating === 'barter' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                                        >
                                            {isTranslating === 'barter' ? (
                                                <>
                                                    <RefreshCw size={10} className="animate-spin" /> 翻訳中...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={10} className="text-yellow-500" /> 日本語で入力してAI翻訳
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> 招待メッセージ（英語）
                                    </label>
                                    <span className="text-xs font-bold text-yellow-600 flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                        <Sparkles className="w-3 h-3" />推奨テンプレ
                                    </span>
                                </div>
                                <div className="relative group">
                                    <textarea
                                        className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed font-mono outline-none focus:ring-2 focus:ring-black resize-none"
                                        value={invitationMessage}
                                        onChange={(e) => {
                                            setInvitationMessage(e.target.value);
                                            setIsManualMessage(true);
                                        }}
                                    />
                                    {/* PCでは入力欄内、モバイルでは入力欄外に配置 */}
                                    <div className="md:absolute md:bottom-3 md:right-3 mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex justify-end">
                                        <button
                                            onClick={() => handleTranslate(invitationMessage, 'message')}
                                            disabled={isTranslating === 'message'}
                                            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm
                                                ${isTranslating === 'message' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                                        >
                                            {isTranslating === 'message' ? (
                                                <>
                                                    <RefreshCw size={10} className="animate-spin" /> 翻訳中...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={10} className="text-yellow-500" /> 日本語で入力してAI翻訳
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                    ※このままでも送信可能ですが、このクリエイターに依頼したい理由を具体的に記載するとオファーが受諾されやすくなります。
                                </p>
                            </div>

                            {/* Section: Consent Checkboxes */}
                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> オファー・制作に関する確認事項
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={consent.creative}
                                            onChange={(e) => setConsent(prev => ({ ...prev, creative: e.target.checked }))}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                        />
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-black text-gray-900 leading-tight">表現手法の一任・修正に関する規定</p>
                                            <p className="text-[9px] text-gray-500 font-medium leading-relaxed">動画での表現手法（編集・演出等）はクリエイターに一任することに同意します。納品後の修正依頼は「事前の合意内容（上記オファー）と異なる場合」または「事実誤認」に限り最大2回までとします。</p>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={consent.noDirect}
                                            onChange={(e) => setConsent(prev => ({ ...prev, noDirect: e.target.checked }))}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                        />
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-black text-gray-900 leading-tight">直接交渉の禁止</p>
                                            <p className="text-[9px] text-gray-500 font-medium leading-relaxed">進行はすべて弊社サービスを介して行い、クリエイターとの直接連絡やプラットフォーム外での直接取引を行わないことに同意します。</p>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={consent.cancel}
                                            onChange={(e) => setConsent(prev => ({ ...prev, cancel: e.target.checked }))}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                        />
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-black text-gray-900 leading-tight">キャンセル規定</p>
                                            <p className="text-[9px] text-gray-500 font-medium leading-relaxed">マッチング成立後は速やかに決済（デポジット）を行い、その後の広告主都合によるキャンセルはできないことに同意します。※クリエイター都合によるキャンセル・納品不備があった場合は返金されます。</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0 shrink-0 bg-white">
                            <button
                                onClick={() => {
                                    if (!barterDetails.trim()) {
                                        alert('「クリエイターへの提供価値」を入力してください。\n魅力的な提供内容がオファー承諾率を高めます！');
                                        return;
                                    }
                                    if (!isAllAgreed) {
                                        alert('確認事項への同意が必要です。');
                                        return;
                                    }
                                    if (selectedPlatforms.length === 0) {
                                        alert('希望する投稿媒体を1つ以上選択してください。');
                                        return;
                                    }
                                    onSend({
                                        plan,
                                        amount,
                                        selectedPlatforms,
                                        selectedTags,
                                        barterDetails,
                                        invitationMessage,
                                        shootingTime,
                                        staffAppearance,
                                        ngItems
                                    });
                                }}
                                disabled={!isAllAgreed}
                                className={`w-full font-bold text-lg py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 ${isAllAgreed ? 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'}`}
                            >
                                <Send className="w-5 h-5" />
                                {plan === 'paid' ? `\u00a5${amount.toLocaleString()} でオファーを送る` : 'オファーを送る'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PaywallModal = ({ isOpen, onClose, companyId = 'guest', companyEmail = '', onUnlock }: { isOpen: boolean; onClose: () => void; companyId?: string; companyEmail?: string; onUnlock: () => void }) => {
    const [invitationCode, setInvitationCode] = useState("");
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [invoiceEmail, setInvoiceEmail] = useState(companyEmail || "");
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col p-8 items-center text-center relative"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors bg-stone-100 rounded-full p-2">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-yellow-50">
                            <Sparkles className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h2 className="text-lg font-black mb-4 tracking-tight">トライアルプランのオファー枠<br />上限に達しました</h2>
                        <p className="text-sm text-stone-600 font-bold leading-relaxed mb-8">
                            このクリエイターへのオファーを含め、<br />クリエイターに無制限でオファーできる<br />スタンダードプランを有効化しましょう！
                        </p>

                        <div className="w-full space-y-3 mb-6">
                            {!showInvoiceForm ? (
                                <>
                                    <a
                                        href={`https://buy.stripe.com/bJe00l5128Q1dEB64g1wY00?client_reference_id=${companyId}&prefilled_email=${encodeURIComponent(companyEmail)}`}
                                        className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-sm py-4 rounded-xl shadow-xl hover:bg-stone-800 hover:scale-[1.02] transition-all active:scale-95"
                                    >
                                        <DollarSign className="w-4 h-4" /> クレジットカードで決済
                                    </a>
                                    {/* --　<button
                                        onClick={() => setShowInvoiceForm(true)}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-black border-2 border-stone-200 font-black text-sm py-4 rounded-xl hover:border-black hover:bg-stone-50 transition-all active:scale-95"
                                    >
                                        <Layers className="w-4 h-4" /> 請求書払いを申し込む
                                    </button> */}
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    <p className="text-[11px] font-black text-slate-800 text-left">請求書を送付するメールアドレスを指定して下さい：</p>
                                    <input
                                        type="email"
                                        value={invoiceEmail}
                                        onChange={(e) => setInvoiceEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full p-4 border-2 border-slate-200 rounded-xl text-sm font-bold bg-slate-50 focus:bg-white focus:border-black outline-none transition-all"
                                    />
                                    <button
                                        onClick={() => {
                                            if (!invoiceEmail.includes('@')) {
                                                alert('正しいメールアドレスを入力してください。');
                                                return;
                                            }
                                            alert(`${invoiceEmail} 宛に請求書を送付します。\n\nスタンダードプランに変更され、オファー枠が上限がなくなりました！`);
                                            onUnlock();
                                            onClose();
                                        }}
                                        className="w-full py-4 bg-black text-white font-black rounded-xl hover:bg-stone-800 shadow-xl"
                                    >
                                        OK
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <p className="text-[10px] text-stone-400 font-bold bg-stone-50 px-4 py-2 rounded-lg inline-block border border-stone-100 ring-1 ring-inset ring-stone-900/5">
                            <Info className="w-3 h-3 inline mr-1 mb-0.5" /> 決済確認後、すぐにオファーが再開できるようになります
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


const TypingPlaceholder = ({ setUrl, value }: { setUrl: (v: string) => void, value: string }) => {
    const examples = [
        "https://www.google.com/maps/place/あなたの店舗URL...",
        "https://www.instagram.com/your_shop_profile...",
        "https://goo.gl/maps/example_short_url..."
    ];
    const [placeholder, setPlaceholder] = useState("");
    const [exampleIndex, setExampleIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentExample = examples[exampleIndex];
        const timer = setTimeout(() => {
            if (!isDeleting) {
                setPlaceholder(currentExample.slice(0, charIndex + 1));
                setCharIndex(prev => prev + 1);
                if (charIndex === currentExample.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                setPlaceholder(currentExample.slice(0, charIndex - 1));
                setCharIndex(prev => prev - 1);
                if (charIndex === 0) {
                    setIsDeleting(false);
                    setExampleIndex(prev => (prev + 1) % examples.length);
                }
            }
        }, isDeleting ? 30 : 80);
        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, exampleIndex]);

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            className="flex-1 py-5 outline-none text-base md:text-lg font-bold placeholder:text-slate-300 w-full min-w-0 bg-transparent text-slate-900"
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        />
    );
};

export default function VibeCatalogue({
    initialCreators,
    initialAssets = [],
    clientTag,
    stats = { offeredCount: 0, completedCount: 0, freshness: 0 },
    topCreators
}: {
    initialCreators: Creator[],
    initialAssets?: Asset[],
    clientTag?: string,
    stats?: { offeredCount: number; completedCount: number; freshness: number; },
    topCreators?: { thumbnail_url: string; name: string }[]
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialGenre = searchParams.get('genre')?.toUpperCase();

    const [activeTab, setActiveTab] = useState<"search" | "assets" | "analytics">(initialGenre ? "search" : "search");
    const [step, setStep] = useState<'input' | 'analyzing' | 'vibe_check' | 'result'>(initialGenre ? 'result' : 'input');
    const [sortBy, setSortBy] = useState<'vibe' | 'followers_desc' | 'followers_asc' | 'price_desc' | 'price_asc'>('vibe');
    const isInitialMount = useRef(true);

    const getPriceValue = (guide?: string) => {
        if (!guide) return 0;
        const match = guide.match(/¥([\d,]+)/);
        if (!match) return 0;
        return parseInt(match[1].replace(/,/g, ''));
    };

    const parseFollowers = (val?: string): number => {
        if (!val) return 0;
        const clean = val.replace(/,/g, '').toLowerCase();
        if (clean.includes('k')) return parseFloat(clean) * 1000;
        if (clean.includes('m')) return parseFloat(clean) * 1000000;
        return parseInt(clean) || 0;
    };

    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [assetHubHint, setAssetHubHint] = useState<string | null>(null);

    // ピックアップクリエイター（Tier S, カテゴリごとに上位3名）の選定
    const marqueeCreators = React.useMemo(() => {
        const genres = ["FOOD", "TRAVEL", "BEAUTY", "EXPERIENCE", "LIFESTYLE"];
        let selected: Creator[] = [];
        const usedIds = new Set<string>();

        // 共通のフィルタ条件: サムネイルがあり、公開中で、承認済みであること
        const basePool = initialCreators.filter(c =>
            c.thumbnail_url &&
            c.is_public &&
            c.review_status === 'approved'
        );

        genres.forEach(g => {
            const topPerGenre = basePool
                .filter(c => c.tier === 'S' && (c.genre && c.genre.includes(g)) && !usedIds.has(c.id))
                .sort((a, b) => {
                    const parseFollowers = (val: string) => {
                        if (!val) return 0;
                        const s = String(val).toUpperCase();
                        if (s.endsWith('M')) return parseFloat(s) * 1000000;
                        if (s.endsWith('K')) return parseFloat(s) * 1000;
                        return parseFloat(s);
                    };
                    return parseFollowers(b.followers) - parseFollowers(a.followers);
                })
                .slice(0, 3);

            topPerGenre.forEach(c => {
                selected.push(c);
                usedIds.add(c.id);
            });
        });

        // もし人数が足りない場合は全体から補填（ユニーク性は維持）
        if (selected.length < 12) {
            const extra = basePool
                .filter(c => !usedIds.has(c.id))
                .slice(0, 15 - selected.length);
            selected = [...selected, ...extra];
        }
        return selected;
    }, [initialCreators]);

    const [url, setUrl] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(initialGenre || 'FOOD');
    const [shopVibe, setShopVibe] = useState<string[]>(initialGenre ? ['#和モダン', '#シズル感', '#インバウンド人気'] : []);
    const [matchCount, setMatchCount] = useState(0);
    // デモ用の初期VIBEクラスター。URL分析後はGeminiが自動選定した値で上書き
    const [shopVibeClusters, setShopVibeClusters] = useState<string[]>(['Street', 'Vlog', 'Traditional']);
    const [invitedCreatorIds, setInvitedCreatorIds] = useState<Set<string>>(new Set());
    const [rejectedCreators, setRejectedCreators] = useState<Creator[]>([]);
    const [upsellInsight, setUpsellInsight] = useState<{
        upsellPlan: "AI_AUTO_TUNE" | "PREMIUM_BOOST" | "NONE";
        upsellMessage: string;
    } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [filterGenre, setFilterGenre] = useState<string>(initialGenre || 'ALL');
    const [searchGenre, setSearchGenre] = useState<string | null>(initialGenre || null);
    const [searchGenreCount, setSearchGenreCount] = useState<number>(0);
    const [filterRegion, setFilterRegion] = useState<string>('ALL');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedChatAsset, setSelectedChatAsset] = useState<Asset | null>(null);

    // チャットボタンクリック時のガード処理
    const handleOpenChat = (asset: Asset) => {
        const allowedStatuses = ['APPROVED', 'WORKING', 'COMPLETED', 'DELIVERED', 'confirmed'];
        if (!allowedStatuses.includes(asset.status.toUpperCase())) {
            alert('チャットはオファーが承認された後に開通します。');
            return;
        }
        setSelectedChatAsset(asset);
        setIsChatOpen(true);
    };
    const [synced, setSynced] = useState(false);
    const [freshness, setFreshness] = useState(85);
    const [showFreshnessTooltip, setShowFreshnessTooltip] = useState(false);
    const [assetInsights, setAssetInsights] = useState<Record<string, any>>({});
    const [urlError, setUrlError] = useState<string | null>(null);

    // 検索後の件数を不整合なく保持する
    useEffect(() => {
        if (step === 'result' && searchGenre) {
            const count = initialCreators.filter(c =>
                (searchGenre === 'ALL' || (c.genre && c.genre.includes(searchGenre.toUpperCase()))) &&
                (c.tier === 'S' || c.tier === 'A') &&
                (c.is_public && c.review_status === 'approved')
            ).length;
            setSearchGenreCount(count);
        }
    }, [step, searchGenre, initialCreators]);
    const [localAssets, setLocalAssets] = useState<Asset[]>(initialAssets);

    const [freeOffers, setFreeOffers] = useState(3);
    const [isPremium, setIsPremium] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(true);
    const [shop, setShop] = useState<any>(null);
    const [hasNewNotifications, setHasNewNotifications] = useState(true);
    const [hasNewMessages, setHasNewMessages] = useState(true);

    const fetchShopInfo = async () => {
        const supabase = createClient();
        // ログイン中のユーザーを取得
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsFetchingInfo(false); return; }

        const { data, error } = await supabase
            .from('shops')
            .select('id, name, genre, is_premium, logo_url, free_offers_remaining')
            .eq('id', user.id)
            .single();

        if (data && !error) {
            setShop(data);
            setFreeOffers(data.free_offers_remaining ?? 3);
            setIsPremium(data.is_premium ?? false);
        }
        setIsFetchingInfo(false);
    };

    useEffect(() => {
        fetchShopInfo();
    }, []);

    const fetchAssets = async () => {
        if (!shop?.id) return;
        const supabase = createClient();
        const { data: fetchedAssets } = await supabase
            .from('assets')
            .select(`
                *,
                creator: creators ( name, tiktok_handle, portfolio_video_urls, avatar_url )
            `)
            .eq('shop_id', shop.id);

        if (fetchedAssets) {
            setLocalAssets(fetchedAssets);
        }
    };

    useEffect(() => {
        if (shop?.id) {
            fetchAssets();
            const channel = createClient()
                .channel('assets_update')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'assets', filter: `shop_id=eq.${shop.id}` }, () => {
                    fetchAssets();
                })
                .subscribe();
            return () => { createClient().removeChannel(channel); };
        }
    }, [shop]);

    // 🌟 URL検索やステップ遷移時に必ず最上部を表示する (初回マウントやブラウザバック時は維持)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step, activeTab]);

    // Derived stats from localAssets
    const offeredCount = localAssets.filter(a => a.status === 'OFFERED' || a.status === 'DECLINED').length;
    const completedCount = localAssets.filter(a => a.status === 'COMPLETED').length; // Mock removed
    const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [currentAssetId, setCurrentAssetId] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<{ urls: string[]; name: string } | null>(null);
    const [showDetails, setShowDetails] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [celebrationAssetId, setCelebrationAssetId] = useState<string | null>(null);

    const filteredCreators = initialCreators.filter(c => {
        const genreMatch = filterGenre === 'All' || filterGenre === 'ALL' || (c.genre && c.genre.includes(filterGenre.toUpperCase()));
        const regionMatch = filterRegion === 'ALL'
            || (filterRegion === 'WESTERN' && (c.ethnicity === 'AMERICA' || c.ethnicity === 'EUROPE'))
            || (filterRegion === 'ASIAN' && c.ethnicity === 'ASIA')
            || (filterRegion === 'GLOBAL');
        // Tier S/A 限定 + Public(onboarded && approved) のみ表示（ノイズゼロ担保）
        const tierOk = c.tier === 'S' || c.tier === 'A';
        const publicOk = c.is_public && c.review_status === 'approved';
        return genreMatch && regionMatch && tierOk && publicOk;
    }).map(c => {
        // ===== VIBEマッチングスコア計算 (Base+Bonus方式) =====
        const creatorVibes = c.vibe_tags.map(t => t.toLowerCase());

        // 1. VIBEクラスターのマッチング（部分一致）
        const matched = shopVibeClusters.filter(cluster =>
            creatorVibes.some(tag =>
                tag.toLowerCase().includes(cluster.toLowerCase()) ||
                cluster.toLowerCase().includes(tag.toLowerCase())
            )
        );

        // 2. Base Score: カテゴリ必須条件を満たしている時点で75%
        const baseScore = 75;

        // 3. Vibe Bonus: 一致クラスターごとに+10%
        const vibeBonus = matched.length * 10;

        // 4. Tier Bonus: Supabaseの tier カラムを参照 (安定化のため揺らぎを排除)
        let tierBonus = 0;
        if (c.tier === 'S') tierBonus = 5;
        else if (c.tier === 'A') tierBonus = 3;
        else if (c.tier === 'B') tierBonus = 2;

        // 5. 合計スコア（上限は99%）
        // 安定化のため、10の倍数付近でキリの良い数字にする（若干の揺らぎを吸収）
        const rawScore = baseScore + vibeBonus + tierBonus;
        let score = Math.min(rawScore, 99);

        // スコア表示の安定化: 5%刻み、または下1桁を固定するなどの処理を検討。
        // ここでは単純に整数であることを保証し、上限を99にする
        score = Math.floor(score);

        // 6. HOT Boost: 急上昇クリエイターを確実に上位へ (さらに+5ポイント、上限100へ拡大)
        if (c.is_hot) {
            score = Math.min(score + 5, 100);
        }

        return { ...c, vibeMatchScore: score, matchedClusters: matched };
    }).sort((a, b) => {
        if (sortBy === 'vibe') {
            const scoreA = a.vibeMatchScore ?? 0;
            const scoreB = b.vibeMatchScore ?? 0;
            return scoreB - scoreA;
        } else if (sortBy === 'followers_desc') {
            return parseFollowers(b.followers) - parseFollowers(a.followers);
        } else if (sortBy === 'followers_asc') {
            return parseFollowers(a.followers) - parseFollowers(b.followers);
        } else if (sortBy === 'price_desc') {
            return getPriceValue(b.pricing_guide) - getPriceValue(a.pricing_guide);
        } else if (sortBy === 'price_asc') {
            return getPriceValue(a.pricing_guide) - getPriceValue(b.pricing_guide);
        }
        return 0;
    });

    // mock data for UI fallback removed in favor of initialAssets

    // Mock analysis effect removed as we now use /analyzing page with real server action

    const handleUrlSubmit = () => {
        if (!url) return;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            setUrlError('有効なURL形式（http:// または https://）を入力してください。');
            return;
        }
        setUrlError(null);
        setStep('analyzing');

        startTransition(async () => {
            try {
                const DEMO_CLUSTERS = ['Street', 'Vlog', 'Traditional'];
                const result = await analyzeShopVibe(url, selectedGenre);
                if (result.success && result.tags) {
                    setShopVibe(result.tags);
                    setMatchCount(result.matchCount || 0);
                    // mappedVibeClusters が空の場合はデモ値を維持
                    const clusters = (result as any).mappedVibeClusters;
                    if (Array.isArray(clusters) && clusters.length > 0) {
                        setShopVibeClusters(clusters);
                    }
                    // Sync to DB if clientTag is available
                    if (clientTag) {
                        saveShopVibeTags(clientTag, result.tags, clusters && clusters.length > 0 ? clusters : DEMO_CLUSTERS);
                    }
                    setFilterGenre(selectedGenre); // カタログ表示も同期
                    setSearchGenre(selectedGenre); // 検索時のカテゴリを保持
                    setStep('vibe_check');
                } else {
                    // Fallback
                    console.warn("Analysis failed, using fallback data");
                    setShopVibe(['#和モダン', '#シズル感', '#隠れ家']);
                    setFilterGenre(selectedGenre);
                    // フィルタ適用後の件数をセット
                    const fallbackCount = initialCreators.filter(c => {
                        const genreMatch = selectedGenre === 'All' || selectedGenre === 'ALL' || (c.genre && c.genre.includes(selectedGenre.toUpperCase()));
                        const tierOk = c.tier === 'S' || c.tier === 'A';
                        const publicOk = c.is_public && c.review_status === 'approved';
                        return genreMatch && tierOk && publicOk;
                    }).length;
                    setMatchCount(fallbackCount);
                    setSearchGenre(selectedGenre);
                    setStep('vibe_check');
                }
            } catch (error: any) {
                console.error("Analysis Error:", error);
                if (error.message?.includes('Too many requests')) {
                    alert('リクエストが多すぎます。しばらく時間を置いてから再度お試しください。');
                }
                setStep('input');
            }
        });
    };

    const openInviteModal = (creator: Creator) => {
        setSelectedCreator(creator);
        if (freeOffers > 0) {
            setIsModalOpen(true);
        } else if (!isPremium) {
            setShowPaywall(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleOfferSent = async (details: any) => {
        if (!selectedCreator) return;

        // 🌟 修正: IDだけでなく、基本情報（店舗名とジャンル）があるかだけをチェックする
        if (!shop?.id || !shop?.name || !shop?.genre) {
            alert("プロフィールの基本情報（必須項目）が未設定です。");
            setIsSettingsOpen(true); // 自動的に設定モーダルを開いてあげるUX
            return;
        }

        try {
            const res = await offerCreator({
                creatorId: selectedCreator.id,
                shopId: shop.id, // 🔴 'demo-shop' などのダミー文字を排除し、必ずUUIDを渡す
                creatorName: selectedCreator.name,
                creatorAvatar: selectedCreator.avatar || selectedCreator.thumbnail_url || undefined,
                offerDetails: details,
                barterDetails: details.barterDetails,
            });

            if (res.success) {
                setInvitedCreatorIds(prev => new Set(prev).add(selectedCreator.id));
                if (!isPremium && res.freeOffersRemaining !== undefined) {
                    setFreeOffers(res.freeOffersRemaining);
                }
                if (res.assetId) {
                    setCurrentAssetId(res.assetId);
                    setLocalAssets(prev => [
                        ...prev,
                        {
                            id: res.assetId!,
                            client_tag: clientTag || '',
                            creator_id: selectedCreator.id,
                            status: 'OFFERED',
                            created_at: new Date().toISOString(),
                            creator: {
                                name: selectedCreator.name,
                                tiktok_handle: selectedCreator.name,
                                avatar_url: selectedCreator.thumbnail_url || selectedCreator.avatar || undefined,
                            }
                        } as Asset
                    ]);
                }
                setIsSent(true);
                setTimeout(() => {
                    setIsModalOpen(false);
                    setIsSent(false);
                    // 修正: 自動でチャットを開かずにヒントを表示
                    setAssetHubHint("オファーの進行状況はここからチェックできます");
                    // 3秒後にヒントを表示
                    setTimeout(() => setAssetHubHint(null), 3000);
                }, 3000);
            } else if (res.error === 'PAYWALL_REQUIRED') {
                setShowPaywall(true);
                setIsModalOpen(false);
            } else {
                // 🌟 追加: 無言で失敗せず、何のエラーか画面に表示させる
                alert(`オファー送信エラー: ${res.error}`);
            }
        } catch (error) {
            console.error("Offer failed", error);
            alert("予期せぬエラーが発生しました。");
        }
    };

    const handleReject = (creator: Creator) => {
        setRejectedCreators(prev => [...prev, creator]);

        // Update local assets status to REJECTED - this will hide the card from Negotiating section
        setLocalAssets(prev => prev.map(a =>
            (a.creator_id === creator.id || a.creator?.tiktok_handle === creator.name)
                ? { ...a, status: 'REJECTED' }
                : a
        ));

        handleAnalyzeInsight(creator);
    };

    const handleAnalyzeInsight = (creator: Creator) => {
        startTransition(async () => {
            try {
                const result = await analyzeAssetInsight({
                    assetId: `analyze_${creator.id}_${Date.now()}`,
                    creatorId: creator.id,
                    shopId: clientTag || "demo-shop",
                    shopRequirements: shopVibe,
                    creatorTags: creator.vibe_tags
                });

                if (result.success) {
                    setAssetInsights(prev => ({
                        ...prev,
                        [creator.id]: result.insight
                    }));

                    if (result.insight.shopUpsellPlan !== "NONE") {
                        setUpsellInsight({
                            upsellPlan: result.insight.shopUpsellPlan,
                            upsellMessage: result.insight.shopUpsellMessage
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to analyze insight:", error);
            }
        });
    };

    return (
        <div className="min-h-[100dvh] bg-stone-50 font-sans text-stone-900 pb-32 pt-14">
            <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 z-40 px-6 flex items-center justify-between">
                <div className="font-black text-xl tracking-tighter flex items-center gap-1.5 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setActiveTab("search")}>
                    INSIDERS.
                </div>

                {/* --- Popup Backdrops: Click outside to close --- */}
                {(isNotificationOpen || isChatListOpen || isProfileOpen) && (
                    <div
                        className="fixed inset-0 z-40 bg-transparent cursor-default"
                        onClick={() => {
                            setIsNotificationOpen(false);
                            setIsChatListOpen(false);
                            setIsProfileOpen(false);
                        }}
                    />
                )}

                <div className="flex items-center gap-3 relative z-50">
                    <button
                        onClick={() => setIsOnboardingOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-all active:scale-95 group"
                    >
                        <HelpCircle className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
                        <span className="text-[10px] font-bold">使い方</span>
                    </button>

                    <button
                        onClick={() => {
                            setIsNotificationOpen(!isNotificationOpen);
                            setIsChatListOpen(false);
                            setIsProfileOpen(false);
                            setHasNewNotifications(false);
                        }}
                        className="relative p-2.5 text-stone-400 hover:bg-stone-100 rounded-full transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        {hasNewNotifications && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        )}
                    </button>
                    {isNotificationOpen && (
                        <div className="fixed top-20 left-1/2 -translate-x-1/2 sm:absolute sm:top-14 sm:right-0 sm:left-auto sm:translate-x-0 w-[calc(100vw-32px)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-stone-100 font-black text-xs uppercase tracking-widest text-stone-500 bg-stone-50">Notifications</div>
                            <div className="max-h-80 overflow-y-auto">
                                {localAssets.filter(a => a.status === 'COMPLETED' || a.status === 'DECLINED').length === 0 && (
                                    <div className="p-8 text-center text-xs text-stone-400">新しい通知はありません</div>
                                )}
                                {localAssets.filter(a => a.status === 'COMPLETED').map(a => (
                                    <div key={`notif-completed-${a.id}`} className="p-4 border-b border-stone-50 hover:bg-stone-50 transition cursor-pointer" onClick={() => { setIsNotificationOpen(false); setActiveTab('assets'); }}>
                                        <div className="text-xs font-bold text-stone-900 mb-1">🎬 動画が納品されました</div>
                                        <div className="text-[10px] text-stone-500">{a.creator?.name || a.creator?.tiktok_handle}さんの動画が完成しました！Asset Hubで確認しましょう。</div>
                                    </div>
                                ))}
                                {localAssets.filter(a => a.status === 'DECLINED').map(a => (
                                    <div key={`notif-declined-${a.id}`} className="p-4 border-b border-stone-50 hover:bg-stone-50 transition cursor-pointer" onClick={() => { setIsNotificationOpen(false); setActiveTab('assets'); }}>
                                        <div className="text-xs font-bold text-red-600 mb-1">⚠️ オファーが辞退されました</div>
                                        <div className="text-[10px] text-stone-500">{a.creator?.name || a.creator?.tiktok_handle}さんが今回は案件を見送りました。別のクリエイターを探してみましょう。</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setIsChatListOpen(!isChatListOpen);
                            setIsNotificationOpen(false);
                            setIsProfileOpen(false);
                            setHasNewMessages(false);
                        }}
                        className="relative p-2.5 text-stone-400 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        {hasNewMessages && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
                        )}
                    </button>
                    {isChatListOpen && (
                        <div className="fixed top-20 left-1/2 -translate-x-1/2 sm:absolute sm:top-14 sm:right-0 sm:left-auto sm:translate-x-0 w-[calc(100vw-32px)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-stone-100 font-black text-xs uppercase tracking-widest text-stone-500 bg-stone-50">Messages</div>
                            <div className="max-h-80 overflow-y-auto">
                                {localAssets
                                    .filter(a => a.creator && (a.status === 'APPROVED' || a.status === 'WORKING' || a.status === 'COMPLETED' || a.status === 'DELIVERED' || a.status === 'confirmed' || a.status === 'ACTIVE'))
                                    .map(a => (
                                        <button
                                            key={a.id}
                                            onClick={() => {
                                                handleOpenChat(a);
                                                setIsChatListOpen(false);
                                            }}
                                            className="w-full p-4 flex items-center gap-3 hover:bg-stone-50 border-b border-stone-50 transition text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200 overflow-hidden">
                                                {a.creator?.avatar_url ? (
                                                    <img src={a.creator.avatar_url} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <User className="w-6 h-6 text-stone-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-xs font-bold text-stone-900 truncate">{a.creator?.name || a.creator?.tiktok_handle}</div>
                                                <div className="text-[10px] text-stone-400 truncate mt-0.5">タップしてメッセージを開く</div>
                                            </div>
                                        </button>
                                    ))}
                                {localAssets.length === 0 && (
                                    <div className="p-8 text-center text-xs text-stone-400">現在メッセージはありません</div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationOpen(false); setIsChatListOpen(false); }}
                            className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm transition-transform active:scale-95"
                        >
                            <img
                                src={shop?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(shop?.name || 'Shop')}&background=0D8ABC&color=fff`}
                                className="w-full h-full object-cover"
                                alt="Shop"
                            />
                        </button>
                        {isProfileOpen && (
                            <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                                <div className="p-4 border-b border-slate-100 mb-2">
                                    <div className="text-sm font-black text-slate-900 truncate">{shop?.name || "店舗名未設定"}</div>
                                    <div className="text-[10px] font-bold text-amber-600 bg-amber-50 inline-block px-1.5 py-0.5 rounded mt-1">
                                        {shop?.is_premium ? "スタンダードプラン" : "トライアルプラン"}
                                    </div>
                                </div>
                                <div className="px-2 pb-2">
                                    <button onClick={() => { setIsSettingsOpen(true); setIsProfileOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg flex items-center gap-2 transition">
                                        <User className="w-4 h-4" /> プロフィール編集
                                    </button>
                                    <button onClick={() => { setIsProfileOpen(false); window.location.href = '/advertiser/settings'; }} className="w-full text-left px-3 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg flex items-center gap-2 transition">
                                        <SettingsIcon className="w-4 h-4" /> 設定
                                    </button>
                                    <div className="my-1 border-t border-stone-100" />
                                    <button
                                        onClick={async () => {
                                            const supabase = createClient();
                                            await supabase.auth.signOut();
                                            window.location.href = '/login';
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition"
                                    >
                                        <X className="w-4 h-4" /> ログアウト
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === "search" && (
                    <motion.div
                        key="search"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="animate-in fade-in"
                    >
                        <main className="max-w-4xl mx-auto px-4 pt-8 overflow-x-hidden md:overflow-visible">
                            {step === 'input' && (
                                <div className="space-y-12 pb-12 text-center animate-in fade-in zoom-in-95 duration-700">
                                    {/* Hero Section */}
                                    <div className="space-y-6 mb-4 max-w-[280px] sm:max-w-xl mx-auto">
                                        <div className="inline-flex items-center gap-2 bg-indigo-50/50 text-indigo-700 border border-indigo-100 rounded-full px-5 py-2 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-1000">
                                            <Sparkles className="w-4 h-4 text-indigo-500" />
                                            <span className="text-[11px] sm:text-[14px] font-bold tracking-wide whitespace-nowrap">
                                                あなたのお店をインバウンドの目的地に
                                            </span>
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 italic duration-700 px-2 sm:px-0">
                                            Find your best<br />Inbound Creators!
                                        </h1>
                                        <p className="text-slate-500 font-bold max-w-[280px] sm:max-w-xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 px-4">
                                            貴店のGoogleマップまたはInstagramのURLを入力してください。<br className="hidden sm:block" />INSIDERS.が保有する1000組以上のデータベースから、貴社にピッタリのインバウンドクリエイターを即座にご紹介します。
                                        </p>
                                    </div>

                                    {/* Search Input Bar */}
                                    <div className="max-w-[320px] sm:max-w-4xl mx-auto space-y-12 mt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                                        <div className="relative group">
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-indigo-600/20 rounded-[30px] md:rounded-[40px] blur-3xl opacity-60 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 -z-10 mx-auto max-w-xl"></div>
                                            <div className="absolute inset-4 bg-violet-600/10 rounded-[30px] md:rounded-[40px] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 -z-10 mx-auto max-w-lg"></div>

                                            <div className="relative bg-white/80 backdrop-blur-xl p-1.5 md:p-2.5 rounded-[30px] shadow-2xl border border-white/50 flex flex-col overflow-hidden max-w-2xl mx-auto">
                                                <div className="flex flex-col md:flex-row items-center gap-2">
                                                    {/* Genre Select (The Wand's head) */}
                                                    <div className="relative border-b md:border-b-0 md:border-r border-slate-100 pr-2 flex items-center shrink-0 w-full md:w-auto">
                                                        <select
                                                            value={selectedGenre}
                                                            onChange={(e) => setSelectedGenre(e.target.value)}
                                                            className="appearance-none bg-transparent font-black text-sm pl-8 pr-12 py-4 outline-none cursor-pointer tracking-widest uppercase text-slate-900 w-full"
                                                        >
                                                            <option value="FOOD">🍣 Food</option>
                                                            <option value="BEAUTY">💅 Beauty</option>
                                                            <option value="TRAVEL">⛩️ Travel</option>
                                                            <option value="EXPERIENCE">🧖‍♀️ Experience</option>
                                                            <option value="LIFESTYLE">✨ Lifestyle</option>
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-6 pointer-events-none" />
                                                    </div>

                                                    {/* URL Input (The Wand's body) */}
                                                    <div className="flex items-center flex-1 w-full px-6 gap-4 min-w-0">
                                                        <Search className="w-6 h-6 text-slate-300 shrink-0" />
                                                        <TypingPlaceholder setUrl={setUrl} value={url} />
                                                    </div>

                                                    {/* Submit Button (The Wand's Sparkle) */}
                                                    <div className="w-full md:w-auto p-1.5 md:p-0">
                                                        <button
                                                            onClick={handleUrlSubmit}
                                                            className="w-full md:w-auto md:min-w-[180px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 sm:py-4.5 rounded-[22px] md:rounded-[25px] font-black text-sm sm:text-xs uppercase tracking-widest hover:shadow-indigo-500/25 hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group/btn shadow-xl shadow-indigo-500/10"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                                                            <span>分析を開始する</span>
                                                            <Sparkles size={18} className="text-yellow-400" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Inline Error within the bar */}
                                                <AnimatePresence>
                                                    {urlError && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="px-8 py-4 bg-red-50/50 border-t border-red-100 flex items-center gap-3 mt-2 rounded-2xl"
                                                        >
                                                            <AlertCircle size={16} className="text-red-500" />
                                                            <p className="text-red-600 text-[11px] font-black uppercase tracking-widest">
                                                                {urlError}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="mt-2"></div>
                                        </div>


                                        {/* Social Proof: Infinite Marquee */}
                                        <div className="relative pt-0 mt-0 sm:mt-2 select-none pointer-events-none z-0">
                                            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                                            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                                            <div className="flex overflow-hidden gap-6 mask-fade-edges">
                                                <div className="flex gap-6 animate-ticker-fast whitespace-nowrap py-4">
                                                    {[...marqueeCreators, ...marqueeCreators].map((creator, i) => (
                                                        <div key={`${creator.id}-${i}`} className="inline-block w-32 md:w-40 bg-white/40 backdrop-blur-sm border border-slate-100 rounded-2xl p-3 shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                                                            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-slate-100">
                                                                <img
                                                                    src={creator.thumbnail_url || undefined}
                                                                    className="w-full h-full object-cover"
                                                                    loading="eager"
                                                                />
                                                            </div>
                                                            <div className="text-[10px] font-black text-slate-900 truncate">@{creator.name}</div>
                                                            <div className="text-[8px] font-bold text-slate-400">{creator.followers} followers</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-bold mt-6 tracking-widest uppercase">Trusted by 1,000+ <br />top creators worldwide</p>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {step === 'analyzing' && <AnalyzingScreen />}

                            {step === 'vibe_check' && (
                                <VibeCheckScreen
                                    tags={shopVibe}
                                    count={filteredCreators.length}
                                    onRemoveTag={(tag: string) => setShopVibe(prev => prev.filter(t => t !== tag))}
                                    onConfirm={() => {
                                        setStep('result');
                                    }}
                                    selectedGenre={selectedGenre}
                                    initialGenre={initialGenre}
                                />
                            )}

                            {step === 'result' && (
                                <div className="space-y-8 py-8">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-stone-100 pb-6 gap-6">
                                        <div className="space-y-2 sm:space-y-1 text-left w-full sm:w-auto">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div className="order-2 sm:order-1">
                                                    <h2 className="text-4xl sm:text-4xl font-black tracking-tighter whitespace-nowrap">Creator Catalog</h2>
                                                </div>
                                                <div className="order-1 sm:order-2 flex flex-wrap gap-2 mb-2 sm:mb-0">
                                                    {initialGenre && (
                                                        <span className="bg-black text-white text-[9px] sm:text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-lg border border-white/20 animate-in fade-in slide-in-from-left-4 duration-1000">
                                                            <Sparkles className="w-3 h-3 text-yellow-400" /> {initialGenre}
                                                        </span>
                                                    )}
                                                    {freeOffers > 0 && (
                                                        <span className="bg-yellow-100 text-yellow-800 text-[9px] sm:text-[10px] px-3 py-1 rounded-full font-black flex items-center gap-1.5 shadow-sm border border-yellow-200">
                                                            <Sparkles className="w-3 h-3 text-yellow-500" /> 残り {freeOffers}/3 回無料
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-900 text-sm sm:text-md font-medium">貴店と好相性のクリエイター：<span className="font-bold text-gray-900">{searchGenreCount || (filterGenre === searchGenre ? filteredCreators.length : 0) || '...'}名（{(searchGenre || initialGenre || '全カテゴリ').toUpperCase()}）</span></p>
                                            <p className="text-[12px] sm:text-[12px] text-stone-400 mt-1">選択したカテゴリ以外にも魅力的なクリエイターがいますので、ぜひオファーをご検討下さい。</p>
                                        </div>

                                        {/* SORT UI */}
                                        <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-2xl border border-stone-200 shadow-sm self-end sm:self-center">
                                            <BarChart3 className="w-4 h-4 text-stone-400 ml-1.5" />
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as any)}
                                                className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-stone-600 focus:ring-0 cursor-pointer pr-8"
                                            >
                                                <option value="vibe">おすすめ順</option>
                                                <option value="followers_desc">フォロワーが多い順</option>
                                                <option value="followers_asc">フォロワーが少ない順</option>
                                                <option value="price_desc">推奨金額が高い順</option>
                                                <option value="price_asc">推奨金額が低い順</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex gap-2 flex-nowrap overflow-x-auto pt-4 pb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                                            {[
                                                { key: 'ALL', label: 'All' },
                                                { key: 'FOOD', label: '🍣 Food' },
                                                { key: 'BEAUTY', label: '💅 Beauty' },
                                                { key: 'TRAVEL', label: '⛩️ Travel' },
                                                { key: 'EXPERIENCE', label: '🧖‍♀️ Experience' },
                                                { key: 'LIFESTYLE', label: '✨ Lifestyle' },
                                            ].map(tab => (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => setFilterGenre(tab.key)}
                                                    className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all duration-500 whitespace-nowrap ${filterGenre === tab.key
                                                        ? tab.key === searchGenre
                                                            ? 'bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-500 text-black scale-110 ring-4 ring-yellow-400/50 z-10 border-none px-6'
                                                            : 'bg-black text-white shadow-[0_15px_30px_rgba(0,0,0,0.3)] scale-110 ring-2 ring-black ring-offset-2 z-10'
                                                        : tab.key === searchGenre
                                                            ? 'bg-yellow-100 text-amber-700 border-2 border-yellow-300 shadow-[0_5px_15px_rgba(251,191,36,0.3)] opacity-100 px-6'
                                                            : 'bg-white text-stone-400 border border-stone-200 hover:border-stone-400 hover:text-stone-600 px-5'
                                                        }`}
                                                >
                                                    <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                                                        <span>{tab.label}</span>
                                                        {tab.key === searchGenre && <Sparkles className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${filterGenre === tab.key ? 'animate-pulse' : ''}`} />}
                                                    </span>
                                                    {tab.key === searchGenre && (
                                                        <>
                                                            <span className="absolute -top-2 -right-1 bg-yellow-400 text-black text-[8px] px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 font-bold border border-white">
                                                                MATCHED
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {/* ShopUpsellBanner moved to 資産鮮度 */}
                                        </AnimatePresence>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                                        {filteredCreators.filter(c => !invitedCreatorIds.has(c.id)).map((creator, index) => (
                                            <CreatorCard
                                                key={creator.id}
                                                creator={creator}
                                                priority={index < 8}
                                                onOffer={(c) => openInviteModal(c)}
                                                onPlayVideo={(urls) => setSelectedVideo({ urls, name: creator.name })}
                                            />
                                        ))}
                                    </div>

                                    {filteredCreators.length === 0 && (
                                        <div className="text-center py-20">
                                            <p className="text-stone-300 font-bold text-lg">条件に一致するクリエイターが見つかりませんでした</p>
                                            <button onClick={() => { setFilterGenre('ALL'); setFilterRegion('ALL'); }} className="mt-4 text-sm text-stone-500 underline hover:text-black">フィルターをリセット</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </main>
                    </motion.div>
                )}

                {activeTab === "assets" && (
                    <motion.div
                        key="assets"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <main className="max-w-6xl mx-auto px-4 pt-8 pb-32 space-y-16">
                            <header className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-stone-100 pb-8 gap-4 text-center md:text-left">
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">Asset Hub</h2>
                                    <p className="text-stone-400 text-xs sm:text-sm font-black uppercase tracking-[0.2em]">動画を集客資産として管理</p>
                                </div>
                            </header>

                            {/* Dynamic KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center space-y-2 group hover:shadow-xl transition-all"
                                >
                                    <div className="text-5xl font-black text-stone-900 group-hover:text-indigo-600 transition-colors">
                                        <AnimatedCounter value={offeredCount} />
                                    </div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">交渉中クリエイター</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center space-y-2 group hover:shadow-xl transition-all"
                                >
                                    <div className="text-5xl font-black text-stone-900 group-hover:text-emerald-500 transition-colors">
                                        <AnimatedCounter value={completedCount} />
                                    </div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">獲得済み動画数</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center space-y-2 group hover:shadow-xl transition-all relative"
                                >
                                    <div className="text-5xl font-black text-emerald-500 flex items-center gap-1 group-hover:scale-110 transition-transform">
                                        <AnimatedCounter value={stats.freshness} />
                                        <span className="text-2xl">%</span>
                                    </div>
                                    <p
                                        className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] flex items-center gap-1 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowFreshnessTooltip(!showFreshnessTooltip);
                                        }}
                                    >
                                        資産鮮度 <Info size={12} className="opacity-50" />
                                    </p>

                                    {/* Action Proposal - Overlay Tooltip */}
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-stone-900 p-4 rounded-2xl shadow-2xl transition-all z-50 pointer-events-none ${showFreshnessTooltip ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-stone-900" />
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
                                                <Sparkles size={14} className="text-yellow-400" />
                                            </div>
                                            <p className="text-[11px] font-bold text-stone-200 leading-relaxed text-left">
                                                資産鮮度は、SNSにおけるPR効果の目安です。投稿後1ヶ月ほどがピークで、その後は緩やかに低下します。SNS以外にもGoogleマップに掲載して活用したり、定期的に動画を追加投稿することで、集客効果を最大化できます。
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-xl font-black tracking-tight text-center md:text-left uppercase">オファーと交渉状況</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {(localAssets.length > 0 ? localAssets : initialAssets).filter(a => ['OFFERED', 'DECLINED', 'WORKING', 'COMPLETED', 'APPROVED', 'DELIVERED', 'FINALIZED'].includes(a.status || '')).map((asset) => {
                                        const creatorName = asset.creator?.name || asset.creator?.tiktok_handle || 'Unknown Creator';
                                        const dateStr = asset.created_at ? new Date(asset.created_at).toISOString().split('T')[0] : '2024-03-01';
                                        const src = asset.creator?.avatar_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3000&auto=format&fit=crop';
                                        const isDeclined = asset.status === 'DECLINED';

                                        // タイムラインの構築（実際のデータがない場合はフォールバック表示）
                                        const timeline = [
                                            { label: 'オファー送信済み', date: asset.created_at, active: true, icon: <Send size={10} /> },
                                            {
                                                label: isDeclined ? 'オファー不承諾' : 'オファー承諾',
                                                date: isDeclined ? asset.updated_at : asset.approved_at,
                                                active: isDeclined || !!asset.approved_at,
                                                icon: isDeclined ? <AlertTriangle size={10} /> : <CheckCircle size={10} />,
                                                isError: isDeclined,
                                                description: isDeclined && (asset as any).rejection_reason ? `理由: ${(asset as any).rejection_reason}` : undefined
                                            },
                                            ...(isDeclined ? [] : [
                                                { label: '撮影完了', date: (asset as any).offer_details?.timeline?.filming_at, active: !!(asset as any).offer_details?.timeline?.filming_at, icon: <Camera size={10} /> },
                                                { label: '納品完了', date: (asset as any).offer_details?.timeline?.delivered_at || (asset.status === 'DELIVERED' ? asset.updated_at : undefined), active: asset.status === 'DELIVERED' || asset.status === 'FINALIZED' || !!(asset as any).offer_details?.timeline?.delivered_at, icon: <Video size={10} /> },
                                                { label: '最終承認', date: asset.status === 'FINALIZED' ? asset.updated_at : (asset as any).offer_details?.timeline?.confirmed_at, active: asset.status === 'FINALIZED' || !!(asset as any).offer_details?.timeline?.confirmed_at, icon: <CheckCircle size={10} /> },
                                            ]),
                                        ];

                                        // showDetails state: null = closed, `${id}` = timeline, `${id}-improve` = improvement
                                        const isTimelineOpen = showDetails === asset.id;
                                        const isImproveOpen = showDetails === `${asset.id}-improve`;
                                        const isAnyOpen = isTimelineOpen || isImproveOpen;

                                        return (
                                            <div key={asset.id} className={`bg-white rounded-[2.5rem] border ${isDeclined ? 'border-red-100 bg-red-50/5' : 'border-stone-100'} overflow-hidden shadow-sm group hover:shadow-xl transition-all flex flex-col`}>
                                                <div className="aspect-video bg-stone-50 relative overflow-hidden flex items-center justify-center">
                                                    {src && !src.includes('unsplash.com/photo-1529626455594-4ff0802cfb7e') ? (
                                                        <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                                            <User className="w-12 h-12 text-stone-300" />
                                                        </div>
                                                    )}
                                                    {isDeclined ? (
                                                        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 uppercase transition-transform group-hover:scale-110">
                                                            <AlertTriangle className="w-3 h-3" /> 辞退
                                                        </div>
                                                    ) : (
                                                        <div className="absolute top-4 right-4 z-10 bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 uppercase transition-transform group-hover:scale-110">
                                                            <RefreshCw className="w-3 h-3 animate-spin-slow" /> 交渉中
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-8 space-y-4 text-left flex-1 flex flex-col">
                                                    <div>
                                                        <h3 className="font-black text-xl tracking-tight">{creatorName}</h3>
                                                        <p className="text-[10px] font-black text-stone-400 font-mono tracking-widest uppercase">{dateStr}</p>
                                                    </div>

                                                    {/* Inline AI Insight */}
                                                    {asset.creator && assetInsights[asset.creator_id || (asset.creator as any).id] && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="bg-stone-900 text-white p-5 rounded-2xl relative overflow-hidden shadow-2xl"
                                                        >
                                                            <Sparkles className="absolute -top-1 -right-1 text-yellow-400 opacity-20" size={40} />
                                                            <p className="text-[11px] font-bold leading-relaxed italic relative z-10 text-indigo-100">
                                                                {assetInsights[asset.creator_id || (asset.creator as any).id]?.creatorAiHint}
                                                            </p>
                                                        </motion.div>
                                                    )}

                                                    {/* Detailed Status (Timeline) */}
                                                    {isTimelineOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="space-y-4 py-4 border-t border-stone-50 mt-2"
                                                        >
                                                            <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em] mb-4">Negotiation Timeline</p>
                                                            <div className="space-y-4 relative">
                                                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-stone-100" />
                                                                {timeline.map((step, idx) => (
                                                                    <div key={idx} className="flex gap-4 items-start relative z-10">
                                                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-2 ${step.active ? (step.isError ? 'bg-red-500 border-red-500 shadow-lg shadow-red-100' : 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100') : 'bg-white border-stone-100'}`}>
                                                                            {step.active && <div className="text-white">{step.icon}</div>}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className={`text-[11px] font-black ${step.active ? (step.isError ? 'text-red-500' : 'text-stone-900') : 'text-stone-300'}`}>{step.label}</p>
                                                                            {step.active && step.date && (
                                                                                <p className="text-[9px] font-bold font-mono text-stone-400">
                                                                                    {new Date(step.date).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                                                </p>
                                                                            )}
                                                                            {step.description && (
                                                                                <p className="text-[10px] font-bold text-red-500 mt-1 leading-relaxed bg-red-50 p-2 rounded-lg border border-red-100">
                                                                                    {step.description}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {/* Offer Improvement Suggestions (for declined assets) */}
                                                    {isImproveOpen && isDeclined && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="space-y-4 py-4 border-t border-stone-50 mt-2"
                                                        >
                                                            <div className="bg-stone-900 text-white p-5 rounded-2xl relative overflow-hidden shadow-2xl">
                                                                <Sparkles className="absolute -top-1 -right-1 text-yellow-400 opacity-20" size={40} />
                                                                <h4 className="text-xs font-black mb-3 flex items-center gap-2"><Sparkles className="w-3 h-3 text-yellow-400" /> オファー改善案</h4>
                                                                <ul className="text-[11px] font-bold leading-relaxed space-y-2 relative z-10 text-indigo-100 list-disc pl-4">
                                                                    <li>報酬として提供するメニューをより豪華なものにするか、同伴者も無料にすることで応募率が上がります。</li>
                                                                    <li>撮影可能な時間帯を「営業時間外のみ」から「ピーク時以外」などに緩めると、日程調整がつけやすくなります。</li>
                                                                    <li>クリエイターの過去の「和モダンな世界観」を評価している点を直接メッセージで伝えると、モチベーションアップに繋がります。</li>
                                                                </ul>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    <div className="flex gap-2 mt-auto">
                                                        <button
                                                            onClick={() => setShowDetails(isTimelineOpen ? null : asset.id)}
                                                            className={`flex-1 text-[11px] font-black border-2 rounded-xl py-3.5 transition-all uppercase tracking-widest ${isTimelineOpen ? 'bg-stone-900 border-stone-900 text-white' : 'border-stone-100 hover:border-stone-200'}`}
                                                        >
                                                            {isTimelineOpen ? 'Close' : 'Timeline'}
                                                        </button>
                                                        {isDeclined && (
                                                            <button
                                                                onClick={() => setShowDetails(isImproveOpen ? null : `${asset.id}-improve`)}
                                                                className={`flex-1 text-[11px] font-black rounded-xl py-3.5 transition-all shadow-xl active:scale-95 uppercase tracking-widest ${isImproveOpen ? 'border-2 border-stone-100 hover:border-stone-200 text-slate-800 bg-white' : 'bg-stone-900 text-white hover:bg-black flex items-center justify-center gap-1'}`}
                                                            >
                                                                {isImproveOpen ? 'Close' : <><Sparkles className="w-3 h-3 text-yellow-400" /> 改善案</>}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(localAssets.length > 0 ? localAssets : initialAssets).filter(a => ['OFFERED', 'APPROVED', 'WORKING', 'DELIVERED'].includes(a.status || '')).length === 0 && (
                                        <>
                                            <div className="bg-stone-50 rounded-[32px] border-2 border-dashed border-stone-200 aspect-video flex flex-col items-center justify-center p-8 text-center space-y-3 opacity-60">
                                                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-300"><Clock className="w-6 h-6" /></div>
                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">現在交渉中のクリエイターはいません</p>
                                            </div>
                                            <div className="hidden md:block bg-stone-50 rounded-[32px] border-2 border-dashed border-stone-100 aspect-video opacity-30" />
                                            <div className="hidden md:block bg-stone-50 rounded-[32px] border-2 border-dashed border-stone-100 aspect-video opacity-10" />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Acquired Videos Section */}
                            <div className="space-y-8">
                                <h3 className="text-xl font-black tracking-tight text-center md:text-left uppercase">獲得した動画一覧</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {/* Real / Interactive completed videos */}
                                    {(localAssets.length > 0 ? localAssets : initialAssets)
                                        .filter(a => a.status === 'DELIVERED' || a.status === 'COMPLETED' || a.status === 'FINALIZED')
                                        .map((asset) => (
                                            <div key={asset.id} className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm group hover:scale-[1.02] transition-all flex flex-col">
                                                <div className="aspect-[9/16] bg-stone-200 relative">
                                                    {asset.video_url ? (
                                                        <video src={asset.video_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                                    ) : (
                                                        <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                                            <User className="w-10 h-10 text-stone-300" />
                                                        </div>
                                                    )}
                                                    {(asset.status === 'DELIVERED' || asset.status === 'COMPLETED') ? (
                                                        <div className="absolute top-3 left-3 bg-blue-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase flex items-center gap-1 z-10">
                                                            <Clock className="w-2.5 h-2.5" /> 承認待ち
                                                        </div>
                                                    ) : (
                                                        <div className="absolute top-3 left-3 bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg uppercase flex items-center gap-1 z-10">
                                                            <CheckCircle className="w-2.5 h-2.5" /> 承認済み
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 text-left flex-1 flex flex-col justify-between">
                                                    <div className="mb-2">
                                                        <p className="text-[10px] font-black text-stone-400 uppercase mb-1">{asset.created_at ? new Date(asset.created_at).toISOString().split('T')[0] : '2024.03.15'}</p>
                                                        <h4 className="text-xs font-black truncate leading-tight">@{asset.creator?.name || 'Creator'}</h4>
                                                    </div>
                                                    {(asset.status === 'DELIVERED' || asset.status === 'COMPLETED') && (
                                                        <div className="space-y-3">
                                                            <div className="relative pt-4 pb-2 border-t border-stone-100">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Clock className="w-3 h-3 text-blue-500" />
                                                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Auto-Approve</span>
                                                                    </div>
                                                                    {(() => {
                                                                        const deliveredAt = (asset as any).offer_details?.timeline?.delivered_at || asset.updated_at;
                                                                        const hoursElapsed = deliveredAt ? Math.max(0, (new Date().getTime() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60)) : 0;
                                                                        const hoursRemaining = Math.max(0, 120 - hoursElapsed);
                                                                        return <span className="text-[10px] font-bold text-stone-400">{Math.floor(hoursRemaining)}h (approx) remaining</span>
                                                                    })()}
                                                                </div>
                                                                <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                                                                    {(() => {
                                                                        const deliveredAt = (asset as any).offer_details?.timeline?.delivered_at || asset.updated_at;
                                                                        const hoursElapsed = deliveredAt ? Math.max(0, (new Date().getTime() - new Date(deliveredAt).getTime()) / (1000 * 60 * 60)) : 0;
                                                                        const progress = Math.min(100, (hoursElapsed / 120) * 100);
                                                                        return (
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${progress}%` }}
                                                                                className="h-full bg-blue-500"
                                                                            />
                                                                        );
                                                                    })()}
                                                                </div>
                                                                <p className="text-[8px] text-zinc-400 mt-2 leading-tight">
                                                                    提出から120時間（5日）以内にアクションがない場合、自動で承認されます。
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={async () => {
                                                                    const { finalizeAsset } = await import('@/app/actions/creator');
                                                                    await finalizeAsset(asset.id);
                                                                    setCelebrationAssetId(asset.id);
                                                                    setTimeout(() => setCelebrationAssetId(null), 5000);
                                                                }}
                                                                className="w-full py-2.5 bg-black hover:bg-stone-900 text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all uppercase active:scale-95 shadow-lg group relative overflow-hidden"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5 text-teal-400 group-hover:scale-125 transition-transform" /> 納品を承認する
                                                            </button>
                                                            <AnimatePresence>
                                                                {celebrationAssetId === asset.id && (
                                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center mb-3">
                                                                            <Sparkles className="w-6 h-6 text-white" />
                                                                        </motion.div>
                                                                        <p className="text-white font-black text-xs uppercase italic tracking-tighter">Approved! 🎉</p>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    )}
                                                    {(asset.status === 'APPROVED' || asset.status === 'FINALIZED') && (
                                                        <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                                                            <div className="flex items-center justify-between text-[9px] font-bold text-stone-400 uppercase tracking-widest px-1">
                                                                <span>Asset Status</span>
                                                                <span className="text-teal-600">Active Asset ✅</span>
                                                            </div>
                                                            <button className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-black rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all uppercase">
                                                                <Map className="w-3.5 h-3.5" /> Deploy to Maps
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                    {/* Empty states for completed videos */}
                                    {(localAssets.length > 0 ? localAssets : initialAssets).filter(a => a.status === 'DELIVERED' || a.status === 'COMPLETED' || a.status === 'FINALIZED').length === 0 && (
                                        <>
                                            <div className="bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 aspect-[9/16] flex flex-col items-center justify-center p-6 text-center space-y-3 opacity-60">
                                                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-300"><Play className="w-5 h-5" /></div>
                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">獲得した動画はありません</p>
                                            </div>
                                            {[1, 2, 3].map(i => (
                                                <div key={`empty-v-${i}`} className="hidden md:block bg-stone-50 rounded-3xl border-2 border-dashed border-stone-100 opacity-20" />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* AssetDeploymentSection archived/hidden */}
                            {/* 
                            <div className="pt-12">
                                <div className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-xl ring-1 ring-stone-200/50">
                                    <AssetDeploymentSection
                                        freshness={freshness}
                                        setFreshness={setFreshness}
                                        synced={synced}
                                        setSynced={setSynced}
                                        clientTag={clientTag || 'demo-shop'}
                                        latestAssetUrl={initialAssets[0]?.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-people-eating-at-a-restaurant-4433-large.mp4'}
                                        freeOffers={freeOffers}
                                        isPremium={isPremium}
                                        isFetchingInfo={isFetchingInfo}
                                    />
                                </div>
                            </div>
                            */}
                        </main>
                    </motion.div>
                )}

                {activeTab === "analytics" && (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="h-[calc(100vh-140px)] w-full max-w-7xl mx-auto px-4 pt-8"
                    >
                        <div className="w-full h-full rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-stone-100">
                            <iframe
                                src="https://lookerstudio.google.com/embed/reporting/ffc3fd41-4484-4011-8d7e-00301f57dafc/page/p_xtem88ba1d"
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {
                isSent ? (
                    <AnimatePresence>
                        {isModalOpen && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm flex items-center justify-center p-4"
                            >
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-16 text-center flex flex-col items-center justify-center min-h-[400px] max-w-lg w-full shadow-2xl">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 animate-bounce"><Check size={48} strokeWidth={4} /></div>
                                    <h3 className="text-3xl font-black tracking-tighter mb-3 uppercase">Offer Sent!</h3>
                                    <p className="text-stone-500 font-medium">オファーが完了しました！<br />承認されると通知が届きます。</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    <OfferModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        creator={selectedCreator}
                        onSend={handleOfferSent}
                    />
                )
            }

            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} companyId={shop?.id} companyEmail={shop?.email} onUnlock={() => setIsPremium(true)} />
            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                assetId={selectedChatAsset?.id || ''}
                partnerName={selectedChatAsset?.creator?.name || 'Creator'}
                currentUserType="shop"
            />

            <PortfolioVideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoUrls={selectedVideo?.urls || []}
                creatorName={selectedVideo?.name || ''}
            />

            <ShopSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSuccess={fetchShopInfo}
            />

            <FloatingActionBar
                items={[
                    { name: 'Search', link: 'search', icon: <Search className="w-4 h-4" />, onClick: () => setActiveTab("search") },
                    { name: 'Creators', link: 'creators', icon: <Users className="w-4 h-4" />, onClick: () => setActiveTab("search") }, // Assuming Creators is part of search result
                    { name: 'Asset Hub', link: 'assets', icon: <Layers className="w-4 h-4" />, onClick: () => setActiveTab("assets") },
                ]}
                hintedLink={assetHubHint ? 'assets' : undefined}
                hintMessage={assetHubHint || undefined}
            />

            <OnboardingModal
                controlledOpen={isOnboardingOpen}
                onControlledClose={() => setIsOnboardingOpen(false)}
            />
        </div>
    );
}
