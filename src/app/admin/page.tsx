"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Search, Filter, MoreHorizontal, MapPin, ChevronLeft, ChevronRight, Loader2, Save, Check, PlayCircle, Copy } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ReviewStatusSelect from "@/app/admin/ReviewStatusSelect";
import { getAdminStats, getLostAssets, getSuccessLogs } from '@/app/actions/admin';
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
    const [logTab, setLogTab] = useState<'success' | 'lost'>('success');

    // 統計データ管理
    const [stats, setStats] = useState<any>(null);
    const [lostAssets, setLostAssets] = useState<any[]>([]);
    const [successLogs, setSuccessLogs] = useState<any[]>([]);

    // 編集保存の演出用
    const [isSaving, setIsSaving] = useState(false);

    // ページネーション & フィルタリング
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const [filterTier, setFilterTier] = useState('ALL');

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

                // クリエイター一覧
                const { data, error } = await supabase
                    .from('creators')
                    .select('*')
                    .order('followers', { ascending: false });

                if (error) throw error;

                // 取得したデータをUI用に整形
                const formattedData = (data || []).map((item, index) => ({
                    id: item.id,
                    name: item.name || item.tiktok_handle || 'Unknown',
                    tier: item.tier || '-',
                    genre: item.genre || [],
                    ethnicity: item.ethnicity || '-',
                    followers: (item.followers || 0).toLocaleString(),
                    tiktokUrl: item.tiktok_url || '',
                    vibeHint: item.vibe_tags?.[0] || ['Cinematic', 'Urban', 'Cafe', 'Retro'][index % 4],
                    vibeCluster: item.vibe_tags || [],
                    bestVideoUrl: item.portfolio_video_urls?.[0] || item.scouted_video_url || '',
                    imgColor: getColorByIndex(index),
                    status: 'Approved',
                    is_public: item.is_onboarded || false
                }));
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
    const filteredData = filterTier === 'ALL'
        ? creators
        : creators.filter(c => c.tier === filterTier);

    // ダミーログデータ
    const mockLogs = [
        { id: '1', advertiser: '抹茶カフェ 翡翠', creator: 'Sarah Jenkins', matchScore: 98, vibes: ['#和モダン', '#自然光'], date: '2024-03-02 14:20' },
        { id: '2', advertiser: 'SUSHI BAR TOKYO', creator: 'Liam Wong', matchScore: 92, vibes: ['#Urban', '#Luxury'], date: '2024-03-02 12:45' },
        { id: '3', advertiser: 'Retro Ramen', creator: 'Elena R.', matchScore: 89, vibes: ['#Retro', '#HiddenGem'], date: '2024-03-01 18:30' },
        { id: '4', advertiser: 'Harajuku Desserts', creator: 'Mika K.', matchScore: 95, vibes: ['#Kawaii', '#Photogenic'], date: '2024-03-01 15:10' },
    ];

    // ページネーション処理
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            {/* Saving Indicator */}
            <div className={`absolute top-20 right-8 bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-opacity duration-300 z-50 ${isSaving ? 'opacity-100' : 'opacity-0'}`}>
                {isSaving ? <><Save size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> Saved</>}
            </div>

            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    {activeTab === 'creators' ? 'Creator Database' : 'Matching Analysis Logs'}
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                        {activeTab === 'creators' ? creators.length : (logTab === 'success' ? successLogs.length : lostAssets.length)} Total
                    </span>
                </h1>
                <div className="flex gap-4">
                    <button className="p-2 text-slate-400 hover:text-slate-600"><Search size={20} /></button>
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">AD</div>
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
                                            <th className="px-6 py-4 font-bold w-24 text-center">Video</th>
                                            <th className="px-6 py-4 font-bold w-32">Tier</th>
                                            <th className="px-6 py-4 font-bold w-45">Category</th>
                                            <th className="px-6 py-4 font-bold w-40">VIBE Cluster</th>
                                            <th className="px-6 py-4 font-bold text-center">Status (Visibility)</th>
                                            <th className="px-6 py-4 font-bold text-right">Review Status</th>
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

                                                {/* Video Asset Indicator */}
                                                <td className="px-6 py-4 text-center">
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
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={creator.tier}
                                                        onChange={(e) => handleUpdate(creator.id, 'tier', e.target.value)}
                                                        className={`w-full px-2 py-1.5 rounded border text-xs font-bold cursor-pointer focus:outline-none
                                    ${creator.tier === 'S' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                                                creator.tier === 'A' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                                                    'bg-white border-slate-200 text-slate-600'}`}
                                                    >
                                                        <option value="S">★ S</option>
                                                        <option value="A">A</option>
                                                        <option value="B">B</option>
                                                        <option value="-">-</option>
                                                    </select>
                                                </td>

                                                {/* Category (Editable) */}
                                                <td className="px-6 py-4">
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
                                                <td className="px-6 py-4">
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
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <ToggleSwitch
                                                            isOn={creator.is_public}
                                                            onToggle={() => handleUpdate(creator.id, 'is_public', !creator.is_public)}
                                                        />
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border min-w-[50px] text-center ${creator.is_public
                                                            ? "bg-green-100 text-green-700 border-green-200"
                                                            : "bg-stone-100 text-stone-500 border-stone-200"
                                                            }`}>
                                                            {creator.is_public ? "Public" : "Hidden"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status (Approved) */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <ReviewStatusSelect
                                                        creatorId={creator.id}
                                                        initialStatus={creator.review_status}
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
                                Lost / Unmatched
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
                        ) : (
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