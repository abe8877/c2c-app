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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 1. Initial Fetch
    useEffect(() => {
        if (!isOpen || !assetId) return;

        const fetchData = async () => {
            setIsLoading(true);

            // Partner Avatarの取得
            const { data: asset } = await supabase
                .from('assets')
                .select(`
                    id,
                    shop_id,
                    creator_id,
                    shops ( logo_url ),
                    creators ( avatar_url )
                `)
                .eq('id', assetId)
                .single();

            if (asset) {
                const avatar = currentUserType === 'shop'
                    ? (asset.creators as any)?.avatar_url
                    : (asset.shops as any)?.logo_url;
                setPartnerAvatar(avatar);
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
                setMessages(prev => [...prev, payload.new as Message]);
                setTimeout(scrollToBottom, 100);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isOpen, assetId, currentUserType]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || isAiGenerating) return;

        const originalText = inputText;
        setInputText(""); // Clear input

        try {
            await sendMessage({
                assetId,
                content: originalText,
                senderType: currentUserType
            });
            // Subscription will handle adding message to local state
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("メッセージの送信に失敗しました。");
            setInputText(originalText); // Restore input
        }
    };

    const handleAiConcierge = async (type: 'map' | 'menu' | 'camera' | 'schedule') => {
        if (isAiGenerating) return;
        setIsAiGenerating(true);

        try {
            // Get shopId from asset (In a real app, this should be handled more robustly)
            const { data: asset } = await supabase
                .from('assets')
                .select('shop_id')
                .eq('id', assetId)
                .single();

            if (!asset?.shop_id) throw new Error("Shop ID not found");

            const result = await getAssistantResponse({
                type,
                shopId: asset.shop_id
            });

            if (result.success && result.text) {
                setInputText(result.text); // Set generated text to input
            } else {
                alert(result.error || "AI応答の生成に失敗しました。");
            }
        } catch (error) {
            console.error("AI Assistant Error:", error);
            alert("AI応答の生成中にエラーが発生しました。");
        } finally {
            setIsAiGenerating(false);
        }
    };

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
                    className="w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh]"
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
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">AIアシスタント機能が作動中</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-6 h-6 text-zinc-400" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50 flex flex-col min-h-0">
                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                                <AlertCircle className="w-12 h-12 mb-4" />
                                <p className="text-sm font-bold">まだメッセージはありません</p>
                                <p className="text-[10px] mt-1">早速 AIアシスタントを使って来店日程を調整しましょう！</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMine = msg.sender_type === currentUserType;
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${isMine
                                            ? 'bg-black text-white rounded-tr-none'
                                            : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-none'
                                            }`}>
                                            <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                                            <div className={`mt-1.5 pt-1.5 border-t text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${isMine ? 'border-white/10 text-white/40' : 'border-zinc-100 text-zinc-400'
                                                }`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        {/* AI Concierge Buttons (Shop Only or Desktop) */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                            <button
                                onClick={() => handleAiConcierge('schedule')}
                                disabled={isAiGenerating}
                                className="flex-none px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-100 transition-all disabled:opacity-50"
                            >
                                <Clock className="w-3.5 h-3.5 text-zinc-500" /> 日程候補
                            </button>
                            <button
                                onClick={() => handleAiConcierge('map')}
                                disabled={isAiGenerating}
                                className="flex-none px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-100 transition-all disabled:opacity-50"
                            >
                                <MapPin className="w-3.5 h-3.5 text-zinc-500" /> 地図情報
                            </button>
                            <button
                                onClick={() => handleAiConcierge('menu')}
                                disabled={isAiGenerating}
                                className="flex-none px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-100 transition-all disabled:opacity-50"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-zinc-500" /> メニュー案
                            </button>
                            <button
                                onClick={() => handleAiConcierge('camera')}
                                disabled={isAiGenerating}
                                className="flex-none px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-100 transition-all disabled:opacity-50"
                            >
                                <Camera className="w-3.5 h-3.5 text-zinc-500" /> 撮影要望
                            </button>
                        </div>

                        {/* Input Box */}
                        <form onSubmit={handleSend} className="relative flex items-center gap-2">
                            <div className="relative flex-1">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={isAiGenerating ? "AI 応答を生成中..." : "メッセージを入力..."}
                                    rows={1}
                                    className="w-full bg-zinc-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none resize-none min-h-[44px] max-h-32 transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
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
                                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-30 disabled:scale-100 hover:bg-zinc-800 active:scale-95 shrink-0"
                            >
                                {isAiGenerating ? (
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}