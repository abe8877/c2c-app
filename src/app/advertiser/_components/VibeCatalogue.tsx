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
    SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { analyzeAssetInsight } from "@/app/actions/analyze-asset-insight";
import { analyzeShopVibe } from "@/app/actions/analyze-shop-vibe";
import { offerCreator } from '@/app/actions/offer-creator';
import { translateText } from '@/app/actions/translate';
import { createClient } from '@/utils/supabase/client';
import ShopUpsellBanner from "./ShopUpsellBanner";
import ShopSettingsModal from "./ShopSettingsModal";

export interface Asset {
    id: string;
    client_tag: string;
    creator_id: string;
    status: string;
    video_url?: string;
    created_at?: string;
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
    const embedUrl = videoUrls.length > 0 ? getTikTokEmbedUrl(videoUrls[currentIndex]) : null;
    const total = videoUrls.length;

    // Reset index when modal opens with new creator
    useEffect(() => {
        if (isOpen) setCurrentIndex(0);
    }, [isOpen, creatorName]);

    const goPrev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(i => Math.max(0, i - 1)); };
    const goNext = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(i => Math.min(total - 1, i + 1)); };

    return (
        <AnimatePresence>
            {isOpen && embedUrl && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/95 z-[300] flex flex-col items-center justify-center p-4"
                    onClick={onClose}
                >
                    <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
                        <div className="text-white text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Viewing Portfolio</p>
                            <p className="font-black tracking-tight">@{creatorName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                        {/* Prev Button */}
                        <button
                            onClick={goPrev}
                            disabled={currentIndex === 0}
                            className={`p-3 rounded-full transition-all ${currentIndex === 0 ? 'opacity-0 cursor-default' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md'}`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <motion.div
                            key={currentIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20"
                        >
                            <iframe
                                src={embedUrl}
                                className="w-full h-full border-none"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </motion.div>

                        {/* Next Button */}
                        <button
                            onClick={goNext}
                            disabled={currentIndex === total - 1}
                            className={`p-3 rounded-full transition-all ${currentIndex === total - 1 ? 'opacity-0 cursor-default' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md'}`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Dot Indicator */}
                    {total > 1 && (
                        <div className="flex gap-2 mt-6" onClick={(e) => e.stopPropagation()}>
                            {videoUrls.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'}`}
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
}: {
    creator: Creator;
    onOffer: (c: Creator) => void;
    onPlayVideo: (urls: string[]) => void;
}) => {
    const hasVideos = creator.portfolio_video_urls && creator.portfolio_video_urls.length > 0;
    const hasScore = creator.vibeMatchScore !== undefined && creator.vibeMatchScore > 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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

                <div className="flex flex-col gap-1.5">
                    {/* FOLLOWERS - Unified Glass Box UI */}
                    <div className="flex items-center gap-1.5 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/15 backdrop-blur-md rounded border border-white/10 w-fit">
                        <Users className="w-3 h-3 text-white/50" />
                        {creator.followers} followers
                    </div>

                    {/* AUDIENCE - Vertical stack, Unified Glass Box UI */}
                    <div className="flex items-center gap-1.5 text-white/90 text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white/15 backdrop-blur-md rounded border border-white/10 w-fit">
                        <Globe className="w-3 h-3 text-white/50" />
                        AUDIENCE: {creator.nationality || (creator.ethnicity === 'ASIA' ? 'Asia' : creator.ethnicity === 'AMERICA' ? 'North America' : creator.ethnicity === 'EUROPE' ? 'Europe' : creator.ethnicity || 'Global')}
                    </div>
                </div>
            </div>

            {/* Hover Overlay: Buttons */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                <button
                    onClick={(e) => { e.stopPropagation(); onOffer(creator); }}
                    className="bg-white text-black font-black px-4 py-2.5 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 hover:scale-105 active:scale-95 text-[10px] flex items-center gap-1.5 uppercase tracking-wide"
                >
                    ✨ Offer This Creator
                </button>

                {hasVideos && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPlayVideo(creator.portfolio_video_urls!); }}
                        className="bg-white/20 backdrop-blur-md text-white font-bold px-5 py-2.5 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 transform translate-y-4 group-hover:translate-y-0 hover:bg-white/30 active:scale-95 text-[10px] flex items-center gap-2 uppercase tracking-tight"
                    >
                        <Play className="w-3 h-3 fill-current" /> 動画をチェックする {creator.portfolio_video_urls!.length > 1 ? `(${creator.portfolio_video_urls!.length})` : ''}
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
            <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">貴店の魅力を言語化中...</h2>
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
                <p className="text-stone-500 font-medium text-sm">解析の結果、貴店の魅力は以下のように定義されました。</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-stone-100 mb-8 ring-1 ring-stone-200/50">
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-8 text-center">Detected Vibe Tags</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                    {tags.map((tag: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => onRemoveTag(tag)}
                            className="group relative px-6 py-4 bg-neutral-50 text-stone-800 rounded-2xl font-black text-lg animate-in zoom-in duration-300 flex items-center gap-2 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-stone-200 overflow-hidden"
                        >
                            <span className="group-hover:translate-x-[-12px] transition-transform duration-300">{tag}</span>
                            <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 w-6 h-6 flex items-center justify-center bg-red-100 rounded-full">
                                <X size={12} strokeWidth={4} className="text-red-600" />
                            </div>
                        </button>
                    ))}
                    {tags.length === 0 && <p className="text-stone-300 italic">タグがありません</p>}
                </div>
                <div className="mt-12 pt-10 border-t border-stone-100 text-center space-y-8">
                    <p className="text-sm font-bold text-stone-400">貴店と高相性のクリエイター：<span className="text-4xl text-black font-black ml-3 underline underline-offset-8 decoration-yellow-400 decoration-4">{count}名（{selectedGenre || initialGenre || '全ジャンル'}）</span></p>
                    <button onClick={onConfirm} className="px-14 py-5 bg-black text-white rounded-full font-black text-lg hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 group">
                        マッチング候補を見る <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
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
    const [selectedTags, setSelectedTags] = useState<string[]>(['看板メニュー', '店内の雰囲気']);
    const [barterDetails, setBarterDetails] = useState('');
    const [invitationMessage, setInvitationMessage] = useState('');
    const [isManualMessage, setIsManualMessage] = useState(false);
    const [isTranslating, setIsTranslating] = useState<string | null>(null);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleTranslate = async (text: string, field: 'barter' | 'message') => {
        if (!text) return;
        setIsTranslating(field);
        try {
            const result = await translateText(text);
            if (result.success && result.translatedText) {
                if (field === 'barter') setBarterDetails(result.translatedText);
                else setInvitationMessage(result.translatedText);
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
            setInvitationMessage(`Hi ${creatorName}! We love your style.\nOur shop has a perfect match with your vibe.\nWe'd like to invite you for our Experience${plan === 'paid' ? ` with \u00a5${amount.toLocaleString()} reward` : ''}.`);
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
                                    <Gift className="w-4 h-4" /> 提供プラン
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPlan('barter')}
                                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${plan === 'barter' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-lg flex items-center gap-2">🎁 ギフティング</div>
                                            {plan === 'barter' && <CheckCircle className="w-5 h-5 text-black" />}
                                        </div>
                                        <div className="text-xs text-gray-500">金銭報酬なし（商品提供のみ）</div>
                                    </div>
                                    <div
                                        onClick={() => setPlan('paid')}
                                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${plan === 'paid' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-lg flex items-center gap-2">💰 報酬付きオファー</div>
                                            {plan === 'paid' && <CheckCircle className="w-5 h-5 text-black" />}
                                        </div>
                                        <div className="text-xs text-gray-500">商品提供 + 謝礼金</div>
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
                                                    <label className="text-sm font-bold text-gray-700">謝礼金額 (円)</label>
                                                    <input
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(Number(e.target.value))}
                                                        className="w-32 text-right font-bold bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    {[10000, 15000, 30000].map((val) => (
                                                        <button
                                                            key={val}
                                                            onClick={() => setAmount(val)}
                                                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${amount === val ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                                                        >
                                                            ¥{val.toLocaleString()}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {isHighDemand && (
                                    <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-4">
                                        <div>
                                            <p className="font-black text-amber-900 text-sm mb-1">👑 人気クリエイターへのオファー</p>
                                            <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                                                こちらのクリエイターは人気が高いため、<span className="font-black">報酬付きオファー</span>を推奨します。無報酬の場合、オファー承諾率が著しく低下する可能性があります。
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <Camera className="w-4 h-4" /> 撮影で盛り込んでほしい要素
                                </label>

                                <div className="flex flex-wrap gap-2">
                                    {['看板メニュー', '店内の雰囲気', 'スタッフの接客', '外観・看板', '調理シーン', 'テラス席'].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-all duration-200 ${selectedTags.includes(tag) ? 'bg-black text-white border-black shadow-md scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 🎁 Barter（必須提供価値）入力エリア */}
                            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100 group">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-900 mb-1">
                                    🎁 クリエイターへの提供内容（英語）<span className="text-red-500 text-xs">*</span>
                                </label>
                                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                    店頭で提供するサービスや体験の内容を具体的に記載してください。
                                    <span className="font-bold text-amber-600">人気メニューや独自の体験を提案するとクリエイターの承諾率が高まります。</span>
                                </p>
                                <div className="relative">
                                    <textarea
                                        value={barterDetails}
                                        onChange={(e) => setBarterDetails(e.target.value)}
                                        placeholder="例：ヘッドスパ60分無料、看板メニュー「〇〇セット」の提供"
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none h-20 text-sm placeholder:text-slate-400 shadow-inner"
                                    />
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleTranslate(barterDetails, 'barter')}
                                            disabled={isTranslating === 'barter'}
                                            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm
                                                ${isTranslating === 'barter' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                                        >
                                            {isTranslating === 'barter' ? '翻訳中...' : '日本語で入力してAI翻訳'}
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
                                        <Sparkles className="w-3 h-3" /> NOTS推奨
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
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleTranslate(invitationMessage, 'message')}
                                            disabled={isTranslating === 'message'}
                                            className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm
                                                ${isTranslating === 'message' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                                        >
                                            {isTranslating === 'message' ? '翻訳中...' : '日本語で入力してAI翻訳'}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> このまま送信可能ですが、依頼したい理由等を追記するとオファーが受諾されやすいです。
                                </p>
                            </div>
                        </div>

                        <div className="p-6 pt-0 shrink-0 bg-white">
                            <button
                                onClick={() => {
                                    if (!barterDetails.trim()) {
                                        alert('「クリエイターへの提供価値」を入力してください。\n魅力的な提供内容がオファー承諾率を高めます！');
                                        return;
                                    }
                                    onSend({ plan, amount, selectedTags, barterDetails });
                                }}
                                className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl shadow-xl hover:bg-gray-800 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                {plan === 'paid' ? `\u00a5${amount.toLocaleString()} でオファーを送る` : '招待状を送る'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PaywallModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [invitationCode, setInvitationCode] = useState("");
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
                        <h2 className="text-2xl font-black mb-4 tracking-tight">Premium Plan Required</h2>
                        <p className="text-sm text-stone-600 font-bold leading-relaxed mb-8">
                            このクリエイターへのオファーを含め、月額3.98万円でSランククリエイターに依頼し放題のプレミアムプランを有効化しましょう。
                        </p>

                        <div className="w-full space-y-3 mb-6">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert("Stripe決済ページへ遷移します。"); onClose(); }}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-sm py-4 rounded-xl shadow-xl hover:bg-stone-800 hover:scale-[1.02] transition-all active:scale-95"
                            >
                                <DollarSign className="w-4 h-4" /> クレジットカードで決済
                            </a>
                            <button
                                onClick={() => {
                                    alert("請求書払いを申し込みました。運営より手動にてご案内いたします。");
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-white text-black border-2 border-stone-200 font-black text-sm py-4 rounded-xl hover:border-black hover:bg-stone-50 transition-all active:scale-95"
                            >
                                <Layers className="w-4 h-4" /> 請求書払いを申し込む
                            </button>

                            <div className="pt-4 border-t border-stone-100 mt-4 w-full">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="招待コードをお持ちの方はこちら"
                                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-[10px] font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                                        value={invitationCode}
                                        onChange={(e) => setInvitationCode(e.target.value)}
                                    />
                                    {invitationCode && (
                                        <button
                                            onClick={() => { alert("コードを適用しました。"); setInvitationCode(""); }}
                                            className="absolute right-2 top-1.2 bg-black text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest"
                                        >
                                            適用
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] text-stone-400 font-bold bg-stone-50 px-4 py-2 rounded-lg inline-block border border-stone-100 ring-1 ring-inset ring-stone-900/5">
                            <Info className="w-3 h-3 inline mr-1 mb-0.5" /> 決済確認後、運営が手動でアカウントを有効化します
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
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
    const [filterRegion, setFilterRegion] = useState<string>('ALL');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedChatAsset, setSelectedChatAsset] = useState<Asset | null>(null);
    const [synced, setSynced] = useState(false);
    const [freshness, setFreshness] = useState(85);
    const [assetInsights, setAssetInsights] = useState<Record<string, any>>({});
    const [urlError, setUrlError] = useState<string | null>(null);
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

        // 4. Tier Bonus: Supabaseの tier カラムを参照
        let tierBonus = 1; // デフォルト微小揺らぎ
        if (c.tier === 'S') tierBonus = 5;
        else if (c.tier === 'A') tierBonus = 3;
        else if (c.tier === 'B') tierBonus = 2;

        // 5. 合計スコア（上限は99%）
        const rawScore = baseScore + vibeBonus + tierBonus;
        let score = Math.min(rawScore, 99);

        // 6. HOT Boost: 急上昇クリエイターを確実に上位へ (さらに+5ポイント、上限100へ拡大)
        if (c.is_hot) {
            score = Math.min(score + 5, 100);
        }

        return { ...c, vibeMatchScore: score, matchedClusters: matched };
    }).sort((a, b) => {
        const scoreA = a.vibeMatchScore ?? 0;
        const scoreB = b.vibeMatchScore ?? 0;
        return scoreB - scoreA;
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
                    setFilterGenre(selectedGenre); // カタログ表示も同期
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
                        const publicOk = c.is_public !== false;
                        return genreMatch && tierOk && publicOk;
                    }).length;
                    setMatchCount(fallbackCount);
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
                    setTimeout(() => setIsChatOpen(true), 300);
                }, 2000);
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
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-32 pt-16">
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 z-40 px-6 flex items-center justify-between">
                <div className="font-black text-xl tracking-tighter flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab("search")}>
                    INSIDERS.
                </div>

                {/* --- Popup Backdrops: Click outside to close --- */}
                {(isNotificationOpen || isChatListOpen || isProfileOpen) && (
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => {
                            setIsNotificationOpen(false);
                            setIsChatListOpen(false);
                            setIsProfileOpen(false);
                        }}
                    />
                )}

                <div className="flex items-center gap-3 relative z-50">
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
                        <div className="absolute top-14 right-16 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-stone-100 font-black text-xs uppercase tracking-widest text-stone-500 bg-stone-50">Notifications</div>
                            <div className="max-h-80 overflow-y-auto">
                                {localAssets.filter(a => a.status === 'COMPLETED' || a.status === 'DECLINED').length === 0 && (
                                    <div className="p-8 text-center text-xs text-stone-400">新しい通知はありません</div>
                                )}
                                {localAssets.filter(a => a.status === 'COMPLETED').map(a => (
                                    <div key={`notif-completed-${a.id}`} className="p-4 border-b border-stone-50 hover:bg-stone-50 transition cursor-pointer" onClick={() => { setIsNotificationOpen(false); setActiveTab('assets'); }}>
                                        <div className="text-xs font-bold text-stone-900 mb-1">🎬 動画が納品されました</div>
                                        <div className="text-[10px] text-stone-500">{a.creator?.name || a.creator?.tiktok_handle}さんの動画が完成しました！「資産管理」タブで確認できます。</div>
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
                        <div className="absolute top-14 right-8 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-stone-100 font-black text-xs uppercase tracking-widest text-stone-500 bg-stone-50">Messages</div>
                            <div className="max-h-80 overflow-y-auto">
                                {localAssets
                                    .filter(a => a.creator && (a.status === 'OFFERED' || a.status === 'COMPLETED' || a.status === 'approved' || a.status === 'ACTIVE' || a.status === 'PENDING_APPROVAL'))
                                    .map(a => (
                                        <button
                                            key={a.id}
                                            onClick={() => {
                                                const fullCreator = initialCreators.find(c => c.id === a.creator_id) || {
                                                    id: a.creator_id || 'mock',
                                                    name: a.creator?.name || '',
                                                    tiktok_handle: a.creator?.tiktok_handle,
                                                    avatar_url: a.creator?.avatar_url,
                                                    thumbnail_url: a.creator?.avatar_url,
                                                    genre: ['LIFESTYLE'],
                                                    ethnicity: 'ASIAN',
                                                    vibe_tags: [],
                                                    followers: '1K',
                                                    is_public: true,
                                                    is_verified: false
                                                } as Creator;
                                                setSelectedCreator(fullCreator);
                                                setIsChatOpen(true);
                                                setIsChatListOpen(false);
                                            }}
                                            className="w-full p-4 flex items-center gap-3 hover:bg-stone-50 border-b border-stone-50 transition text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden shrink-0 border border-stone-200">
                                                <img src={a.creator?.avatar_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80'} className="w-full h-full object-cover" />
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
                                        {shop?.is_premium ? "ベーシックプラン" : "トライアルプラン"}
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
                        <main className="max-w-4xl mx-auto px-4 pt-8">
                            {step === 'input' && (
                                <div className="space-y-12 py-12 text-center">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center mb-6">
                                            <div className="flex -space-x-4">
                                                {topCreators?.map((creator, i) => (
                                                    <div key={i} className="relative w-12 h-16 rounded-lg border-2 border-white shadow-md overflow-hidden transform transition-transform hover:-translate-y-2 hover:z-20 cursor-pointer bg-slate-100">
                                                        {/* 動画のサムネイルを縦長（TikTok風）にクロップして表示 */}
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={creator.thumbnail_url}
                                                            alt={creator.name}
                                                        />
                                                        <div className="absolute inset-0 bg-slate-900/10" />
                                                    </div>
                                                ))}
                                                {/* +1000のトラストバッジ */}
                                                <div className="w-12 h-16 rounded-lg border-2 border-white bg-slate-900 text-white text-[11px] font-black flex flex-col items-center justify-center z-10 shadow-md">
                                                    <span className="text-teal-400 leading-none mb-0.5">1000+</span>
                                                    <span className="text-[8px] opacity-80 leading-none">Creators</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* トラストバッジ（コピー変更） */}
                                        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 border border-teal-100 rounded-full px-4 py-1.5 mb-8 shadow-sm">
                                            <Sparkles className="w-4 h-4 text-teal-500" />
                                            <span className="text-[13px] font-bold tracking-wide">
                                                1000組以上の精査済みクリエイター群から最適なクリエイターをご提案
                                            </span>
                                        </div>
                                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                                            インバウンド集客特化クリエイターを探す
                                        </h1>
                                        <p className="text-stone-500 font-medium max-w-xl mx-auto">
                                            “世界から見た日本”を深く理解した勝率の高い1,000組超のクリエイターネットワーク「INSIDERS.」 貴店を紹介するのに最適なネイティブクリエイターが、言語の壁を超えてSNSで認知を獲得する“デジタル看板”の役割を果たします。
                                        </p>
                                    </div>

                                    <div className="max-w-3xl mx-auto space-y-4 text-left">
                                        <div className="bg-white p-2.5 rounded-[32px] shadow-2xl border border-stone-100 flex flex-col ring-1 ring-stone-200 overflow-hidden">
                                            <div className="flex flex-col sm:flex-row items-center gap-1">
                                                {/* Genre Select */}
                                                <div className="relative border-b sm:border-b-0 sm:border-r border-stone-100 pr-2 flex items-center shrink-0 w-full sm:w-auto">
                                                    <select
                                                        value={selectedGenre}
                                                        onChange={(e) => setSelectedGenre(e.target.value)}
                                                        className="appearance-none bg-transparent font-black text-xs pl-6 pr-10 py-4 outline-none cursor-pointer tracking-widest uppercase text-stone-900 w-full"
                                                    >
                                                        <option value="FOOD">🍣 Food</option>
                                                        <option value="BEAUTY">💅 Beauty</option>
                                                        <option value="TRAVEL">⛩️ Travel</option>
                                                        <option value="EXPERIENCE">🧖‍♀️ Experience</option>
                                                        <option value="LIFESTYLE">✨ Lifestyle</option>
                                                    </select>
                                                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-4 pointer-events-none" />
                                                </div>

                                                {/* URL Input */}
                                                <div className="flex items-center flex-1 w-full pl-4 gap-3 min-w-0">
                                                    <Search className="w-5 h-5 text-stone-300 shrink-0" />
                                                    <input
                                                        type="text"
                                                        value={url}
                                                        onChange={(e) => setUrl(e.target.value)}
                                                        placeholder="Googleマップ または InstagramのURL"
                                                        className="flex-1 py-4 outline-none text-sm font-bold placeholder:text-stone-300 w-full min-w-0 bg-transparent text-stone-900"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                                    />
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    onClick={handleUrlSubmit}
                                                    className="w-full sm:w-auto bg-stone-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shrink-0"
                                                >
                                                    分析を開始 <Sparkles size={14} className="text-yellow-400" />
                                                </button>
                                            </div>

                                            {/* Inline Error within the bar */}
                                            <AnimatePresence>
                                                {urlError && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="px-6 py-3 bg-red-50 border-t border-red-100 flex items-center gap-2"
                                                    >
                                                        <AlertCircle size={14} className="text-red-500" />
                                                        <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">
                                                            {urlError}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Helper Text below the bar */}
                                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 mt-4 px-4 text-center">
                                            <Info size={12} className="text-stone-300" />
                                            短尺URL（Googleマップの共有から取得できるURL等）は避け、フルURLを入力してください
                                        </p>
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
                                    <div className="flex justify-between items-end border-b border-stone-100 pb-6">
                                        <div className="space-y-1 text-left">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-3xl font-black tracking-tighter">Creator Catalog</h2>
                                                {initialGenre && (
                                                    <span className="bg-black text-white text-[10px] px-3 py-0.5 rounded-full align-middle font-bold flex items-center gap-1.5 shadow-lg border border-white/20 animate-in fade-in slide-in-from-left-4 duration-1000">
                                                        <Sparkles className="w-3 h-3 text-yellow-400" /> Optimized for {initialGenre}
                                                    </span>
                                                )}
                                                {freeOffers > 0 && (
                                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-3 py-0.5 rounded-full align-middle font-black flex items-center gap-1.5 shadow-sm border border-yellow-200">
                                                        <Sparkles className="w-3 h-3 text-yellow-500" /> 残り {freeOffers}/3 回オファー無料
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-stone-400 text-sm font-medium">貴店と高相性のクリエイター <span className="font-bold text-gray-900">{filteredCreators.length}名（{initialGenre || '全カテゴリ'}）</span></p>
                                        </div>
                                        <button
                                            onClick={() => { setStep('input'); setUrl(''); setShopVibe([]); setFilterGenre('ALL'); setFilterRegion('ALL'); }}
                                            className="text-stone-400 hover:text-black transition flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
                                        >
                                            <RefreshCw size={14} /> リセット
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex gap-2 flex-wrap">
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
                                                    className={`relative px-5 py-2.5 rounded-full text-sm font-black transition-all duration-300 ${filterGenre === tab.key
                                                        ? 'bg-black text-white shadow-[0_15px_30px_rgba(0,0,0,0.3)] scale-110 ring-2 ring-black ring-offset-2 z-10'
                                                        : tab.key === initialGenre
                                                            ? 'bg-yellow-400 text-black border-2 border-yellow-500 shadow-[0_10px_20px_rgba(250,204,21,0.3)] animate-pulse'
                                                            : 'bg-white text-stone-400 border border-stone-200 hover:border-stone-400 hover:text-stone-600'
                                                        }`}
                                                >
                                                    {tab.label}
                                                    {tab.key === initialGenre && (
                                                        <span className="absolute -top-2 -right-1 bg-yellow-400 text-black text-[8px] px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 animate-bounce">
                                                            <Sparkles className="w-2 h-2" /> MATCHED
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {/* ShopUpsellBanner moved to 資産鮮度 */}
                                        </AnimatePresence>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                                        {filteredCreators.filter(c => !invitedCreatorIds.has(c.id)).map((creator) => (
                                            <CreatorCard
                                                key={creator.id}
                                                creator={creator}
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
                            <header className="flex justify-between items-end border-b border-stone-100 pb-8">
                                <div className="space-y-1 text-left">
                                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">Asset Hub</h2>
                                    <p className="text-stone-400 text-sm font-medium uppercase tracking-widest text-left">動画を集客資産として一元管理</p>
                                </div>
                            </header>

                            {/* Dynamic KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col items-center justify-center space-y-2 group hover:scale-[1.02] transition-transform"
                                >
                                    <div className="text-5xl font-black text-stone-900 group-hover:text-blue-600 transition-colors">
                                        <AnimatedCounter value={offeredCount} />
                                    </div>
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-[0.2em]">交渉中</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col items-center justify-center space-y-2 group hover:scale-[1.02] transition-transform"
                                >
                                    <div className="text-5xl font-black text-stone-900 group-hover:text-green-600 transition-colors">
                                        <AnimatedCounter value={completedCount} />
                                    </div>
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-[0.2em]">獲得動画</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col items-center justify-center space-y-2 group hover:scale-[1.02] transition-transform relative"
                                >
                                    <div className="text-5xl font-black text-green-500 flex items-center gap-1">
                                        <AnimatedCounter value={stats.freshness} />
                                        <span className="text-2xl">%</span>
                                    </div>
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-[0.2em]">資産鮮度</p>

                                    {/* Action Proposal Tooltip on Hover */}
                                    <div className="absolute top-full w-80 pt-4 z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all pointer-events-none">
                                        <div className="pointer-events-auto shadow-2xl rounded-2xl overflow-hidden border border-stone-100">
                                            {upsellInsight?.upsellPlan ? (
                                                <ShopUpsellBanner
                                                    upsellPlan={upsellInsight.upsellPlan}
                                                    upsellMessage={upsellInsight.upsellMessage}
                                                />
                                            ) : (
                                                <div className="bg-white p-4">
                                                    <p className="text-xs text-stone-500">現在ご提案できるアクションはありません</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Move Add Video button here */}
                                    <button className="mt-4 w-full bg-stone-50 hover:bg-stone-100 text-stone-400 border-2 border-dashed border-stone-200 py-3 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 transition-all uppercase tracking-widest">
                                        <Plus className="w-3 h-3" /> 動画を追加
                                    </button>
                                </motion.div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-xl font-black tracking-tight text-left uppercase">オファーと交渉状況</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {(localAssets.length > 0 ? localAssets : initialAssets).filter(a => a.status === 'OFFERED' || a.status === 'DECLINED').map((asset) => {
                                        const creatorName = asset.creator?.name || asset.creator?.tiktok_handle || 'Unknown Creator';
                                        const dateStr = asset.created_at ? new Date(asset.created_at).toISOString().split('T')[0] : '2024-03-01';
                                        const src = asset.creator?.avatar_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3000&auto=format&fit=crop';
                                        const isDeclined = asset.status === 'DECLINED';

                                        return (
                                            <div key={asset.id} className={`bg-white rounded-[32px] border ${isDeclined ? 'border-red-100 bg-red-50/5' : 'border-stone-100'} overflow-hidden shadow-sm group hover:shadow-xl transition-all ring-1 ring-stone-50 flex flex-col`}>
                                                <div className="aspect-video bg-stone-100 relative overflow-hidden">
                                                    <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                    {isDeclined ? (
                                                        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 uppercase transition-transform group-hover:scale-110">
                                                            <AlertTriangle className="w-3 h-3" /> 辞退
                                                        </div>
                                                    ) : (
                                                        <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 uppercase transition-transform group-hover:scale-110">
                                                            <RefreshCw className="w-3 h-3 animate-spin-slow" /> 交渉中
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-6 space-y-4 text-left flex-1 flex flex-col">
                                                    <div>
                                                        <h3 className="font-black text-lg tracking-tight">{creatorName}</h3>
                                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{dateStr}</p>
                                                    </div>

                                                    {/* Inline AI Insight */}
                                                    {asset.creator && assetInsights[asset.creator_id || (asset.creator as any).id] && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="bg-stone-900 text-white p-4 rounded-2xl relative overflow-hidden"
                                                        >
                                                            <Sparkles className="absolute -top-1 -right-1 text-yellow-400 opacity-20" size={40} />
                                                            <p className="text-[11px] font-medium leading-relaxed italic relative z-10">
                                                                {assetInsights[asset.creator_id || (asset.creator as any).id]?.creatorAiHint}
                                                            </p>
                                                        </motion.div>
                                                    )}

                                                    {/* Detailed Status (Timeline) */}
                                                    {showDetails === asset.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="space-y-3 py-2 border-t border-stone-100 mt-2"
                                                        >
                                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">交渉タイムライン</p>
                                                            <div className="space-y-3">
                                                                <div className="flex gap-3 items-start">
                                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                                                                    <div>
                                                                        <p className="text-[11px] font-bold">オファー送信済み</p>
                                                                        <p className="text-[9px] text-stone-400">2024.03.10 14:20</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-3 items-start">
                                                                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full mt-1.5 shrink-0" />
                                                                    <div>
                                                                        <p className="text-[11px] font-bold">クリエイターが確認中</p>
                                                                        <p className="text-[9px] text-stone-400">2024.03.11 09:15</p>
                                                                    </div>
                                                                </div>
                                                                {isDeclined && (
                                                                    <div className="flex gap-3 items-start">
                                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                                                                        <div>
                                                                            <p className="text-[11px] font-bold text-red-500">案件見送り (辞退)</p>
                                                                            <p className="text-[9px] text-stone-400">2024.03.12 18:40</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    <div className="flex gap-2 mt-auto">
                                                        <button
                                                            onClick={() => setShowDetails(showDetails === asset.id ? null : asset.id)}
                                                            className={`flex-1 text-[11px] font-black border-2 rounded-xl py-3 transition-all uppercase ${showDetails === asset.id ? 'bg-stone-100 border-stone-100' : 'border-stone-100 hover:bg-stone-50'}`}
                                                        >
                                                            {showDetails === asset.id ? '閉じる' : '詳細'}
                                                        </button>
                                                        {isDeclined ? (
                                                            <button
                                                                onClick={() => asset.creator && handleAnalyzeInsight(asset.creator as any)}
                                                                className="flex-1 text-[11px] font-black bg-stone-900 text-white rounded-xl py-3 hover:bg-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 uppercase"
                                                            >
                                                                <Sparkles className="w-3 h-3 text-yellow-400" /> AI改善提案
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => asset.creator && handleReject(asset.creator as any)}
                                                                className="flex-1 text-[11px] font-black border-2 border-red-50 text-red-400 rounded-xl py-3 hover:bg-red-50 transition-all uppercase"
                                                            >
                                                                お断りする
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(localAssets.length > 0 ? localAssets : initialAssets).filter(a => a.status === 'OFFERED' || a.status === 'DECLINED').length === 0 && (
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
                                <h3 className="text-xl font-black tracking-tight text-left uppercase">投稿が完了した獲得動画</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {/* Real / Interactive completed videos */}
                                    {(localAssets.length > 0 ? localAssets : initialAssets)
                                        .filter(a => a.status === 'COMPLETED' || a.status === 'FINALIZED')
                                        .map((asset) => (
                                            <div key={asset.id} className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm group hover:scale-[1.02] transition-all flex flex-col">
                                                <div className="aspect-[9/16] bg-stone-200 relative">
                                                    {asset.video_url ? (
                                                        <video src={asset.video_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                                    ) : (
                                                        <img src={`https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600`} className="w-full h-full object-cover" alt="" />
                                                    )}
                                                    {asset.status === 'COMPLETED' ? (
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
                                                    {asset.status === 'COMPLETED' && (
                                                        <div className="space-y-3">
                                                            <div className="relative pt-4 pb-2 border-t border-stone-100">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Clock className="w-3 h-3 text-blue-500" />
                                                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Auto-Approve</span>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-stone-400">72h remaining</span>
                                                                </div>
                                                                <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: '33%' }}
                                                                        className="h-full bg-blue-500"
                                                                    />
                                                                </div>
                                                                <p className="text-[8px] text-zinc-400 mt-2 leading-tight">
                                                                    提出から72時間以内にアクションがない場合、自動で承認されます。
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={async () => {
                                                                    const { approveAsset } = await import('@/app/actions/creator');
                                                                    await approveAsset(asset.id);
                                                                    setLocalAssets(prev => prev.map(a => a.id === asset.id ? { ...a, status: 'APPROVED' } : a));
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
                                    {(localAssets.length > 0 ? localAssets : initialAssets).filter(a => a.status === 'COMPLETED' || a.status === 'FINALIZED').length === 0 && (
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

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-1 p-1.5 bg-[#1A1A1A]/95 backdrop-blur-2xl rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                    {/* Left: Search (URL Input) */}
                    <button
                        onClick={() => { setActiveTab("search"); setStep("input"); }}
                        className={`group relative flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "search" && step === "input" ? "bg-white text-black font-bold shadow-lg" : "text-stone-400 hover:text-white"}`}
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Search</span>
                        {activeTab === "search" && step === "input" && <span className="w-2 h-2 bg-yellow-400 rounded-full ml-1 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]" />}
                    </button>

                    <div className="w-px h-6 bg-white/20 mx-1" />

                    {/* Middle: Creators (Analysis Result) */}
                    <button
                        onClick={() => {
                            if (shopVibe.length > 0 || initialGenre) {
                                setActiveTab("search");
                                setStep("result");
                            } else {
                                setActiveTab("search");
                                setStep("input");
                            }
                        }}
                        className={`group relative flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "search" && step === "result" ? "bg-white text-black font-bold shadow-lg" : "text-stone-400 hover:text-white"}`}
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Creators</span>
                        {activeTab === "search" && step === "result" && <span className="w-2 h-2 bg-yellow-400 rounded-full ml-1 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]" />}
                    </button>

                    {/* Right: Asset Hub */}
                    <button
                        onClick={() => setActiveTab("assets")}
                        className={`group relative flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "assets" ? "bg-white text-black font-bold shadow-lg" : "text-stone-400 hover:text-white"}`}
                    >
                        <Layers className="w-4 h-4" />
                        <span className="text-sm">Asset Hub</span>
                        {activeTab === "assets" && <span className="w-2 h-2 bg-yellow-400 rounded-full ml-1 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]" />}
                    </button>
                </div>
            </div>

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
                                    <p className="text-stone-500 font-medium">招待状を送りました。承認されると通知が届きます。</p>
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

            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                assetId={(() => {
                    // 選択中のクリエイターに紐づく最新の asset を取得
                    const asset = localAssets.find(a => a.creator_id === selectedCreator?.id);
                    return asset?.id || currentAssetId || `mock-${selectedCreator?.id || 'demo'}`;
                })()}
                partnerName={selectedCreator?.name || 'Support Team'}
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
        </div >
    );
}
