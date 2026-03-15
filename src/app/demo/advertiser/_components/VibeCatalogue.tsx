"use client";

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Instagram, Sparkles, CheckCircle, ArrowRight, MapPin, RefreshCw, Play, Send, X, MessageSquareQuote, DollarSign, Gift, Check, Trash2, MessageSquare, MessageCircle, Menu, ChevronLeft, Map, Calendar, AlertTriangle, Info, Search, TrendingUp, Camera, Home, Users, ChevronRight, Clock, Globe, BarChart3, Layers, UploadCloud, Plus, Bell, User, ChevronDown, Trash } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { analyzeAssetInsight } from "@/app/actions/analyze-asset-insight";
import ShopUpsellBanner from "./ShopUpsellBanner";

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
    vibe_tags: string[];
    followers: string;
    thumbnail_url: string;
    portfolio_video_urls?: string[];
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
    onReject,
    isRejecting
}: {
    creator: Creator;
    onOffer: (c: Creator) => void;
    onPlayVideo: (urls: string[]) => void;
    onReject: (c: Creator) => void;
    isRejecting?: boolean;
}) => {
    const hasVideos = creator.portfolio_video_urls && creator.portfolio_video_urls.length > 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            {/* Thumbnail */}
            <img
                src={creator.thumbnail_url}
                alt={creator.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                {(creator.genre || []).slice(0, 2).map((g) => (
                    <span
                        key={g}
                        className="backdrop-blur-md bg-black/30 text-white text-[10px] px-2 py-0.5 rounded border border-white/20 font-bold flex items-center gap-1"
                    >
                        {genreEmoji[g] || '✨'} {g}
                    </span>
                ))}
                {/* Target Region Badge (Hidden as requested)
            <span className="backdrop-blur-md bg-black/30 text-white text-[10px] px-2 py-0.5 rounded border border-white/20 font-bold">
                {ethnicityEmoji[creator.ethnicity] || '🌏'} {creator.ethnicity}
            </span>
            */}
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-left">
                <h3 className="text-white font-black text-base tracking-tight mb-1">@{creator.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-white/70 text-xs font-bold">{creator.followers} followers</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {creator.vibe_tags.map((tag) => (
                        <span key={tag} className="text-white/60 text-[10px] font-mono">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Hover Overlay: Buttons */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                <button
                    onClick={(e) => { e.stopPropagation(); onOffer(creator); }}
                    className="bg-white text-black font-black px-6 py-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 hover:scale-105 active:scale-95 text-xs flex items-center gap-2 uppercase tracking-wide"
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

                <button
                    onClick={(e) => { e.stopPropagation(); onReject(creator); }}
                    disabled={isRejecting}
                    className="mt-2 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 duration-500 delay-150 transform translate-y-4 group-hover:translate-y-0"
                >
                    {isRejecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash className="w-3 h-3" />}
                    Not Interested
                </button>
            </div>
        </motion.div>
    );
};

// --- サブコンポーネント: 資産展開セクション ---
const AssetDeploymentSection = ({ freshness, setFreshness, synced, setSynced, clientTag, latestAssetUrl }: any) => {
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
                        <div className="bg-orange-50 border border-orange-100 p-5 rounded-3xl space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="text-[10px] font-black text-orange-800 flex items-center gap-1.5 uppercase tracking-wider">
                                    <AlertTriangle className="w-4 h-4" />
                                    動画の鮮度 (Freshness)
                                </div>
                                <div className="text-2xl font-black text-orange-600 tracking-tighter">{freshness}%</div>
                            </div>
                            <div className="w-full bg-orange-200 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${freshness}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-orange-800 leading-relaxed font-bold">
                                <span className="text-orange-950 uppercase tracking-widest mr-1">AI Advice:</span> 現在の動画効果はあと約40日で低下します。
                                <button className="underline font-black ml-1 hover:text-orange-950">次回の撮影を予約する</button>
                            </p>
                        </div>

                        <div className="border rounded-[24px] p-5 bg-stone-50 relative ring-1 ring-stone-200/50">
                            <div className="flex gap-3 mb-4">
                                <div className="w-10 h-10 bg-white rounded-full border-2 border-white shadow-sm ring-1 ring-stone-200" />
                                <div>
                                    <div className="w-24 h-3 bg-stone-200 rounded mb-1.5" />
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />)}
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
                        <div className="text-center">
                            <p className="text-xs text-stone-500 px-4 leading-relaxed font-bold">埋め込みコードを貼るだけで、<br />納品された動画が<span className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">自社HPで自動更新</span>されます。</p>
                        </div>
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
            <h2 className="text-3xl font-black tracking-tighter mb-4">店舗のVIBEを言語化中...</h2>
            <div className="inline-flex flex-col items-center gap-3 text-stone-400 font-black text-xs uppercase tracking-widest">
                <p className="animate-pulse">Analyzing Instagram Assets...</p>
                <p className="animate-pulse delay-700">Identifying Inbound Demographics...</p>
            </div>
        </div>
    );
}

// --- サブコンポーネント: VIBE確認画面 ---
function VibeCheckScreen({ onConfirm, tags, onRemoveTag }: any) {
    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex p-4 bg-green-100 rounded-full text-green-700 mb-6 shadow-sm"><CheckCircle size={40} strokeWidth={3} /></div>
                <h2 className="text-4xl font-black tracking-tighter mb-3 uppercase">Analysis Complete</h2>
                <p className="text-stone-500 font-medium">解析の結果、貴店の魅力は以下のように定義されました。</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-stone-100 mb-8 ring-1 ring-stone-200/50">
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-8 text-center">Detected Vibe Tags</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                    {tags.map((tag: string, i: number) => (
                        <button key={i} onClick={() => onRemoveTag(tag)} className="group relative px-6 py-4 bg-stone-50 text-stone-800 rounded-2xl font-black text-lg animate-in zoom-in duration-300 flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm ring-1 ring-stone-200/50">
                            {tag}
                            <X size={16} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-all -mr-1" />
                        </button>
                    ))}
                </div>
                <div className="mt-12 pt-8 border-t border-stone-100 text-center space-y-8">
                    <p className="text-sm font-bold text-stone-400">親和性の高い推薦クリエイター：<span className="text-black font-black text-lg underline underline-offset-4 decoration-yellow-400">4名</span></p>
                    <button onClick={onConfirm} className="px-10 py-5 bg-black text-white rounded-2xl font-black text-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-3 mx-auto shadow-2xl active:scale-95 group">
                        マッチング候補を見る <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
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
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
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

const OfferModal = ({ isOpen, onClose, creatorName, onSend }: { isOpen: boolean; onClose: () => void; creatorName: string; onSend: () => void }) => {
    const [plan, setPlan] = useState<'barter' | 'paid'>('barter');
    const [amount, setAmount] = useState<number>(15000);
    const [selectedTags, setSelectedTags] = useState<string[]>(['看板メニュー', '店内の雰囲気']);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

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
                                            <div className="font-bold text-lg flex items-center gap-2">🎁 食事のみ</div>
                                            {plan === 'barter' && <CheckCircle className="w-5 h-5 text-black" />}
                                        </div>
                                        <div className="text-xs text-gray-500">金銭報酬なし（商品提供のみ）</div>
                                    </div>
                                    <div
                                        onClick={() => setPlan('paid')}
                                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${plan === 'paid' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-lg flex items-center gap-2">💰 報酬あり</div>
                                            {plan === 'paid' && <CheckCircle className="w-5 h-5 text-black" />}
                                        </div>
                                        <div className="text-xs text-gray-500">食事提供 + 謝礼金</div>
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

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> 招待メッセージ (英語)
                                    </label>
                                    <span className="text-xs font-bold text-yellow-600 flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                        <Sparkles className="w-3 h-3" /> NOTS推奨
                                    </span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed font-mono outline-none focus:ring-2 focus:ring-black resize-none"
                                        defaultValue={`Hi ${creatorName}! We love your style.\nOur shop has a perfect match with your vibe.\nWe'd like to invite you for a Free Experience${plan === 'paid' ? ` with \u00a5${amount.toLocaleString()} reward` : ''}.`}
                                    />
                                    <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded backdrop-blur">
                                        AI Draft v1.2
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> 相手のVIBEに合わせて最適化されています。このまま送信推奨。
                                </p>
                            </div>
                        </div>

                        <div className="p-6 pt-0 shrink-0 bg-white">
                            <button
                                onClick={onSend}
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

export default function VibeCatalogue({
    initialCreators,
    initialAssets = [],
    clientTag,
    stats = { offeredCount: 0, completedCount: 0, freshness: 0 }
}: {
    initialCreators: Creator[],
    initialAssets?: Asset[],
    clientTag?: string,
    stats?: { offeredCount: number; completedCount: number; freshness: number; }
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialGenre = searchParams.get('genre')?.toUpperCase();

    const [activeTab, setActiveTab] = useState<"search" | "assets" | "analytics">(initialGenre ? "search" : "search");
    const [step, setStep] = useState<'input' | 'analyzing' | 'vibe_check' | 'result'>(initialGenre ? 'result' : 'input');
    const [url, setUrl] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(initialGenre || 'FOOD');
    const [shopVibe, setShopVibe] = useState<string[]>(initialGenre ? ['#和モダン', '#シズル感', '#インバウンド人気'] : []);
    const [invitedCreatorIds, setInvitedCreatorIds] = useState<Set<string>>(new Set());
    const [rejectedCreatorIds, setRejectedCreatorIds] = useState<Set<string>>(new Set());
    const [upsellInsight, setUpsellInsight] = useState<{
        upsellPlan: "AI_AUTO_TUNE" | "PREMIUM_BOOST" | "NONE";
        upsellMessage: string;
    } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [filterGenre, setFilterGenre] = useState<string>(initialGenre || 'ALL');
    const [filterRegion, setFilterRegion] = useState<string>('ALL');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [synced, setSynced] = useState(false);
    const [freshness, setFreshness] = useState(85);
    const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<{ urls: string[]; name: string } | null>(null);

    const filteredCreators = initialCreators.filter(c => {
        const genreMatch = filterGenre === 'All' || (c.genre && c.genre.includes(filterGenre.toUpperCase()));
        const regionMatch = filterRegion === 'ALL'
            || (filterRegion === 'WESTERN' && (c.ethnicity === 'AMERICA' || c.ethnicity === 'EUROPE'))
            || (filterRegion === 'ASIAN' && c.ethnicity === 'ASIA')
            || (filterRegion === 'GLOBAL');
        return genreMatch && regionMatch;
    });

    // mock data for UI fallback removed in favor of initialAssets

    // Mock analysis effect removed as we now use /demo/analyzing page with real server action

    const handleUrlSubmit = () => {
        if (!url) return;
        // 解析画面へ遷移 (URLパラメータを付与してサーバーサイド解析を走らせる)
        router.push(`/demo/analyzing?genre=${selectedGenre}&url=${encodeURIComponent(url)}`);
    };

    const openInviteModal = (creator: Creator) => {
        setSelectedCreator(creator);
        setIsModalOpen(true);
    };

    const handleOfferSent = () => {
        if (selectedCreator) {
            setInvitedCreatorIds(prev => new Set(prev).add(selectedCreator.id));
        }
        setIsSent(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsSent(false);
            setTimeout(() => setIsChatOpen(true), 300);
        }, 2000);
    };

    const handleReject = (creator: Creator) => {
        setRejectedCreatorIds(prev => new Set(prev).add(creator.id));

        startTransition(async () => {
            try {
                const result = await analyzeAssetInsight({
                    assetId: `reject_${creator.id}_${Date.now()}`,
                    creatorId: creator.id,
                    shopId: clientTag || "demo-shop",
                    shopRequirements: shopVibe,
                    creatorTags: creator.vibe_tags
                });

                if (result.success && result.insight.shopUpsellPlan !== "NONE") {
                    setUpsellInsight({
                        upsellPlan: result.insight.shopUpsellPlan,
                        upsellMessage: result.insight.shopUpsellMessage
                    });
                }
            } catch (error) {
                console.error("Failed to analyze reject insight:", error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-32 pt-16">
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 z-40 px-6 flex items-center justify-between">
                <div className="font-black text-xl tracking-tighter flex items-center gap-1.5">
                    NOTS<span className="text-yellow-500">C2C</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative p-2.5 text-stone-400 hover:bg-stone-100 rounded-full transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="relative p-2.5 text-stone-400 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://i.pravatar.cc/100?img=33" className="w-full h-full object-cover" alt="User" />
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
                                        <div className="flex justify-center -space-x-4">
                                            {[11, 12, 13, 14, 15].map(i => (
                                                <img
                                                    key={i}
                                                    src={`https://i.pravatar.cc/100?img=${i}`}
                                                    className="w-12 h-12 rounded-full border-4 border-stone-50 shadow-sm"
                                                    alt="avatar"
                                                />
                                            ))}
                                            <div className="w-12 h-12 rounded-full border-4 border-stone-50 bg-yellow-400 flex items-center justify-center font-bold text-xs shadow-sm">+3k</div>
                                        </div>
                                        <div className="text-green-600 font-bold flex justify-center items-center gap-2 text-sm bg-green-50 w-fit mx-auto px-4 py-1.5 rounded-full border border-green-100">
                                            <RefreshCw className="w-4 h-4 animate-spin-slow" /> 248組 が今週マッチングしました
                                        </div>
                                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                                            インバウンド集客を開始
                                        </h1>
                                        <p className="text-stone-500 font-medium max-w-xl mx-auto">
                                            あなたの店の魅力を解析。
                                            「海外から見た日本」の文脈を理解したネイティブクリエイターをAIが即座に提案します。
                                        </p>
                                    </div>

                                    <div className="max-w-2xl mx-auto bg-white p-2.5 rounded-3xl shadow-2xl border border-stone-100 flex flex-col sm:flex-row items-center gap-2 ring-1 ring-stone-200">
                                        <div className="relative border-r border-stone-200 pr-2 flex items-center">
                                            <select
                                                value={selectedGenre}
                                                onChange={(e) => setSelectedGenre(e.target.value)}
                                                className="appearance-none bg-transparent font-bold text-sm pl-6 pr-10 py-3 outline-none cursor-pointer hover:bg-stone-50 rounded-l-full transition-colors text-stone-900"
                                            >
                                                <option value="FOOD">🍣 Food</option>
                                                <option value="BEAUTY">💅 Beauty</option>
                                                <option value="TRAVEL">⛩️ Travel</option>
                                                <option value="EXPERIENCE">🧖‍♀️ Experience</option>
                                                <option value="LIFESTYLE">✨ Lifestyle</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 pointer-events-none" />
                                        </div>
                                        <div className="flex items-center flex-1 w-full pl-4 gap-3">
                                            <Search className="w-6 h-6 text-stone-400" />
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="Instagram または GoogleマップのURL"
                                                className="flex-1 py-4 outline-none text-lg font-medium placeholder:text-stone-300"
                                                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                            />
                                        </div>
                                        <button
                                            onClick={handleUrlSubmit}
                                            className="w-full sm:w-auto bg-black text-white px-10 py-5 rounded-2xl font-black hover:bg-stone-800 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shrink-0"
                                        >
                                            分析を開始 <span className="text-yellow-400 animate-pulse">✨</span>
                                        </button>
                                    </div>

                                </div>
                            )}

                            {step === 'analyzing' && <AnalyzingScreen />}

                            {step === 'vibe_check' && (
                                <VibeCheckScreen
                                    tags={shopVibe}
                                    onRemoveTag={(tag: string) => setShopVibe(prev => prev.filter(t => t !== tag))}
                                    onConfirm={() => {
                                        setStep('result');
                                    }}
                                />
                            )}

                            {step === 'result' && (
                                <div className="space-y-8 py-8">
                                    <div className="flex justify-between items-end border-b border-stone-100 pb-6">
                                        <div className="space-y-1 text-left">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-3xl font-black tracking-tighter">Creator Catalog</h2>
                                                <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full align-middle font-bold uppercase tracking-wider">AI選定</span>
                                                {initialGenre && (
                                                    <span className="bg-black text-white text-[10px] px-3 py-0.5 rounded-full align-middle font-bold flex items-center gap-1.5 shadow-lg border border-white/20 animate-in fade-in slide-in-from-left-4 duration-1000">
                                                        <Sparkles className="w-3 h-3 text-yellow-400" /> Optimized for {initialGenre}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-stone-400 text-sm font-medium">貴店と高相性のクリエイター <span className="font-bold text-gray-900">{filteredCreators.length}名</span></p>
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
                                                    className={`relative px-5 py-2.5 rounded-full text-sm font-black transition-all duration-300 flex items-center gap-2 ${filterGenre === tab.key
                                                        ? 'bg-black text-white shadow-[0_15px_30px_rgba(0,0,0,0.3)] scale-110 ring-2 ring-black ring-offset-2 z-10'
                                                        : 'bg-white text-stone-400 border border-stone-200 hover:border-stone-400 hover:text-stone-600'
                                                        } ${tab.key === initialGenre ? 'border-yellow-400/50 border-2' : ''}`}
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
                                            {upsellInsight && (
                                                <ShopUpsellBanner
                                                    upsellPlan={upsellInsight.upsellPlan}
                                                    upsellMessage={upsellInsight.upsellMessage}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                                        {filteredCreators.filter(c => !rejectedCreatorIds.has(c.id)).map((creator) => (
                                            <CreatorCard
                                                key={creator.id}
                                                creator={creator}
                                                onOffer={(c) => openInviteModal(c)}
                                                onPlayVideo={(urls) => setSelectedVideo({ urls, name: creator.name })}
                                                onReject={handleReject}
                                                isRejecting={isPending}
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
                                    <p className="text-stone-400 text-sm font-medium uppercase tracking-widest text-left">動画資産の一元管理と展開</p>
                                </div>
                                <button className="bg-white border-2 border-stone-100 hover:border-black text-black px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm transition-all active:scale-95 uppercase tracking-widest">
                                    <UploadCloud className="w-4 h-4" /> 外部動画を取り込む
                                </button>
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
                                        <AnimatedCounter value={stats.offeredCount} />
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
                                        <AnimatedCounter value={stats.completedCount} />
                                    </div>
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-[0.2em]">獲得動画</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col items-center justify-center space-y-2 group hover:scale-[1.02] transition-transform"
                                >
                                    <div className="text-5xl font-black text-green-500 flex items-center gap-1">
                                        <AnimatedCounter value={stats.freshness} />
                                        <span className="text-2xl">%</span>
                                    </div>
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-[0.2em]">資産鮮度</p>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {initialAssets.map((asset) => {
                                    const creatorName = asset.creator?.name || asset.creator?.tiktok_handle || 'Unknown Creator';
                                    const dateStr = asset.created_at ? new Date(asset.created_at).toISOString().split('T')[0] : '2024-03-01';
                                    const src = asset.creator?.avatar_url || 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3000&auto=format&fit=crop';

                                    return (
                                        <div key={asset.id} className="bg-white rounded-[32px] border border-stone-100 overflow-hidden shadow-sm group hover:shadow-xl transition-all ring-1 ring-stone-50">
                                            <div className="aspect-video bg-stone-100 relative group-hover:scale-[1.02] transition-transform duration-500">
                                                <span className="absolute top-4 left-4 z-10 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg">MANEKEY</span>
                                                <img src={src} className="w-full h-full object-cover" alt="" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
                                                    <RefreshCw className="w-3 h-3 animate-spin-slow" /> SYNC ON
                                                </div>
                                            </div>
                                            <div className="p-6 space-y-4 text-left">
                                                <div>
                                                    <h3 className="font-black text-lg tracking-tight">{creatorName}</h3>
                                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{dateStr} • {asset.status || 'Asset'}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="flex-1 text-[11px] font-black border-2 border-stone-100 rounded-xl py-3 hover:bg-stone-50 transition-colors uppercase">詳細</button>
                                                    <button className="flex-1 text-[11px] font-black bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 transition-all shadow-md active:scale-95 uppercase">Maps投稿</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="border-3 border-dashed border-stone-200 rounded-[32px] flex flex-col items-center justify-center text-stone-300 hover:border-green-400 hover:bg-green-50/50 hover:text-green-500 transition-all cursor-pointer min-h-[280px] group">
                                    <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                                        <Plus className="w-8 h-8" strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest leading-none">動画を追加</span>
                                </div>
                            </div>

                            <div className="pt-12">
                                <div className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-xl ring-1 ring-stone-200/50">
                                    <AssetDeploymentSection
                                        freshness={freshness}
                                        setFreshness={setFreshness}
                                        synced={synced}
                                        setSynced={setSynced}
                                        clientTag={clientTag || 'demo-shop'}
                                        latestAssetUrl={initialAssets[0]?.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-people-eating-at-a-restaurant-4433-large.mp4'}
                                    />
                                </div>
                            </div>
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
                    <button
                        onClick={() => setActiveTab("search")}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "search" ? "bg-white text-black font-bold shadow-lg" : "text-stone-400 hover:text-white"}`}
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Search</span>
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-1" />
                    <button
                        onClick={() => setActiveTab("assets")}
                        className={`relative flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "assets" ? "bg-white text-black font-bold shadow-lg" : "text-stone-400 hover:text-white"}`}
                    >
                        <Layers className="w-4 h-4" />
                        <span className="text-sm">Assets</span>
                        {activeTab !== "assets" && <span className="w-2 h-2 bg-yellow-400 rounded-full ml-1" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("analytics")}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 ${activeTab === "analytics" ? "bg-white text-black font-bold shadow-lg" : "text-stone-400 hover:text-white"}`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">ROI</span>
                    </button>
                </div>
            </div>

            {isSent ? (
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
                    creatorName={selectedCreator?.name || ''}
                    onSend={handleOfferSent}
                />
            )}

            <ChatSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

            <PortfolioVideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoUrls={selectedVideo?.urls || []}
                creatorName={selectedVideo?.name || ''}
            />
        </div>
    );
}
