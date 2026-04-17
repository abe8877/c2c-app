"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Send, Sparkles, Clock, MapPin,
    RefreshCw, Camera, AlertCircle, Loader2, User
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { sendMessage, getAssistantResponse } from '@/app/actions/chat';

interface Message {
    id: string;
    sender_id: string;
    sender_type: 'shop' | 'creator';
    message: string;
    created_at: string;
}

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    partnerName: string;
    currentUserType: 'shop' | 'creator';
}

export default function ChatModal({
    isOpen,
    onClose,
    assetId,
    partnerName,
    currentUserType
}: ChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
    const [shopData, setShopData] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const [activeTemplate, setActiveTemplate] = useState<'map' | 'menu' | 'camera' | 'schedule' | null>(null);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [templateExtraText, setTemplateExtraText] = useState(""); // Used only for schedule demands
    const [syncToProfile, setSyncToProfile] = useState(false);

    // Detailed states matching profile settings
    const [formAccess, setFormAccess] = useState({ hours: "", holidays: "", address: "", access_en: "", map_url: "" });
    const [formMenu, setFormMenu] = useState({ description: "", restrictions: [] as string[] });
    const [formShooting, setFormShooting] = useState({ elements: [] as string[], time: "Lunch", staff: "OK", special: "" });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load initial data from shop profile
    useEffect(() => {
        if (shopData) {
            setFormAccess({
                hours: shopData.business_hours || "",
                holidays: shopData.irregular_holidays || "",
                address: shopData.address_jp || "",
                access_en: shopData.address_en || "",
                map_url: shopData.google_map_url || ""
            });
            setFormMenu({
                description: shopData.preset_menu_en || "",
                restrictions: shopData.dietary_restrictions || []
            });
            setFormShooting({
                elements: shopData.shoot_elements || [],
                time: shopData.shoot_time_slot || "Lunch",
                staff: shopData.shoot_staff_appearance || "OK",
                special: shopData.shoot_rules_en || ""
            });
        }
    }, [shopData]);

    // 1. Initial Fetch
    useEffect(() => {
        if (!isOpen || !assetId) return;

        const fetchData = async () => {
            setIsLoading(true);

            // Partner Avatar & Shop Dataの取得
            const { data: asset } = await supabase
                .from('assets')
                .select(`
                    id,
                    shop_id,
                    creator_id,
                    shops ( logo_url, name, address_en, preset_menu_en, shoot_rules_en ),
                    creators ( avatar_url )
                `)
                .eq('id', assetId)
                .single();

            if (asset) {
                const avatar = currentUserType === 'shop'
                    ? (asset.creators as any)?.avatar_url
                    : (asset.shops as any)?.logo_url;
                setPartnerAvatar(avatar);
                setShopData(asset.shops);
            }

            // メッセージの取得
            const { data: chatData, error } = await supabase
                .from('messages')
                .select('*')
                .eq('asset_id', assetId)
                .order('created_at', { ascending: true });

            if (chatData) {
                setMessages(chatData);
            }
            setIsLoading(false);
            setTimeout(scrollToBottom, 100);
        };

        fetchData();

        // Realtime Subscription
        const channel = supabase
            .channel(`asset-chat-${assetId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `asset_id=eq.${assetId}`
            }, (payload) => {
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new as Message];
                });
                setTimeout(scrollToBottom, 100);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isOpen, assetId, currentUserType]);

    const handleSend = async (manualText?: string) => {
        const textToSend = typeof manualText === 'string' ? manualText : inputText;
        if (!textToSend.trim() || isAiGenerating) return;

        setInputText("");

        try {
            // ステートを即時更新して体感速度を向上
            const tempId = 'temp-' + Math.random().toString(36).substring(7);
            const newMessage: Message = {
                id: tempId,
                sender_id: 'me',
                sender_type: currentUserType,
                message: textToSend,
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, newMessage]);
            setTimeout(scrollToBottom, 50);

            const res = await sendMessage({
                assetId,
                content: textToSend,
                senderType: currentUserType
            });

            if (!res.success) throw new Error(res.message);

            // 翻訳されたメッセージがある場合、表示をそれに差し替える（体感向上）
            if (res.data?.message && res.data.message !== textToSend) {
                setMessages(prev => prev.map(m =>
                    m.id === tempId ? { ...m, id: res.data.id, message: res.data.message } : m
                ));
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("メッセージの送信に失敗しました。");
            setInputText(textToSend); // Restore
        }
    };

    const handleAiConcierge = async () => {
        if (isAiGenerating || !activeTemplate) return;
        setIsAiGenerating(true);

        try {
            const currentShopId = shopData?.id || (await supabase.from('assets').select('shop_id').eq('id', assetId).single()).data?.shop_id;

            // 編集された内容があれば保存を試みる
            let currentData = null;
            if (activeTemplate === 'map') currentData = formAccess;
            if (activeTemplate === 'menu') currentData = formMenu;
            if (activeTemplate === 'camera') currentData = formShooting;

            if (syncToProfile && activeTemplate !== 'schedule' && currentData) {
                const { updateShopPreset } = await import('@/app/actions/chat');
                await updateShopPreset({
                    shopId: currentShopId,
                    type: activeTemplate as 'map' | 'menu' | 'camera',
                    data: currentData
                });

                // ローカル状態を更新 (簡易的)
                setShopData((prev: any) => ({
                    ...prev,
                    ...currentData // フィールド名が完全に一致しない場合はもう少し細かなマッピングが必要
                }));
            }

            const result = await getAssistantResponse({
                type: activeTemplate,
                shopId: currentShopId,
                dates: activeTemplate === 'schedule' ? selectedDates : undefined,
                contentOverride: activeTemplate === 'schedule' ? templateExtraText.trim() : undefined,
                structuredData: currentData
            });

            if (result.success && result.text) {
                await handleSend(result.text);
            } else {
                alert(result.error || "AI生成に失敗しました。");
            }
        } catch (error) {
            console.error("AI Assistant Error:", error);
            alert("エラーが発生しました。");
        } finally {
            setIsAiGenerating(false);
            setActiveTemplate(null);
            // setTemplateExtraText(""); // 消さないほうが良い場合もあるが一旦リセット
            setSelectedDates([]);
        }
    };

    const getNextSevenDays = () => {
        const days = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' }));
        }
        return days;
    };

    // テンプレートごとのプレビュー初期化
    useEffect(() => {
        if (activeTemplate === 'map') setTemplateExtraText(shopData?.address_en || "");
        if (activeTemplate === 'menu') setTemplateExtraText(shopData?.preset_menu_en || "");
        if (activeTemplate === 'camera') setTemplateExtraText(shopData?.shoot_rules_en || "");
    }, [activeTemplate]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90dvh] relative"
                >
                    {/* Header */}
                    <div className="bg-[#1A1A1A] px-6 py-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-zinc-900 relative flex items-center justify-center">
                                {partnerAvatar ? (
                                    <img src={partnerAvatar} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <User className="w-5 h-5 text-zinc-500" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-base leading-tight">{partnerName}</h2>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">AI Concierge Active</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-6 h-6 text-zinc-400" />
                        </button>
                    </div>

                    {/* Compact Template Overlay */}
                    <AnimatePresence>
                        {activeTemplate && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-x-0 bottom-0 top-[64px] z-50 bg-white/95 backdrop-blur-xl p-6 flex flex-col border-t"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-teal-400" />
                                        {activeTemplate === 'schedule' && '日程候補を選択'}
                                        {activeTemplate === 'map' && 'アクセス・店舗情報を編集'}
                                        {activeTemplate === 'menu' && 'メニュー情報を編集'}
                                        {activeTemplate === 'camera' && '撮影ルール・要望（オファー時に送付済みなら不要）'}
                                    </h3>
                                    <button onClick={() => setActiveTemplate(null)} className="p-1.5 hover:bg-zinc-100 rounded-full"><X className="w-5 h-5" /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-6 px-1">
                                    {activeTemplate === 'schedule' ? (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[2px]">近日1週間の候補日</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {getNextSevenDays().map(day => (
                                                        <button
                                                            key={day}
                                                            onClick={() => setSelectedDates(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                                                            className={`p-3 rounded-xl border-2 text-[10px] font-black transition-all ${selectedDates.includes(day)
                                                                ? 'border-black bg-black text-white shadow-lg'
                                                                : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'
                                                                }`}
                                                        >
                                                            {day}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[2px]">クリエイターへの要望</p>
                                                <textarea
                                                    value={templateExtraText}
                                                    onChange={(e) => setTemplateExtraText(e.target.value)}
                                                    placeholder="撮影時間は14:00〜16:00を希望します、などの詳細を入力してください"
                                                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-bold font-sans h-32 outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    ) : activeTemplate === 'map' ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase">営業時間</p>
                                                    <input value={formAccess.hours} onChange={(e) => setFormAccess({ ...formAccess, hours: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none" placeholder="Mon-Sun 17:00-23:00" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase">定休日</p>
                                                    <input value={formAccess.holidays} onChange={(e) => setFormAccess({ ...formAccess, holidays: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none" placeholder="Irregular holidays" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase">住所</p>
                                                <input value={formAccess.address} onChange={(e) => setFormAccess({ ...formAccess, address: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none" placeholder="東京都渋谷区..." />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase">アクセス（英語）</p>
                                                <textarea value={formAccess.access_en} onChange={(e) => setFormAccess({ ...formAccess, access_en: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none h-20 resize-none" placeholder="3 min walk from Shibuya Station..." />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase">Google Map URL</p>
                                                <input value={formAccess.map_url} onChange={(e) => setFormAccess({ ...formAccess, map_url: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none" placeholder="https://maps.google.com/..." />
                                            </div>
                                        </div>
                                    ) : activeTemplate === 'menu' ? (
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase">提供メニュー内容（英語）</p>
                                                <textarea value={formMenu.description} onChange={(e) => setFormMenu({ ...formMenu, description: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none h-24 resize-none" placeholder="Premium Wagyu Course with Seasonal Desserts..." />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase">対応可能な食事制限</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Vegan', 'Vegetarian', 'Halal-friendly', 'Gluten-Free', 'Dairy-Free'].map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => setFormMenu(prev => ({ ...prev, restrictions: prev.restrictions.includes(tag) ? prev.restrictions.filter(t => t !== tag) : [...prev.restrictions, tag] }))}
                                                            className={`px-3 py-1.5 rounded-full text-[9px] font-black transition-all ${formMenu.restrictions.includes(tag) ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase">動画に盛り込んでほしい要素</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {['看板メニュー', '店内の雰囲気', 'スタッフの接客', '外観・看板', 'アクセス情報', '利用シーン'].map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => setFormShooting(prev => ({ ...prev, elements: prev.elements.includes(tag) ? prev.elements.filter(t => t !== tag) : [...prev.elements, tag] }))}
                                                            className={`px-3 py-1.5 rounded-full text-[9px] font-black transition-all ${formShooting.elements.includes(tag) ? 'bg-teal-500 text-white' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">希望撮影時間</p>
                                                    <select value={formShooting.time} onChange={(e) => setFormShooting({ ...formShooting, time: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none">
                                                        <option>Lunch</option>
                                                        <option>Dinner</option>
                                                        <option>Flexible</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">スタッフ映り込み</p>
                                                    <select value={formShooting.staff} onChange={(e) => setFormShooting({ ...formShooting, staff: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none">
                                                        <option>OK</option>
                                                        <option>NG</option>
                                                        <option>Ask Creator</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">注意事項（撮影時の注意点やNG事項があれば）</p>
                                                <textarea value={formShooting.special} onChange={(e) => setFormShooting({ ...formShooting, special: e.target.value })} className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none h-20 resize-none" placeholder="Please do not show other customers' faces..." />
                                            </div>
                                        </div>
                                    )}
                                    {activeTemplate !== 'schedule' && (
                                        <div className="flex items-center justify-end px-1">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={syncToProfile}
                                                    onChange={(e) => setSyncToProfile(e.target.checked)}
                                                    className="w-3.5 h-3.5 rounded border-zinc-300 text-black focus:ring-black"
                                                />
                                                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-600">プロフィールに反映</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <button
                                        onClick={handleAiConcierge}
                                        disabled={isAiGenerating || (activeTemplate === 'schedule' && selectedDates.length === 0)}
                                        className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-30"
                                    >
                                        {isAiGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-teal-400" />}
                                        英語チャットをAI生成して送信
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50 flex flex-col min-h-0">
                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                                <AlertCircle className="w-12 h-12 mb-4" />
                                <p className="text-sm font-bold">No messages yet</p>
                                <p className="text-[10px] mt-1 italic">Use AI Concierge templates to start conversation</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMine = msg.sender_type === currentUserType;
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMine
                                            ? 'bg-black text-white rounded-tr-none'
                                            : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-none'
                                            }`}>
                                            <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                                            <div className={`mt-1.5 pt-1.5 border-t text-[9px] font-black uppercase tracking-widest flex items-center justify-between ${isMine ? 'border-white/10 text-white/40' : 'border-zinc-100 text-zinc-400'
                                                }`}>
                                                <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {isMine && <span className="text-[8px]">SENT</span>}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer / Input */}
                    <div className="bg-white border-t p-4 pb-8 space-y-4 shrink-0">
                        {/* AI Templates */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                            <button
                                onClick={() => setActiveTemplate('schedule')}
                                className="flex-none px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-100 transition-all"
                            >
                                <Clock className="w-3.5 h-3.5" /> 日程候補
                            </button>
                            <button
                                onClick={() => setActiveTemplate('map')}
                                className="flex-none px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-100 transition-all"
                            >
                                <MapPin className="w-3.5 h-3.5" /> 地図・アクセス
                            </button>
                            <button
                                onClick={() => setActiveTemplate('menu')}
                                className="flex-none px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-100 transition-all"
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> メニュー情報
                            </button>
                            <button
                                onClick={() => setActiveTemplate('camera')}
                                className="flex-none px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-100 transition-all"
                            >
                                <Camera className="w-3.5 h-3.5" /> 撮影要望
                            </button>
                        </div>

                        {/* Input Box */}
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2">
                            <div className="relative flex-1">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type your message..."
                                    rows={1}
                                    className="w-full bg-zinc-100 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-black outline-none resize-none min-h-[44px] max-h-32 transition-all no-scrollbar"
                                    onKeyDown={(e) => {
                                        // IME変換中のENTERでは送信しない
                                        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                />
                                {isAiGenerating && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                                        <Loader2 className="w-5 h-5 text-black animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isAiGenerating}
                                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all disabled:opacity-30 disabled:scale-100 active:scale-95 shrink-0"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}