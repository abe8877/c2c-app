"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Search, Filter, MoreHorizontal, MapPin, ChevronLeft, ChevronRight, Loader2, Save, Check, PlayCircle, Copy, ImageIcon, CheckCircle2, Clock, Plane, ChevronDown, Sparkles, AlertTriangle, Users, XCircle, FileText, CheckSquare, Settings, Info, MessageCircle, Send, Plus, X, DollarSign, Trash2, UploadCloud, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ReviewStatusSelect from "@/app/admin/ReviewStatusSelect";
import { getAdminStats, getLostAssets, getSuccessLogs, getOngoingOffers, updateAssetTimestamp, sendAdminProxyMessage, updateCreatorField, toggleCreatorArrayField, fetchAllCreators, uploadDeliveryVideo } from '@/app/actions/admin';
import { triggerN8nWebhook } from '@/app/actions/creator';

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

// --- Admin Timeline Button Components ---
const TimelineButton = ({ label, assetId, field, currentValue, currentStatus, onUpdate, currentVideoUrl = "", currentPostUrl = "" }: { label: string, assetId: string, field: string, currentValue: string | null, currentStatus?: string, onUpdate?: () => void, currentVideoUrl?: string, currentPostUrl?: string }) => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(currentValue);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showFinalModal, setShowFinalModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [videoUrl, setVideoUrl] = useState(currentVideoUrl || "");
    const [postUrl, setPostUrl] = useState(currentPostUrl || "");
    const [localStatus, setLocalStatus] = useState(currentStatus || "");

    useEffect(() => {
        setValue(currentValue);
        if (currentStatus) setLocalStatus(currentStatus);
        if (currentVideoUrl) setVideoUrl(currentVideoUrl);
        if (currentPostUrl) setPostUrl(currentPostUrl);
    }, [currentValue, currentStatus, currentVideoUrl, currentPostUrl]);

    const handleUpdate = async (approved: boolean = true) => {
        if (loading) return;
        // 不承認（approved=false）で理由が空の場合は中断
        if (!approved && !rejectionReason.trim()) {
            alert("不承認の理由を入力してください。");
            return;
        }

        setLoading(true);
        const now = new Date().toISOString();

        try {
            if (field === 'reward_deposit') {
                await updateAssetTimestamp(assetId, 'reward_deposit', approved ? now : null);
                if (postUrl) {
                    await updateAssetTimestamp(assetId, 'reward_paymentlink', null, { paymentLink: postUrl });
                }
            } else {
                await updateAssetTimestamp(
                    assetId,
                    field as any,
                    field === 'approved_at' && !approved ? null : now,
                    { rejectionReason, videoUrl, postUrl }
                );
            }
        } catch (e) {
            console.error(e);
            alert("更新に失敗しました");
            setLoading(false);
            return;
        }

        setValue(field === 'approved_at' && !approved ? null : now);
        if (field === 'approved_at') {
            setLocalStatus(approved ? 'WORKING' : 'DECLINED');
        } else if (field === 'delivered_at') {
            setLocalStatus('DELIVERED');
        } else if (field === 'final_status' || field === 'confirmed_at') {
            setLocalStatus('FINALIZED');
        } else if (field === 'reward_deposit') {
            if (approved) setLocalStatus('WORKING');
        }
        setLoading(false);
        setShowApproveModal(false);
        setShowDeliveryModal(false);
        setShowFinalModal(false);
        if (onUpdate) onUpdate();
    };

    const handleReset = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("タイムスタンプをリセットしますか？")) return;
        setLoading(true);
        await updateAssetTimestamp(assetId, field as any, null);
        setValue(null);
        setLoading(false);
        if (onUpdate) onUpdate();
    };

    if (field === 'approved_at') {
        const isDeclined = localStatus === 'DECLINED';
        return (
            <>
                <div
                    onClick={() => !loading && setShowApproveModal(true)}
                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-[11px] transition-all group/btn cursor-pointer ${isDeclined
                        ? "bg-red-50 border-red-200 text-red-700"
                        : (value ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 shadow-sm")}`}
                >
                    <div className="flex flex-col items-start">
                        <span className="opacity-60">{isDeclined ? "オファー不承認" : label}</span>
                        {value && !isDeclined && <span className="text-[9px] tabular-nums">{new Date(value).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                        {isDeclined ? <AlertTriangle size={14} className="text-red-500" /> : (value ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Plus size={14} className="opacity-40 group-hover/btn:opacity-100" />)}
                        {(value || isDeclined) && (
                            <button
                                onClick={handleReset}
                                className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                                title="リセット"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {showApproveModal && (
                        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative">
                                <button onClick={() => setShowApproveModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>

                                <div className="text-center space-y-2 mb-8">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Offer Approval Management</h4>
                                    <p className="text-[10px] font-bold text-slate-400">オファーの承認状態を選択してください</p>
                                </div>

                                <div className="space-y-6">
                                    <button onClick={() => handleUpdate(true)} className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[12px] font-black hover:bg-emerald-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                        <CheckCircle2 size={18} /> APPROVE (承認)
                                    </button>

                                    <div className="pt-6 border-t border-slate-100 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">不承認の理由 (必須)</label>
                                            <textarea
                                                placeholder="例: オファー金額が不十分、日程が合わない 等"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="w-full h-28 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-red-500 text-slate-600 resize-none transition-all focus:bg-white"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleUpdate(false)}
                                            disabled={!rejectionReason.trim()}
                                            className="w-full py-4 bg-slate-100 text-slate-400 disabled:opacity-50 enabled:bg-red-50 enabled:text-red-500 enabled:hover:bg-red-100 rounded-2xl text-[12px] font-black transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={18} /> OK (不承認を確定)
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    if (field === 'delivered_at') {
        return (
            <>
                <div
                    onClick={() => !loading && setShowDeliveryModal(true)}
                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-[11px] transition-all group/btn cursor-pointer ${value
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 shadow-sm"}`}
                >
                    <div className="flex flex-col items-start">
                        <span className="opacity-60">{label}</span>
                        {value && <span className="text-[9px] tabular-nums">{new Date(value).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                        {value ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Plus size={14} className="opacity-40 group-hover/btn:opacity-100" />}
                        {value && (
                            <button
                                onClick={handleReset}
                                className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                                title="リセット"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {showDeliveryModal && (
                        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative">
                                <button onClick={() => setShowDeliveryModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>

                                <div className="text-center space-y-2 mb-8">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">動画データを納品して承認を依頼する</h4>
                                </div>

                                <div className="space-y-6">
                                    {/* Storage Upload Area */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">動画ファイルをアップロード</label>
                                        <div
                                            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-400 hover:bg-indigo-50 border-slate-200 bg-slate-50 mt-2'}`}
                                            onClick={() => document.getElementById(`video-upload-${assetId}`)?.click()}
                                        >
                                            {loading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="animate-spin text-indigo-500" size={24} />
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">Uploading...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <UploadCloud size={24} className="text-slate-400 mb-2" />
                                                    <p className="text-[10px] font-bold text-slate-600">動画をドラッグ＆ドロップ</p>
                                                    <p className="text-[8px] font-medium text-slate-400 mt-1">またはクリックしてファイルを選択</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            id={`video-upload-${assetId}`}
                                            className="hidden"
                                            accept="video/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                // 50MB size limit check
                                                if (file.size > 50 * 1024 * 1024) {
                                                    alert("ファイルサイズが大きすぎます (最大50MB)。画質を落とすか、別のファイルを選択してください。");
                                                    return;
                                                }

                                                setLoading(true);
                                                try {
                                                    const fileExt = file.name.split('.').pop() || 'mp4';

                                                    // ファイルをBase64に変換してServer Actionに送信
                                                    const reader = new FileReader();
                                                    reader.onload = async () => {
                                                        try {
                                                            const base64 = (reader.result as string).split(',')[1];
                                                            const res = await uploadDeliveryVideo(assetId, base64, fileExt);
                                                            if (res.success && res.data?.publicUrl) {
                                                                setVideoUrl(res.data.publicUrl);
                                                                alert("動画をアップロードしました。URLが自動入力されました。");
                                                            } else {
                                                                alert("アップロードに失敗しました: " + (res.error || 'Unknown error'));
                                                            }
                                                        } catch (err: any) {
                                                            console.error(err);
                                                            alert("アップロードに失敗しました: " + err.message);
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                    return; // setLoading(false) is handled in the reader.onload callback
                                                } catch (err: any) {
                                                    console.error(err);
                                                    alert("アップロードに失敗しました: " + err.message);
                                                    setLoading(false);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-slate-100"></div>
                                        </div>
                                        <div className="relative flex justify-center text-[8px] uppercase font-bold">
                                            <span className="bg-white px-2 text-slate-400 tracking-widest">OR (URL入力)</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1">動画データURL </label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 transition-all focus:bg-white"
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleUpdate(true)}
                                        disabled={!videoUrl.trim() || loading}
                                        className="w-full py-4 bg-indigo-500 text-white disabled:opacity-50 enabled:hover:bg-indigo-600 rounded-2xl text-[12px] font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} /> 納品完了として報告
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    if (field === 'reward_deposit') {
        return (
            <>
                <div
                    onClick={() => !loading && setShowApproveModal(true)}
                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-[11px] transition-all group/btn cursor-pointer ${value ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 shadow-sm"}`}
                >
                    <div className="flex flex-col items-start">
                        <span className="opacity-60">{label}</span>
                        {value && <span className="text-[9px] tabular-nums">Deposited</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                        {value ? <CheckCircle2 size={14} className="text-emerald-500" /> : <DollarSign size={14} className="opacity-40 group-hover/btn:opacity-100" />}
                        {value && (
                            <button
                                onClick={handleReset}
                                className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                                title="リセット"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {showApproveModal && (
                        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative">
                                <button onClick={() => setShowApproveModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>

                                <div className="text-center space-y-2 mb-8">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">報酬デポジット管理</h4>
                                    <p className="text-[10px] font-bold text-slate-400">アンバサダーが動画制作を開始する前に、必ず報酬のデポジット（預り金）の支払いを確認して下さい。</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Link (Stripe)</p>
                                        <input
                                            type="text"
                                            placeholder="https://buy.stripe.com/..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                                            defaultValue={postUrl}
                                            onChange={(e) => setPostUrl(e.target.value)} // Reusing postUrl state for simplicity in internal logic
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-4">
                                        <button
                                            onClick={() => handleUpdate(true)}
                                            className="py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                                        >
                                            入金済みとして反映
                                        </button>
                                        <button
                                            onClick={async () => {
                                                setLoading(true);
                                                await updateAssetTimestamp(assetId, 'reward_paymentlink', null, { paymentLink: postUrl });
                                                alert("Payment Linkを保存しました");
                                                setLoading(false);
                                                if (onUpdate) onUpdate();
                                            }}
                                            className="py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                                        >
                                            リンクのみ保存
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    if (field === 'confirmed_at') {
        const title = "投稿済みURLの共有";
        const subtitle = "依頼を完了するために、実際に投稿されたSNSのURLを添付してください";
        return (
            <>
                <div
                    onClick={() => !loading && setShowFinalModal(true)}
                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-[11px] transition-all group/btn cursor-pointer ${value
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 shadow-sm"}`}
                >
                    <div className="flex flex-col items-start">
                        <span className="opacity-90">{label}</span>
                        {value && <span className="text-[9px] opacity-60">完了済: {new Date(value).toLocaleString('ja-JP')}</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                        {value ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Send size={14} className="opacity-40 group-hover/btn:opacity-100" />}
                        {value && (
                            <button
                                onClick={handleReset}
                                className="p-1 hover:bg-slate-700 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                                title="リセット"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {showFinalModal && (
                        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative">
                                <button onClick={() => setShowFinalModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>

                                <div className="text-center space-y-2 mb-8">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">{title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400">{subtitle}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">投稿済みURL (Instagram/TikTok等) 必須</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={postUrl}
                                            onChange={(e) => setPostUrl(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-slate-900 text-slate-600 transition-all focus:bg-white"
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleUpdate()}
                                        disabled={!postUrl.trim() || loading}
                                        className="w-full py-4 bg-green-500 text-white disabled:opacity-50 enabled:hover:bg-green-600 rounded-2xl text-[12px] font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} /> 共有して依頼を完了とする
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <div
            onClick={() => !loading && handleUpdate()}
            className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-[11px] transition-all group/btn cursor-pointer ${value
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 shadow-sm"}`}
        >
            <div className="flex flex-col items-start">
                <span className="opacity-60">{label}</span>
                {value && <span className="text-[9px] tabular-nums">{new Date(value).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>}
            </div>
            <div className="flex items-center gap-1.5">
                {value ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                ) : (
                    <Plus size={14} className="opacity-40 group-hover/btn:opacity-100" />
                )}
                {value && (
                    <button
                        onClick={handleReset}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                        title="リセット"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>
        </div>
    );
};

// --- Admin Proxy Chat Modal ---
const AdminChatModal = ({ assetId, advertiserName, creatorName, hasUnread = false, onOpen }: { assetId: string, advertiserName: string, creatorName: string, hasUnread?: boolean, onOpen?: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [senderType, setSenderType] = useState<'creator' | 'shop'>('creator');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const fetchMessagesData = async () => {
        const { fetchMessages } = await import('@/app/actions/chat');
        const res = await fetchMessages(assetId);
        if (res.success && res.data) {
            setMessages(res.data);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMessagesData();
            const channel = supabase
                .channel(`asset-chat-${assetId}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `asset_id=eq.${assetId}` }, (payload) => {
                    setMessages(prev => {
                        if (prev.find(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                })
                .subscribe();
            return () => { supabase.removeChannel(channel); };
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        setLoading(true);
        const res = await sendAdminProxyMessage({ assetId, content: input, senderType });
        if (res.success) {
            setInput("");
            fetchMessagesData();
        }
        setLoading(false);
    };

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true);
                    if (onOpen) onOpen();
                }}
                className="relative flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-indigo-600 transition-all shadow-md active:scale-95"
            >
                <MessageCircle size={14} /> View Chat
                {hasUnread && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-md" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">チャットログ</h3>
                                    <p className="text-[10px] font-bold text-slate-400">{advertiserName} × {creatorName}</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 text-slate-400"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.sender_type === 'shop' ? 'items-start' : 'items-end'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium shadow-sm border ${msg.sender_type === 'shop' ? 'bg-white text-slate-800 border-slate-100 rounded-tl-none' : 'bg-indigo-500 text-white border-transparent rounded-tr-none'}`}>
                                            {msg.message}
                                        </div>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{msg.sender_type === 'shop' ? 'ADVERTISER' : 'CREATOR'}</span>
                                            {msg.is_admin_action && msg.sender_type === 'shop' && <span className="text-[8px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">BY ADMIN</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                    <button onClick={() => setSenderType('creator')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${senderType === 'creator' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Reply as Creator</button>
                                    <button onClick={() => setSenderType('shop')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${senderType === 'shop' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Reply as ADMIN</button>
                                </div>
                                <div className="relative">
                                    <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={`${senderType === 'creator' ? creatorName : '運営'} として送信...`} className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none" />
                                    <button onClick={handleSend} disabled={loading || !input.trim()} className="absolute bottom-3 right-3 bg-indigo-500 text-white p-2 rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-lg active:scale-95"><Send size={16} /></button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

function AdminDashboard() {
    const supabase = createClient(); // ★ Supabaseインスタンス化

    const [creators, setCreators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'logs' ? 'logs' : 'creators';

    // タブ管理
    const [activeTab, setActiveTab] = useState<'creators' | 'logs'>(initialTab);
    const [logTab, setLogTab] = useState<'success' | 'lost' | 'ongoing'>('ongoing');

    // 統計データ管理
    const [stats, setStats] = useState<any>(null);
    const [lostAssets, setLostAssets] = useState<any[]>([]);
    const [successLogs, setSuccessLogs] = useState<any[]>([]);
    const [ongoingOffers, setOngoingOffers] = useState<any[]>([]);

    // 452:
    const [unreadAssets, setUnreadAssets] = useState<Set<string>>(new Set());

    const markAsRead = (assetId: string) => {
        setUnreadAssets(prev => {
            const next = new Set(prev);
            next.delete(assetId);
            return next;
        });
    };

    // URLのパラメータ変更を検知してタブを同期
    useEffect(() => {
        const tab = searchParams.get('tab') === 'logs' ? 'logs' : 'creators';
        setActiveTab(tab);
    }, [searchParams]);

    // チャット通知デモ用
    useEffect(() => {
        if (ongoingOffers.length > 0) {
            // ステータスが完了に近い、または修正依頼があるものをランダムに未読化（デモ）
            const demoUnreads = ongoingOffers
                .filter(o => o.status === 'COMPLETED' || (o.offerDetails?.timeline?.revision_count || 0) > 0)
                .slice(0, 1)
                .map(o => o.id);
            setUnreadAssets(new Set(demoUnreads));
        }
    }, [ongoingOffers.length]);

    // 編集保存の演出用
    const [isSaving, setIsSaving] = useState(false);

    // ページネーション & フィルタリング
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const [filterTier, setFilterTier] = useState<string>('ALL');
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [filterVibe, setFilterVibe] = useState<string>('ALL');
    const [filterDisplayStatus, setFilterDisplayStatus] = useState<string>('ALL');
    const [filterReviewStatus, setFilterReviewStatus] = useState<string>('ALL');
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

    // ★ 1. データ取得処理 (Server Action経由で取得)
    const fetchData = async () => {
        try {
            setLoading(true);

            // ユーザー情報の取得（認証確認はクライアント側で許容）
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // Server Action経由で全クリエイターを取得
            const creatorsRes = await fetchAllCreators();
            if (!creatorsRes.success) throw new Error(creatorsRes.error || 'Failed to fetch creators');
            const allCreators = creatorsRes.data?.creators || [];

            console.log(`Fetched total ${allCreators.length} creators.`);

            // 取得したデータをUI用に整形
            const formattedData = allCreators.map((item: any, index: number) => {
                const isSystemHidden = !item.is_onboarded && item.was_public;

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
                    is_public: item.is_public || false,
                    is_system_hidden: isSystemHidden,
                    is_ai_recommended: !!item.is_ai_recommended,
                    thumbnail_url: item.thumbnail_url || item.avatar_url || null
                };
            });
            setCreators(formattedData);

            // 統計情報 (Server Action)
            const adminStats = await getAdminStats();
            if (adminStats.success) setStats(adminStats.data);

            // Success案件 (Server Action)
            const success = await getSuccessLogs();
            if (success.success) setSuccessLogs(success.data);

            // Lost案件 (Server Action)
            const lost = await getLostAssets();
            if (lost.success) setLostAssets(lost.data);

            // Ongoing案件 (Server Action)
            const ongoing = await getOngoingOffers();
            if (ongoing.success) setOngoingOffers(ongoing.data);

            setLoading(false);
        } catch (error: any) {
            console.error('Data Fetch Error:', error);
            setErrorMsg("データの読み込みに失敗しました。");
            setLoading(false);
        }
    };

    useEffect(() => {
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
            const res = await updateCreatorField(id, field, value);
            if (!res.success) throw new Error(res.error || 'Unknown error');

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

        // Optimistic UI
        setCreators(prev => prev.map(c => c.id === id ? { ...c, [field]: newArray } : c));

        try {
            const res = await toggleCreatorArrayField(id, field, currentArray, value);
            if (!res.success) throw new Error(res.error || 'Unknown error');
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

        const matchDisplayStatus = filterDisplayStatus === 'ALL' ||
            (filterDisplayStatus === 'public' ? c.is_public :
                filterDisplayStatus === 'hidden' ? (!c.is_public && !c.is_system_hidden) :
                    filterDisplayStatus === 'system_hidden' ? c.is_system_hidden :
                        filterDisplayStatus === 'ai_recommended' ? (c.review_status === 'ai_recommended' || c.is_ai_recommended) :
                            false);

        const matchReviewStatus = filterReviewStatus === 'ALL' || c.review_status === filterReviewStatus;

        const matchSearch = !searchQuery ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tiktokUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.ethnicity && c.ethnicity.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (c.genre && c.genre.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase())));

        return matchTier && matchCategory && matchVibe && matchDisplayStatus && matchReviewStatus && matchSearch;
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

    const getAlternatives = (offer: any, creators: Array<any>) => {
        const targetCreator = offer.creator || offer.target_creator;
        if (!targetCreator || !creators || creators.length === 0) {
            return new Array();
        }

        const parseFollowers = (val: any) => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            let strVal = val.toString().toUpperCase().replace(/,/g, '').trim();
            let multiplier = 1;
            if (strVal.endsWith('K')) {
                multiplier = 1000;
                strVal = strVal.slice(0, -1);
            } else if (strVal.endsWith('M')) {
                multiplier = 1000000;
                strVal = strVal.slice(0, -1);
            }
            const num = parseFloat(strVal);
            return isNaN(num) ? 0 : num * multiplier;
        };

        const targetFollowers = parseFollowers(targetCreator.followers);

        let targetVibes = new Array<string>();
        if (targetCreator.vibe_tags && Array.isArray(targetCreator.vibe_tags)) {
            targetVibes = targetCreator.vibe_tags.map((t: string) => t.toLowerCase());
        }

        // 1. 候補の抽出と厳格なホワイトリスト・フィルタリング
        let validCreators = creators.filter((c: any) => {
            // 本人は除外
            if (c.id === targetCreator.id) return false;

            // 【最重要】公開条件の完全一致（非公開クリエイターを絶対に許容しない）
            const isPublic = c.is_public === true || c.is_public === 'true';
            const reviewStatus = (c.review_status || '').toString().toLowerCase();
            if (!isPublic || reviewStatus !== 'approved') {
                return false;
            }

            // 【テストデータ排除】フォロワー10,000人未満は一般人/ゴミデータとして足切り
            const cFollowers = parseFollowers(c.followers);
            if (cFollowers < 10000) {
                return false;
            }

            return true;
        });

        // 2. スコアリング（コスパ比率の適正化）
        const alternatives = validCreators.map((c: any) => {
            let simScore = 65;
            const cFollowers = parseFollowers(c.followers);

            let cVibes = new Array<string>();
            if (c.vibe_tags && Array.isArray(c.vibe_tags)) {
                cVibes = c.vibe_tags.map((t: string) => t.toLowerCase());
            }

            const commonVibes = targetVibes.filter((tag: string) => cVibes.includes(tag));
            simScore += commonVibes.length * 8;

            if (c.audience === targetCreator.audience) simScore += 5;

            // コスパ判定（ミスマッチの防止）
            if (targetFollowers > 0) {
                const ratio = cFollowers / targetFollowers;
                if (ratio < 0.1) {
                    simScore -= 10; // ターゲットの10%未満は規模が違いすぎるため減点
                } else if (ratio < 0.5) {
                    simScore += 15; // 10%〜50% (超高コスパ：大加点)
                } else if (ratio < 0.8) {
                    simScore += 10; // 50%〜80% (高コスパ：中加点)
                } else if (ratio <= 1.2) {
                    simScore += 5;  // 80%〜120% (同規模：小加点)
                } else {
                    simScore -= 20; // 120%超 (予算オーバーリスク：大減点)
                }
            }

            if (c.in_japan) simScore += 8;
            else if (c.coming_soon) simScore += 4;

            // シードベースの揺らぎ
            const seedString = String(c.id) + String(targetCreator.id);
            let hash = 0;
            for (let i = 0; i < seedString.length; i++) {
                hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
            }
            const jitter = (Math.abs(hash) % 7) - 3;
            simScore += jitter;

            simScore = Math.max(50, Math.min(simScore, 98));

            return {
                ...c,
                similarityScore: Math.floor(simScore),
                parsedFollowers: cFollowers
            };
        });

        // 3. 最終ソートと抽出
        const sortedAlternatives = alternatives.sort((a: any, b: any) => {
            if (b.similarityScore !== a.similarityScore) {
                return b.similarityScore - a.similarityScore; // 第一条件: マッチ率降順
            }
            return a.parsedFollowers - b.parsedFollowers;     // 第二条件: 同点ならフォロワー数昇順（コスパ順）
        });

        return sortedAlternatives.slice(0, 5);
    };

    const handlePushAlternative = async (offerId: string, altId: string) => {
        setIsActionLoading(true);
        try {
            const { proposeAlternativeAmbassador } = await import('@/app/actions/admin');
            const res = await proposeAlternativeAmbassador(offerId, altId);
            if (res.success) {
                alert('広告主へ代替案を提案しました。');
                setExpandedOfferId(null);
                fetchData();
            } else {
                alert('提案に失敗しました: ' + (res.error || 'Unknown error'));
            }
        } catch (error) {
            console.error("Alternative propose error:", error);
            alert('通信エラーが発生しました。');
        }
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
                <div className="fixed inset-0 bg-white/20 backdrop-blur-[2px] z-[200] flex items-center justify-center pointer-events-auto cursor-wait select-none transition-all duration-300">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 size={64} className="animate-spin text-slate-900 drop-shadow-lg" />
                        <p className="text-slate-900 font-black text-xs uppercase tracking-[0.3em] bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-white/20">Processing</p>
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

                        <div className="flex gap-2">
                            {/* All Categories */}
                            <div className="relative">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                                    className="appearance-none pl-4 pr-10 py-2.5 rounded-xl text-[13px] font-bold border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-colors cursor-pointer outline-none shadow-sm min-w-[150px]"
                                >
                                    <option value="ALL">All Categories</option>
                                    <option value="FOOD">Food</option>
                                    <option value="BEAUTY">Beauty</option>
                                    <option value="TRAVEL">Travel</option>
                                    <option value="EXPERIENCE">Experience</option>
                                    <option value="LIFESTYLE">Lifestyle</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* All Vibes */}
                            <div className="relative">
                                <select
                                    value={filterVibe}
                                    onChange={(e) => { setFilterVibe(e.target.value); setCurrentPage(1); }}
                                    className="appearance-none pl-4 pr-10 py-2.5 rounded-xl text-[13px] font-bold border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-colors cursor-pointer outline-none shadow-sm min-w-[120px]"
                                >
                                    <option value="ALL">All Vibes</option>
                                    <option value="Cinematic">#Cinematic</option>
                                    <option value="Luxury">#Luxury</option>
                                    <option value="Street">#Street</option>
                                    <option value="Kawaii">#Kawaii</option>
                                    <option value="Vlog">#Vlog</option>
                                    <option value="Traditional">#Traditional</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* All Status */}
                            <div className="relative">
                                <select
                                    value={filterDisplayStatus}
                                    onChange={(e) => { setFilterDisplayStatus(e.target.value); setCurrentPage(1); }}
                                    className="appearance-none pl-4 pr-10 py-2.5 rounded-xl text-[13px] font-bold border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-colors cursor-pointer outline-none shadow-sm min-w-[120px]"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="public">☑ Public</option>
                                    <option value="hidden">☒ Hidden</option>
                                    <option value="system_hidden">🤖 System Hidden</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* All Review */}
                            <div className="relative">
                                <select
                                    value={filterReviewStatus}
                                    onChange={(e) => { setFilterReviewStatus(e.target.value); setCurrentPage(1); }}
                                    className="appearance-none pl-4 pr-10 py-2.5 rounded-xl text-[13px] font-bold border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-colors cursor-pointer outline-none shadow-sm min-w-[130px]"
                                >
                                    <option value="ALL">All Review</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="approved">✓ Approved</option>
                                    <option value="rejected">✕ Rejected</option>
                                    <option value="ai_recommended">💎 AI Recommended</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
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
                                <div className="flex flex-col items-center justify-center h-full py-20 bg-transparent">
                                    <Loader2 size={40} className="animate-spin text-yellow-500 mb-4" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Database...</p>
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
                                                        {['FOOD', 'BEAUTY', 'TRAVEL', 'EXPERIENCE', 'LIFESTYLE'].map(g => {
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
                                                    <div className="flex items-center justify-center">
                                                        <select
                                                            value={creator.is_public ? 'public' : (creator.is_system_hidden ? 'system_hidden' : 'hidden')}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val === 'public') {
                                                                    if (window.confirm("このクリエイターを公開設定にしますか？")) {
                                                                        handleUpdate(creator.id, 'is_public', true);
                                                                    }
                                                                } else {
                                                                    handleUpdate(creator.id, 'is_public', false);
                                                                }
                                                            }}
                                                            className={`text-[10px] font-black px-3 py-1.5 rounded-full border shadow-sm outline-none cursor-pointer transition-all ${creator.is_public
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                : creator.is_system_hidden
                                                                    ? "bg-amber-50 text-amber-600 border-amber-200 ring-1 ring-amber-400/20"
                                                                    : "bg-stone-50 text-stone-400 border-stone-200"
                                                                }`}
                                                        >
                                                            <option value="public">☑ Public</option>
                                                            <option value="hidden">☒ Hidden</option>
                                                            <option value="system_hidden">🤖 System Hidden</option>
                                                        </select>
                                                    </div>
                                                </td>

                                                {/* Status (Approved) */}
                                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                                    <ReviewStatusSelect
                                                        creatorId={creator.id}
                                                        initialStatus={creator.review_status}
                                                        isAiRecommended={creator.is_ai_recommended}
                                                        onStatusChange={(newStatus: "pending" | "approved" | "rejected" | "ai_recommended") => handleUpdate(creator.id, 'review_status', newStatus)}
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
                                <p className="text-slate-500 text-xs font-bold uppercase mb-1">検索回数(今週)</p>
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
                                <p className="text-slate-500 text-xs font-bold uppercase mb-1">アクティブ案件</p>
                                <div className="text-3xl font-black">
                                    {stats?.activeShops || '42'}
                                    <span className="text-sm text-green-500 font-bold ml-2">↑ 5%</span>
                                </div>
                            </div>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex bg-slate-200 p-1 rounded-xl h-fit w-fit">
                            <button
                                onClick={() => setLogTab('ongoing')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${logTab === 'ongoing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                進行中
                            </button>
                            {/* 「成立・完了」タブは非表示に戻す */}
                            <button
                                onClick={() => setLogTab('lost')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${logTab === 'lost' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                アンマッチ
                            </button>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        {(logTab === 'ongoing' || logTab === 'lost') && (
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                                        <th className="px-6 py-4 w-48">Status & Alert</th>
                                        <th className="px-6 py-4">Advertiser</th>
                                        <th className="px-6 py-4">Ambassador</th>
                                        <th className="px-6 py-4">Elapsed Hours</th>
                                        <th className="px-6 py-4 text-right">Offer Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(logTab === 'ongoing' ? ongoingOffers : lostAssets).map((offer) => {
                                        let rowStyle = "hover:bg-indigo-50/50 transition cursor-pointer";
                                        const isExpanded = expandedOfferId === offer.id;
                                        if (offer.alertLevel === 'CRITICAL') {
                                            rowStyle = "bg-red-50 hover:bg-red-100/50 transition border-l-4 border-l-red-500 cursor-pointer";
                                        } else if (offer.alertLevel === 'WARNING') {
                                            rowStyle = "bg-amber-50 hover:bg-amber-100/50 transition border-l-4 border-l-amber-500 cursor-pointer";
                                        }
                                        const hasUnread = unreadAssets.has(offer.id);

                                        return (
                                            <React.Fragment key={offer.id}>
                                                <tr
                                                    onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                                                    className={`${rowStyle} ${isExpanded ? 'bg-indigo-50 border-b-0' : ''}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`font-black text-xs ${offer.status === 'DECLINED' ? 'text-red-500' : ''}`}>
                                                                {offer.status === 'DECLINED' ? 'アンマッチ'
                                                                    : offer.status === 'SUGGESTING_ALTERNATIVES' ? '代替提案中'
                                                                        : offer.status === 'APPROVED' || offer.status === 'WORKING' ? '承諾済み'
                                                                            : offer.status === 'DELIVERED' ? '納品済み'
                                                                                : offer.status === 'FINALIZED' ? '完了'
                                                                                    : 'オファー中'}
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
                                                            <div className="relative">
                                                                <span className="text-slate-400 font-medium text-xs tabular-nums text-center">
                                                                    {new Date(offer.createdAt).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                {hasUnread && (
                                                                    <span className="absolute -top-1.5 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                                                                )}
                                                            </div>
                                                            {(offer.status === 'DECLINED' || offer.status === 'EXPIRED') && (
                                                                <button
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        if (confirm("この案件を『交渉中』に戻しますか？")) {
                                                                            setLoading(true);
                                                                            await updateAssetTimestamp(offer.id, 'approved_at', null, { status: 'OFFERED' });
                                                                            setLoading(false);
                                                                            fetchData();
                                                                        }
                                                                    }}
                                                                    className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-indigo-100 flex items-center gap-1.5 shadow-sm active:scale-95"
                                                                    title="進行中に戻す"
                                                                >
                                                                    <RefreshCw size={10} /> 進行中に戻す
                                                                </button>
                                                            )}
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
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                                        {/* Offer Details (Chips UI) */}
                                                                        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden group/offer">
                                                                            {(() => {
                                                                                let details = offer.offerDetails || {};
                                                                                if (typeof details === 'string') {
                                                                                    try { details = JSON.parse(details); } catch (e) { details = {}; }
                                                                                }

                                                                                return (
                                                                                    <>
                                                                                        <div className="absolute top-0 right-0 p-3 opacity-100 transition-opacity flex gap-2">
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    const tagMap: { [key: string]: string } = {
                                                                                                        '看板メニュー': 'Signature Menu',
                                                                                                        '店内の雰囲気': 'Atmosphere',
                                                                                                        'スタッフの接客': 'Staff Service',
                                                                                                        '外観・看板': 'Exterior/Signage',
                                                                                                        'アクセス情報': 'Access Info',
                                                                                                        '利用シーン提案': 'Usage Scenes'
                                                                                                    };
                                                                                                    const translatedTags = details.selectedTags?.map((tag: string) => tagMap[tag] || tag);
                                                                                                    const text = `[Offer Conditions]\nPlan: ${details.plan === 'paid' ? 'Paid' : 'Barter'}\n${details.plan === 'paid' ? `Reward: ¥${Number(details.amount).toLocaleString()}\n` : ''}Preferred Time: ${details.shootingTime || 'Anytime'}\nStaff Appearance: ${details.staffAppearance || 'OK'}\nRules/NG: ${details.ngItems || 'None'}\nTags: ${translatedTags?.join(', ') || 'None'}\nMenu: ${offer.barterDetails || details.barterDetails || 'Standard Menu'}\nMessage: ${details.invitationMessage || 'N/A'}`;
                                                                                                    navigator.clipboard.writeText(text);
                                                                                                    alert('オファー内容をコピーしました');
                                                                                                }}
                                                                                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-xl transition-all shadow-sm border border-indigo-200"
                                                                                                title="DM用にコピー"
                                                                                            >
                                                                                                <Copy size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                        <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                                            <Info size={12} /> Offer Conditions
                                                                                        </h5>

                                                                                        {/* Offer Conditions Chips */}
                                                                                        <div className="flex flex-wrap gap-2">
                                                                                            <div className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2 shadow-sm">
                                                                                                <span className="text-[10px] font-black uppercase opacity-50">Plan</span>
                                                                                                <span className="text-xs font-black uppercase">{details.plan || "barter"}</span>
                                                                                            </div>
                                                                                            {details.plan === 'paid' && details.amount && (
                                                                                                <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-2 shadow-sm">
                                                                                                    <span className="text-[10px] font-black uppercase opacity-50">Reward</span>
                                                                                                    <span className="text-xs font-black">¥{Number(details.amount).toLocaleString()}</span>
                                                                                                </div>
                                                                                            )}
                                                                                            {details.shootingTime && (
                                                                                                <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2 shadow-sm">
                                                                                                    <span className="text-[10px] font-black uppercase opacity-50">Time</span>
                                                                                                    <span className="text-xs font-black">{details.shootingTime}</span>
                                                                                                </div>
                                                                                            )}
                                                                                            {details.staffAppearance && (
                                                                                                <div className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-100 flex items-center gap-2 shadow-sm">
                                                                                                    <span className="text-[10px] font-black uppercase opacity-50">Staff</span>
                                                                                                    <span className="text-xs font-black">{details.staffAppearance}</span>
                                                                                                </div>
                                                                                            )}
                                                                                            {details.selectedTags && details.selectedTags.length > 0 && (
                                                                                                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-2 shadow-sm">
                                                                                                    <span className="text-[10px] font-black uppercase opacity-50">Tags</span>
                                                                                                    <span className="text-[10px] font-black">{details.selectedTags.join(', ')}</span>
                                                                                                </div>
                                                                                            )}
                                                                                            {(!details || Object.keys(details).length === 0) && (
                                                                                                <span className="text-slate-300 text-[10px] font-bold italic">No structured details available</span>
                                                                                            )}
                                                                                        </div>

                                                                                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                                                                                            <div className="flex flex-col gap-1">
                                                                                                <p className="text-[10px] font-black text-slate-400 uppercase">提供内容</p>
                                                                                                <div className="text-xs font-bold text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 shadow-inner">
                                                                                                    {offer.barterDetails || details.barterDetails || "提供内容の記載なし"}
                                                                                                </div>
                                                                                            </div>
                                                                                            {details.invitationMessage && (
                                                                                                <div className="flex flex-col gap-1">
                                                                                                    <p className="text-[10px] font-black text-slate-400 uppercase">招待メッセージ</p>
                                                                                                    <div className="text-[10px] font-bold text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 italic">
                                                                                                        "{details.invitationMessage}"
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                            {details.ngItems && (
                                                                                                <p className="text-[10px] text-red-500 font-bold px-2 py-1 bg-red-50 rounded border border-red-100 w-fit">動画・撮影のNG事項: {details.ngItems}</p>
                                                                                            )}
                                                                                        </div>
                                                                                    </>
                                                                                );
                                                                            })()}
                                                                        </div>

                                                                        {/* Status Management & Chat */}
                                                                        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col">
                                                                            <div className="flex justify-between items-center mb-4">
                                                                                <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                                                    <Clock size={12} /> Timeline Management
                                                                                </h5>
                                                                                <div className="flex items-center gap-2">
                                                                                    <AdminChatModal assetId={offer.id} advertiserName={offer.advertiser} creatorName={offer.creator} />
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-3">
                                                                                {offer.status === 'DECLINED' && offer.rejection_reason && (
                                                                                    <div className="bg-red-50 border border-red-100 p-3 rounded-xl mb-3 flex items-start gap-2">
                                                                                        <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                                                                                        <p className="text-[10px] font-bold text-red-600 leading-relaxed">不承諾理由: {offer.rejection_reason}</p>
                                                                                    </div>
                                                                                )}
                                                                                <div className="grid grid-cols-2 gap-3">
                                                                                    <TimelineButton
                                                                                        label="オファー承認"
                                                                                        assetId={offer.id}
                                                                                        field="approved_at"
                                                                                        currentValue={offer.approved_at}
                                                                                        currentStatus={offer.status}
                                                                                        onUpdate={fetchData}
                                                                                    />
                                                                                    <TimelineButton
                                                                                        label="報酬デポジット"
                                                                                        assetId={offer.id}
                                                                                        field="reward_deposit"
                                                                                        currentValue={offer.reward_deposit ? offer.createdAt : null}
                                                                                        currentStatus={offer.status}
                                                                                        currentPostUrl={offer.reward_paymentlink}
                                                                                        onUpdate={fetchData}
                                                                                    />
                                                                                    <TimelineButton
                                                                                        label="撮影完了"
                                                                                        assetId={offer.id}
                                                                                        field="filming_at"
                                                                                        currentValue={offer.visit_at}
                                                                                        currentStatus={offer.status}
                                                                                        onUpdate={fetchData}
                                                                                    />
                                                                                    <TimelineButton
                                                                                        label="納品完了"
                                                                                        assetId={offer.id}
                                                                                        field="delivered_at"
                                                                                        currentValue={offer.delivery_at}
                                                                                        currentStatus={offer.status}
                                                                                        currentVideoUrl={offer.video_url}
                                                                                        onUpdate={fetchData}
                                                                                    />
                                                                                    <TimelineButton
                                                                                        label="広告主承認"
                                                                                        assetId={offer.id}
                                                                                        field="finalized"
                                                                                        currentValue={offer.status === 'FINALIZED' ? offer.createdAt : null}
                                                                                        currentStatus={offer.status}
                                                                                        currentPostUrl={offer.published_url}
                                                                                        onUpdate={fetchData}
                                                                                    />
                                                                                    <TimelineButton
                                                                                        label="投稿済みURLを共有して依頼を完了する"
                                                                                        assetId={offer.id}
                                                                                        field="confirmed_at"
                                                                                        currentValue={offer.published_url ? offer.createdAt : null}
                                                                                        currentPostUrl={offer.published_url}
                                                                                        onUpdate={fetchData}
                                                                                    />
                                                                                </div>
                                                                                <p className="text-[9px] text-slate-400 font-bold bg-slate-50 p-2 rounded border border-slate-100 flex items-center gap-2">
                                                                                    <Sparkles size={10} className="text-amber-500" />
                                                                                    ボタンを押すと現在時刻が記録され、アセットハブのステータスが変更されます。
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {logTab === 'lost' && (
                                                                        <>
                                                                            <div className="flex items-center justify-between mb-6">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="bg-indigo-600 p-1.5 rounded-lg text-white">
                                                                                        <Sparkles size={16} />
                                                                                    </span>
                                                                                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                                                                                        代替アンバサダー候補
                                                                                    </h4>
                                                                                </div>
                                                                            </div>

                                                                            <div className="grid grid-cols-5 gap-4">
                                                                                {getAlternatives(offer, creators).map((alt) => (
                                                                                    <motion.div
                                                                                        key={alt.id}
                                                                                        whileHover={{ y: -4 }}
                                                                                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group transition-all hover:shadow-xl hover:border-indigo-200 cursor-pointer relative overflow-hidden"
                                                                                    >
                                                                                        <div className="relative mb-3">
                                                                                            <img
                                                                                                src={alt.thumbnail_url || alt.profile_image_url || 'https://via.placeholder.com/150'}
                                                                                                className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-50 shadow-sm transition-transform group-hover:scale-105"
                                                                                                referrerPolicy="no-referrer"
                                                                                                alt={alt.name}
                                                                                            />

                                                                                            {/* ▼▼ 滞在ステータスバッジの追加 ▼▼ */}
                                                                                            {alt.in_japan ? (
                                                                                                <div className="absolute -bottom-1 -right-2 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-0.5">
                                                                                                    <MapPin size={8} /> IN JAPAN
                                                                                                </div>
                                                                                            ) : alt.coming_soon ? (
                                                                                                <div className="absolute -bottom-1 -right-2 bg-blue-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-0.5">
                                                                                                    <Plane size={8} /> SOON
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full border-2 border-white shadow-sm">
                                                                                                    <Check size={8} />
                                                                                                </div>
                                                                                            )}
                                                                                            {/* ▲▲ 追加ここまで ▲▲ */}
                                                                                        </div>

                                                                                        <p className="text-xs font-black text-slate-900 truncate w-full mb-0.5">@{alt.name || alt.handle}</p>
                                                                                        <p className="text-[10px] font-bold text-slate-400 mb-2">{alt.followersStr || alt.followers || '---'} followers</p>

                                                                                        {/* ▼▼ 計算された類似度スコアを表示（90%以上は色を変えてハイライト） ▼▼ */}
                                                                                        <p className={`text-[10px] font-black px-2 py-0.5 rounded-md mb-4 border ${alt.similarityScore >= 90
                                                                                            ? 'text-amber-600 bg-amber-50 border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                                                                                            : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                                                                                            }`}>
                                                                                            {alt.similarityScore}% Match
                                                                                        </p>

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
                                                                        </>
                                                                    )}
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