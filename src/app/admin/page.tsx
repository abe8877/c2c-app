"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Search, Filter, MoreHorizontal, MapPin, ChevronLeft, ChevronRight, Loader2, Save, Check, PlayCircle, Copy, ImageIcon, CheckCircle2, Clock, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ReviewStatusSelect from "@/app/admin/ReviewStatusSelect";
import { getAdminStats, getLostAssets, getSuccessLogs, getOngoingOffers } from '@/app/actions/admin';
import { triggerN8nWebhook } from '@/app/actions/creator';
import { Info } from 'lucide-react';

// Define the Creator Interface
interface CreatorData {
    id: string;
    name: string;
    tier: 'S' | 'A' | 'B' | '-';
    vibeCluster: string[];
    vibeHint: string;
    genre: string[];
    ethnicity: string;
    followers: string;
    tiktokUrl: string;
    bestVideoUrl: string;
    status: string;
    is_public: boolean;
    imgColor: string;
    thumbnail_url: string | null;
}

// デモ用のクラスター定義（ランダム割り当て用）
const demoClusters = ['TRADITIONAL', 'URBAN', 'KAWAII', 'NATURE', 'LUXURY', 'RETRO'];

// 簡易トグルスイッチコンポーネント
const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onToggle();
        }}
        className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
      ${isOn ? "bg-green-500" : "bg-gray-200"}
    `}
    >
        <span
            className={`
        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${isOn ? "translate-x-6" : "translate-x-1"}
      `}
        />
    </button>
);

function AdminDashboard() {
    const supabase = createClient(); // ★ Supabaseインスタンス化

    const [creators, setCreators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'logs' ? 'logs' : 'creators';

    // タブ管理
    const [activeTab, setActiveTab] = useState<'creators' | 'logs'>(initialTab);
    const [logTab, setLogTab] = useState<'success' | 'lost' | 'ongoing'>('success');

    // 統計データ管理
    const [stats, setStats] = useState<any>(null);
    const [lostAssets, setLostAssets] = useState<any[]>([]);
    const [successLogs, setSuccessLogs] = useState<any[]>([]);
    const [ongoingOffers, setOngoingOffers] = useState<any[]>([]);

    // 編集保存の演出用
    const [isSaving, setIsSaving] = useState(false);

    // ページネーション & フィルタリング
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const [filterTier, setFilterTier] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterVibe, setFilterVibe] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<any>(null);
    const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // --- Batch Action State ---
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Toggle Selection
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    // Bulk Action: Generate AI Prompt for Offers
    const handleBatchGenerateDraft = () => {
        if (selectedIds.size === 0) return;

        const targets = creators.filter(c => selectedIds.has(c.id));

        // Create a prompt string for Gemini/ChatGPT
        const promptText = `
Role: MANEKEY Scout AI
Task: Write invitation DMs for the following creators.
---
${targets.map(c => `
[Candidate]
Name: ${c.name}
Vibe: ${c.vibeCluster || c.vibeHint} (Hint: ${c.vibeHint})
Tier: ${c.tier}
Offer: ${c.tier === 'S' ? 'Paid Partnership' : 'Exclusive Invitation (Barter)'}
Reference: ${c.bestVideoUrl}
`).join('\n')}
---
Requirement: Keep it short, respectful, and mention their specific vibe.
`.trim();

        navigator.clipboard.writeText(promptText);
        alert(`Copied ${targets.length} creator profiles to clipboard for AI!`);
        setSelectedIds(new Set()); // Reset
    };

    // ★ 1. データ取得処理 (SupabaseからRead)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // ユーザー情報の取得
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                // クリエイター一覧
                const { data, error } = await supabase
                    .from('creators')
                    .select('*')
                    .order('followers', { ascending: false });

                if (error) throw error;

                // 取得したデータをUI用に整形
                const formattedData = (data || []).map((item, index) => {
                    const isSystemHidden = !item.is_onboarded && item.was_public; // was_publicカラムがあると想定、なければitem.idから推測等

                    // is_ai_recommendedの場合、未着手ならデフォルトをセット
                    let reviewStatus = item.review_status || 'pending';
                    if (item.is_ai_recommended && reviewStatus === 'pending') {
                        reviewStatus = 'ai_recommended';
                    }

                    return {
                        id: item.id,
                        name: item.name || item.tiktok_handle || 'Unknown',
                        tier: item.tier || '-',
                        genre: item.genre || [],
                        ethnicity: item.ethnicity || '-',
                        followers: item.followers || 0,
                        followersStr: (item.followers || 0).toLocaleString(),
                        tiktokUrl: item.tiktok_url || '',
                        vibeHint: item.vibe_tags?.[0] || ['Cinematic', 'Urban', 'Cafe', 'Retro'][index % 4],
                        vibeCluster: item.vibe_tags || [],
                        bestVideoUrl: item.portfolio_video_urls?.[0] || item.scouted_video_url || '',
                        imgColor: getColorByIndex(index),
                        status: 'approved',
                        review_status: reviewStatus,
                        is_public: item.is_onboarded || false,
                        is_system_hidden: isSystemHidden,
                        is_ai_recommended: !!item.is_ai_recommended,
                        thumbnail_url: item.thumbnail_url || item.avatar_url || null
                    };
                });
                setCreators(formattedData);

                // 統計情報 (Server Action)
                const adminStats = await getAdminStats();
                setStats(adminStats);

                // Success案件 (Server Action)
                const success = await getSuccessLogs();
                setSuccessLogs(success);

                // Lost案件 (Server Action)
                const lost = await getLostAssets();
                setLostAssets(lost);

                // Ongoing案件 (Server Action)
                const ongoing = await getOngoingOffers();
                setOngoingOffers(ongoing);

                setLoading(false);
            } catch (error: any) {
                console.error('Data Fetch Error:', error);
                setErrorMsg("データの読み込みに失敗しました。");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ★ 2. 編集ロジック (SupabaseへUpdate)
    const handleUpdate = async (id: string, field: string, value: any) => {
        setIsSaving(true);

        // 画面の見た目を即座に変更 (Optimistic UI)
        setCreators(prev => prev.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));

        try {
            // DB更新用のペイロードを作成
            let updatePayload: any = {};
            if (field === 'tier') updatePayload = { tier: value };
            if (field === 'vibeCluster') updatePayload = { vibe_tags: [value] };
            if (field === 'is_public') updatePayload = { is_onboarded: value };
            if (field === 'genre') updatePayload = { genre: value };

            // DB更新実行
            const { error } = await supabase
                .from('creators')
                .update(updatePayload)
                .eq('id', id);

            if (error) throw error;

            // Trigger n8n webhook if making public and thumbnail is missing
            if (field === 'is_public' && value === true) {
                const creator = creators.find(c => c.id === id);
                if (creator && !creator.thumbnail_url) {
                    triggerN8nWebhook(creator.id, creator.bestVideoUrl);
                }
            }

            // 保存演出を0.8秒後に消す
            setTimeout(() => setIsSaving(false), 800);
        } catch (error) {
            console.error('Update Error:', error);
            alert('保存に失敗しました。リロードしてやり直してください。');
            setIsSaving(false);
        }
    };

    // ★ 3. 配列データをトグル更新するロジック (今回追加)
    const handleToggleArrayItem = async (id: string, field: 'genre' | 'vibeCluster', value: string) => {
        setIsSaving(true);

        const creator = creators.find(c => c.id === id);
        if (!creator) return;

        const currentArray = creator[field] || [];
        const newArray = currentArray.includes(value)
            ? currentArray.filter((v: string) => v !== value)
            : [...currentArray, value];

        setCreators(prev => prev.map(c => c.id === id ? { ...c, [field]: newArray } : c));

        try {
            const updatePayload = field === 'vibeCluster' ? { vibe_tags: newArray } : { genre: newArray };
            const { error } = await supabase.from('creators').update(updatePayload).eq('id', id);
            if (error) throw error;
            setTimeout(() => setIsSaving(false), 800);
        } catch (error) {
            console.error('Update Error:', error);
            alert('保存に失敗しました。');
            setIsSaving(false);
        }
    };

    // ユーティリティ: インデックスから色を生成
    const getColorByIndex = (i: number) => {
        const colors = ['bg-stone-300', 'bg-stone-800', 'bg-orange-200', 'bg-blue-200', 'bg-pink-200', 'bg-green-200'];
        return colors[i % colors.length];
    };

    // ユーティリティ: クラスターごとのバッジ色定義
    const getClusterColor = (cluster: string) => {
        switch (cluster) {
            case 'TRADITIONAL': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'URBAN': return 'bg-slate-800 text-cyan-400 border-slate-700';
            case 'KAWAII': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'NATURE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'LUXURY': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'RETRO': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // フィルタリング処理
    const filteredData = creators.filter(c => {
        const matchTier = filterTier === 'ALL' || c.tier === filterTier;
        const matchCategory = filterCategory === 'ALL' || (c.genre && c.genre.includes(filterCategory));
        const matchVibe = filterVibe === 'ALL' || (c.vibeCluster && c.vibeCluster.includes(filterVibe));
        const matchStatus = filterStatus === 'ALL' || 
            (filterStatus === 'public' ? (c.is_public && c.review_status === 'approved') : 
             filterStatus === 'hidden' ? (!c.is_public && !c.is_system_hidden) :
             filterStatus === 'system_hidden' ? c.is_system_hidden : 
             filterStatus === 'ai_recommended' ? (c.review_status === 'ai_recommended' || c.is_ai_recommended) :
             c.review_status === filterStatus);
        const matchSearch = !searchQuery ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tiktokUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.ethnicity && c.ethnicity.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (c.genre && c.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase())));

        return matchTier && matchCategory && matchVibe && matchStatus && matchSearch;
    }).sort((a, b) => {
        // 優先順位 1: System Hidden (最優先)
        if (a.is_system_hidden && !b.is_system_hidden) return -1;
        if (!a.is_system_hidden && b.is_system_hidden) return 1;

        // 優先順位 2: AI Recommended
        if (a.review_status === 'ai_recommended' && b.review_status !== 'ai_recommended') return -1;
        if (a.review_status !== 'ai_recommended' && b.review_status === 'ai_recommended') return 1;

        // 優先順位 3: Tier Bタブの場合は AI Recommended をさらに優先（既に上記でカバーされているが念のため）
        if (filterTier === 'B') {
            if (a.is_ai_recommended && !b.is_ai_recommended) return -1;
            if (!a.is_ai_recommended && b.is_ai_recommended) return 1;
        }

        return 0; // 同等の場合は現状維持（フォロワー順）
    });

    // ダミーログデータ
    const mockLogs = [
        { id: '1', advertiser: '抹茶カフェ 翡翠', creator: 'Sarah Jenkins', matchScore: 98, vibes: ['#和モダン', '#自然光'], date: '2024-03-02 14:20' },
        { id: '2', advertiser: 'SUSHI BAR TOKYO', creator: 'Liam Wong', matchScore: 92, vibes: ['#Urban', '#Luxury'], date: '2024-03-02 12:45' },
        { id: '3', advertiser: 'Retro Ramen', creator: 'Elena R.', matchScore: 89, vibes: ['#Retro', '#HiddenGem'], date: '2024-03-01 18:30' },
        { id: '4', advertiser: 'Harajuku Desserts', creator: 'Mika K.', matchScore: 95, vibes: ['#Kawaii', '#Photogenic'], date: '2024-03-01 15:10' },
    ];

    // 代替候補を取得するロジック (Mock)
    const getAlternatives = (offer: any) => {
        // 本来はAPIを叩くが、ここでは既存のcreatorsから適当にピックアップ
        return creators
            .filter(c => c.is_public && (c.tier === 'S' || c.tier === 'A'))
            .slice(0, 5);
    };

    const handlePushAlternative = async (offerId: string, altId: string) => {
        setIsActionLoading(true);
        // 推奨：本来はここでもAPIを叩き、offerのステータスを alternative_proposed に更新する
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('広告主へ代替案を提案しました。');
        setExpandedOfferId(null);
        setIsActionLoading(false);
    };

    // ページネーション処理
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            {/* Saving Indicator */}
            <div className={`absolute top-20 right-8 bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 z-[100] ${isSaving ? 'opacity-100' : 'opacity-0 invisible'}`}>
                {isSaving ? <><Save size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> Saved</>}
            </div>

            {/* Global Loader (グルグル表示) */}
            {(loading || isActionLoading || isSaving) && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-[1px] z-[200] flex items-center justify-center pointer-events-auto cursor-wait select-none">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                        <Loader2 size={48} className="animate-spin text-slate-900" />
                        <p className="text-slate-900 font-black text-sm uppercase tracking-widest">Processing...</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    {activeTab === 'creators' ? 'Creator Database' : 'Matching Analysis Logs'}
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full transition-all">
                        {activeTab === 'creators'
                            ? `${filteredData.length.toLocaleString()} / ${creators.length.toLocaleString()}`
                            : (logTab === 'success' ? successLogs.length : logTab === 'lost' ? lostAssets.length : ongoingOffers.length)}
                        <span className="ml-1 opacity-50 font-normal">Matching</span>
                    </span>
                </h1>
                <div className="flex gap-4 items-center">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="フリーワード検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all w-64"
                        />
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="text-right">
                            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase leading-none mb-1">Admin Account</p>
                            <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                                {user?.email || 'admin@nots.jp'}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-slate-100 ring-offset-1">
                            {user?.email?.[0].toUpperCase() || 'A'}
                        </div>
                    </div>
                </div>
            </header>

            {activeTab === 'creators' ? (
                <>
                    {/* Action Bar (Filters & Pagination Info) */}
                    <div className="p-6 pb-0 flex justify-between items-center flex-shrink-0">
                        <div className="flex gap-2">
                            {['ALL', 'S', 'A', 'B'].map((tier) => {
                                const count = tier === 'ALL'
                                    ? creators.length
                                    : creators.filter(c => c.tier === tier).length;

                                return (
                                    <button
                                        key={tier}
                                        onClick={() => { setFilterTier(tier); setCurrentPage(1); }}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${filterTier === tier ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {tier === 'ALL' ? 'All' : `Tier ${tier}`}
                                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filterTier === tier ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Additional Dropdown Filters */}
                        <div className="flex gap-2">
                            <select
                                value={filterCategory}
                                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-2 rounded-lg text-sm font-bold border border-slate-200 bg-white text-slate-600 outline-none hover:bg-slate-50 cursor-pointer"
                            >
                                <option value="ALL">All Categories</option>
                                <option value="FOOD">Food</option>
                                <option value="BEAUTY">Beauty</option>
                                <option value="TRAVEL">Travel</option>
                                <option value="EXPERIENCE">Experience</option>
                                <option value="LIFESTYLE">Lifestyle</option>
                            </select>
                            <select
                                value={filterVibe}
                                onChange={(e) => { setFilterVibe(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-2 rounded-lg text-sm font-bold border border-slate-200 bg-white text-slate-600 outline-none hover:bg-slate-50 cursor-pointer"
                            >
                                <option value="ALL">All Vibes</option>
                                <option value="Cinematic">Cinematic</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Kawaii">Kawaii</option>
                                <option value="Street">Street</option>
                                <option value="Vlog">Vlog</option>
                                <option value="Traditional">Traditional</option>
                            </select>

                            <select
                                value={filterStatus}
                                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-2 rounded-lg text-sm font-bold border border-slate-200 bg-white text-slate-600 outline-none hover:bg-slate-50 cursor-pointer shadow-sm"
                            >
                                <option value="ALL">All Status</option>
                                <option value="public">☑ Public</option>
                                <option value="hidden">☒ Hidden</option>
                                <option value="system_hidden">🤖 System Hidden</option>
                                <option value="ai_recommended">💎 AI Recommend</option>
                            </select>

                            <select
                                value={filterStatus}
                                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-2 rounded-lg text-sm font-bold border border-slate-200 bg-white text-slate-600 outline-none hover:bg-slate-50 cursor-pointer shadow-sm"
                            >
                                <option value="ALL">All Review</option>
                                <option value="pending">⏳ Pending</option>
                                <option value="approved">✓ Approved</option>
                                <option value="rejected">✕ Rejected</option>
                                <option value="ai_recommended">💎 AI Recommended</option>
                            </select>
                        </div>

                        {/* NEW: Batch Action Button */}
                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleBatchGenerateDraft}
                                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-slate-700 transition animate-in fade-in slide-in-from-bottom-2"
                            >
                                <Copy size={16} />
                                Generate Drafts ({selectedIds.size})
                            </button>
                        )}

                        <div className="text-sm text-slate-500 font-bold">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <strong>Error:</strong> {errorMsg}
                        </div>
                    )}

                    {/* Table Area */}
                    <div className="p-6 flex-1 overflow-auto">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden pb-12 min-h-[500px]">

                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full py-20">
                                    <Loader2 size={40} className="animate-spin text-yellow-500 mb-4" />
                                    <p className="text-slate-500 font-bold">Loading Database...</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                                        <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                            <th className="px-6 py-4 font-bold w-12">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedIds(new Set(currentData.map(c => c.id)));
                                                        else setSelectedIds(new Set());
                                                    }}
                                                    checked={selectedIds.size > 0 && selectedIds.size === currentData.length}
                                                    className="rounded border-slate-300"
                                                />
                                            </th>
                                            <th className="px-6 py-4 font-bold">Creator Profile</th>
                                            <th className="px-4 py-4 font-bold w-20 text-center">Thumb</th>
                                            <th className="px-4 py-4 font-bold w-20 text-center">Video</th>
                                            <th className="px-4 py-4 font-bold w-28">Tier</th>
                                            <th className="px-4 py-4 font-bold w-40">Category</th>
                                            <th className="px-4 py-4 font-bold w-36">Cluster</th>
                                            <th className="px-4 py-4 font-bold text-center">Status</th>
                                            <th className="px-4 py-4 font-bold text-right">Review</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentData.map((creator) => (
                                            <tr key={creator.id} className={`hover:bg-slate-50 transition group ${selectedIds.has(creator.id) ? 'bg-slate-50' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(creator.id)}
                                                        onChange={() => toggleSelection(creator.id)}
                                                        className="rounded border-slate-300 text-slate-900 focus:ring-0"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 ${creator.imgColor} rounded-full flex items-center justify-center text-xs font-bold text-black/50 uppercase`}>
                                                            {creator.name.slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">@{creator.name}</div>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                <MapPin size={12} /> {creator.ethnicity} • {creator.followers} followers
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Thumbnail Status */}
                                                <td className="px-4 py-4 text-center">
                                                    {creator.thumbnail_url ? (
                                                        <div className="relative group/thumb inline-block">
                                                            <img
                                                                src={creator.thumbnail_url}
                                                                alt=""
                                                                className="w-10 h-14 rounded-lg object-cover border border-slate-200 shadow-sm group-hover/thumb:ring-2 group-hover/thumb:ring-teal-400 transition-all"
                                                            />
                                                            <span className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full p-0.5 shadow-sm">
                                                                <CheckCircle2 size={10} />
                                                            </span>
                                                            {/* Hover Preview */}
                                                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 invisible group-hover/thumb:opacity-100 group-hover/thumb:visible transition-all duration-200 pointer-events-none">
                                                                <img
                                                                    src={creator.thumbnail_url}
                                                                    alt=""
                                                                    className="w-32 h-44 rounded-xl object-cover border-2 border-white shadow-2xl"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-bold px-2 py-1 rounded-full">
                                                            <Clock size={10} /> Pending
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Video Asset Indicator */}
                                                <td className="px-4 py-4 text-center">
                                                    {creator.bestVideoUrl ? (
                                                        <a
                                                            href={creator.bestVideoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-stone-300 hover:text-red-500 transition p-1 inline-block"
                                                        >
                                                            <PlayCircle size={20} />
                                                        </a>
                                                    ) : (
                                                        <div className="text-slate-200">
                                                            <PlayCircle size={20} />
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Editable Tier */}
                                                <td className="px-4 py-4">
                                                    <select
                                                        value={creator.tier}
                                                        onChange={(e) => handleUpdate(creator.id, 'tier', e.target.value)}
                                                        className={`w-full px-2 py-1.5 rounded border text-xs font-bold cursor-pointer focus:outline-none
                                    ${creator.tier === 'S' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                                                creator.tier === 'A' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                                                    'bg-white border-slate-200 text-slate-600'}`}
                                                    >
                                                        <option value="S">S</option>
                                                        <option value="A">A</option>
                                                        <option value="B">B</option>
                                                        <option value="-">-</option>
                                                    </select>
                                                </td>

                                                {/* Category (Editable) */}
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                        {['FOOD', 'BEAUTY', 'TRAVEL', 'EXPERIENCE', 'LIFESTYLE', 'SHOPPING'].map(g => {
                                                            const isActive = creator.genre.includes(g);
                                                            return (
                                                                <button
                                                                    key={g}
                                                                    onClick={() => handleToggleArrayItem(creator.id, 'genre', g)}
                                                                    className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                                >
                                                                    {g}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </td>

                                                {/* VIBE Cluster (そのまま) */}
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                        {/* AIの推測（ヒント）があれば表示 */}
                                                        {creator.vibeCluster.length === 0 && creator.vibeHint && (
                                                            <span className="text-[10px] text-slate-400 font-mono w-full mb-1">🤖 AI: {creator.vibeHint}</span>
                                                        )}
                                                        {['Cinematic', 'Luxury', 'Street', 'Kawaii', 'Vlog', 'Traditional'].map(v => {
                                                            const isActive = creator.vibeCluster.includes(v);
                                                            return (
                                                                <button
                                                                    key={v}
                                                                    onClick={() => handleToggleArrayItem(creator.id, 'vibeCluster', v)}
                                                                    className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-colors ${isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
                                                                >
                                                                    {v}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </td>

                                                {/* Public Status (Toggle) */}
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <ToggleSwitch
                                                            isOn={creator.is_public}
                                                            onToggle={() => {
                                                                if (!creator.is_public) {
                                                                    if (window.confirm("このクリエイターを公開設定にしますか？\n（基準未達の場合はフィルタリングにより広告主UIには表示されない可能性があります）")) {
                                                                        handleUpdate(creator.id, 'is_public', true);
                                                                    }
                                                                } else {
                                                                    handleUpdate(creator.id, 'is_public', false);
                                                                }
                                                            }}
                                                        />
                                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border flex items-center gap-1.5 min-w-[100px] justify-center transition-all ${creator.is_public
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                                                            : creator.is_system_hidden
                                                                ? "bg-amber-50 text-amber-600 border-amber-200 shadow-sm ring-1 ring-amber-400/20"
                                                                : "bg-stone-50 text-stone-400 border-stone-200"
                                                            }`}>
                                                            {creator.is_public ? (
                                                                <>
                                                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                                                    <span>Public</span>
                                                                </>
                                                            ) : creator.is_system_hidden ? (
                                                                <>
                                                                    <span className="animate-pulse">🤖</span>
                                                                    <span>System Hidden</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Clock size={12} className="text-stone-300" />
                                                                    <span>Hidden</span>
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status (Approved) */}
                                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                                    <ReviewStatusSelect
                                                        creatorId={creator.id}
                                                        initialStatus={creator.review_status}
                                                        isAiRecommended={creator.is_ai_recommended}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Pagination Footer */}
                    <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center flex-shrink-0">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} /> Prev
                        </button>
                        <div className="flex gap-1">
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                let p = i + 1;
                                if (currentPage > 3) p = currentPage - 2 + i;
                                if (p > totalPages) return null;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center ${currentPage === p ? 'bg-black text-white' : 'hover:bg-slate-100'}`}
                                    >
                                        {p}
                                    </button>
                                )
                            })}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="p-8 flex-1 overflow-auto bg-slate-50">
                    <div className="flex items-center justify-between mb-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 mr-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-1">今週の解析数</p>
                                <div className="text-3xl font-black">
                                    {stats?.weeklyAnalysis?.toLocaleString() || '1,280'}
                                    <span className="text-sm text-green-500 font-bold ml-2">↑ 12%</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-1">平均マッチ率</p>
                                <div className="text-3xl font-black">{stats?.avgMatchRate || '88.5'}%</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-1">アクティブ店舗</p>
                                <div className="text-3xl font-black">
                                    {stats?.activeShops || '42'}
                                    <span className="text-sm text-green-500 font-bold ml-2">↑ 5%</span>
                                </div>
                            </div>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex bg-slate-200 p-1 rounded-xl h-fit">
                            <button
                                onClick={() => setLogTab('success')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${logTab === 'success' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Success
                            </button>
                            <button
                                onClick={() => setLogTab('lost')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${logTab === 'lost' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Unmatched
                            </button>
                            <button
                                onClick={() => setLogTab('ongoing')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${logTab === 'ongoing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                進行中
                            </button>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        {logTab === 'success' ? (
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                                        <th className="px-6 py-4">Advertiser (Shop URL)</th>
                                        <th className="px-6 py-4">Matched Creator</th>
                                        <th className="px-6 py-4 text-center">Score</th>
                                        <th className="px-6 py-4">Detected Vibes</th>
                                        <th className="px-6 py-4 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {successLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-bold text-slate-700">{log.advertiser}</td>
                                            <td className="px-6 py-4 font-bold text-blue-600">{log.creator}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg font-black text-xs">{log.matchScore}%</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1">
                                                    {log.vibes.map((v: string) => <span key={v} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">{v}</span>)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400 font-medium text-xs tabular-nums">{log.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : logTab === 'lost' ? (
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                                        <th className="px-6 py-4">Advertiser</th>
                                        <th className="px-6 py-4">Rejected Creator</th>
                                        <th className="px-6 py-4">Missing Vibes</th>
                                        <th className="px-6 py-4">AI Action</th>
                                        <th className="px-6 py-4 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {lostAssets.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-bold text-slate-700">{log.advertiser}</td>
                                            <td className="px-6 py-4 font-bold text-slate-400">{log.rejectedCreator}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {log.missingVibes.map((v: string) => (
                                                        <span key={v} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">
                                                            #{v}
                                                        </span>
                                                    ))}
                                                    {log.missingVibes.length === 0 && <span className="text-slate-300 text-[10px]">None</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs transition-all">
                                                <div className="flex items-center gap-2 group relative">
                                                    <span className="truncate text-slate-600 italic">
                                                        {log.aiAction}
                                                    </span>
                                                    <div className="opacity-0 group-hover:opacity-100 absolute left-full ml-2 z-50 p-3 bg-slate-900 text-white rounded-lg shadow-xl w-64 text-xs font-medium leading-relaxed transition-opacity">
                                                        {log.aiAction}
                                                    </div>
                                                    <Info size={14} className="text-slate-300 shrink-0" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400 font-medium text-xs tabular-nums">{log.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                                        <th className="px-6 py-4">Status & Alert</th>
                                        <th className="px-6 py-4">Advertiser</th>
                                        <th className="px-6 py-4">Creator</th>
                                        <th className="px-6 py-4">Elapsed Hours</th>
                                        <th className="px-6 py-4 text-right">Offer Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {ongoingOffers.map((offer) => {
                                        let rowStyle = "hover:bg-indigo-50/50 transition cursor-pointer";
                                        const isExpanded = expandedOfferId === offer.id;
                                        if (offer.alertLevel === 'CRITICAL') {
                                            rowStyle = "bg-red-50 hover:bg-red-100/50 transition border-l-4 border-l-red-500 cursor-pointer";
                                        } else if (offer.alertLevel === 'WARNING') {
                                            rowStyle = "bg-amber-50 hover:bg-amber-100/50 transition border-l-4 border-l-amber-500 cursor-pointer";
                                        }

                                        // Mock status check
                                        const needsAlternative = offer.alertLevel === 'CRITICAL' || offer.status === 'needs_alternative';

                                        return (
                                            <React.Fragment key={offer.id}>
                                                <tr
                                                    onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                                                    className={`${rowStyle} ${isExpanded ? 'bg-indigo-50 border-b-0' : ''}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-bold text-xs">
                                                                {offer.status === 'SUGGESTING_ALTERNATIVES' ? '代替提案中' : 'オファー中'}
                                                            </span>
                                                            {offer.alertLevel === 'CRITICAL' && <span className="text-[10px] text-red-600 font-bold px-2 py-0.5 bg-red-100 rounded-full w-fit">48h超過（自動提案済）</span>}
                                                            {offer.alertLevel === 'WARNING' && <span className="text-[10px] text-amber-600 font-bold px-2 py-0.5 bg-amber-100 rounded-full w-fit">36h経過（要確認）</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-700">{offer.advertiser}</td>
                                                    <td className="px-6 py-4 font-bold text-blue-600">{offer.creator}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`font-black ${offer.diffHours >= 48 ? 'text-red-600' : offer.diffHours >= 36 ? 'text-amber-600' : 'text-slate-600'}`}>
                                                            {Math.floor(offer.diffHours)}h
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <span className="text-slate-400 font-medium text-xs tabular-nums">
                                                                {new Date(offer.createdAt).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            <ChevronDown className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} size={16} />
                                                        </div>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan={5} className="px-0 py-0 border-t-0">
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                className="overflow-hidden bg-indigo-50/30"
                                                            >
                                                                <div className="p-8 border-t border-indigo-100 shadow-inner">
                                                                    <div className="flex items-center justify-between mb-6">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="bg-indigo-600 p-1.5 rounded-lg text-white">
                                                                                <Sparkles size={16} />
                                                                            </span>
                                                                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                                                                                AI Alternative Suggestions
                                                                            </h4>
                                                                        </div>
                                                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                                                            Based on Vibe & Genre Match
                                                                        </span>
                                                                    </div>

                                                                    <div className="grid grid-cols-5 gap-4">
                                                                        {getAlternatives(offer).map((alt) => (
                                                                            <motion.div
                                                                                key={alt.id}
                                                                                whileHover={{ y: -4 }}
                                                                                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group transition-all hover:shadow-xl hover:border-indigo-200"
                                                                            >
                                                                                <div className="relative mb-3">
                                                                                    <img
                                                                                        src={alt.thumbnail_url || 'https://via.placeholder.com/150'}
                                                                                        className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-50 shadow-sm transition-transform group-hover:scale-105"
                                                                                    />
                                                                                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full border-2 border-white shadow-sm">
                                                                                        <Check size={8} />
                                                                                    </div>
                                                                                </div>
                                                                                <p className="text-xs font-black text-slate-900 truncate w-full mb-0.5">{alt.name}</p>
                                                                                <p className="text-[10px] font-bold text-slate-400 mb-4">{alt.followersStr} followers</p>

                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handlePushAlternative(offer.id, alt.id);
                                                                                    }}
                                                                                    className="w-full bg-slate-900 text-white text-[10px] font-black py-2 rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
                                                                                >
                                                                                    提案する
                                                                                </button>
                                                                            </motion.div>
                                                                        ))}
                                                                    </div>

                                                                    <div className="mt-8 flex justify-center border-t border-indigo-100 pt-6">
                                                                        <p className="text-[10px] text-slate-400 font-medium italic bg-white px-4 py-1 rounded-full border border-slate-50 italic">
                                                                            AI suggests these creators to ensure the advertiser's campaign continues without further delay.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

        </>
    );
}

export default function AdminDashboardWithSuspense() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Loader2 size={40} className="animate-spin text-yellow-500 mb-4" />
                <p className="text-slate-500 font-bold ml-4">Loading Dashboard...</p>
            </div>
        }>
            <AdminDashboard />
        </Suspense>
    );
}