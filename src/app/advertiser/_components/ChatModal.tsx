"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Clock, MapPin, RefreshCw, Camera, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage, getAssistantResponse } from "@/app/actions/chat";
import { format, addDays } from "date-fns";
import { ja } from "date-fns/locale";

export interface Message {
    id: string;
    sender_type: 'shop' | 'creator';
    content_original: string;
    content_translated: string | null;
    created_at: string;
}

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    partnerName: string;
    currentUserType: 'shop' | 'creator';
}

export default function ChatModal({ isOpen, onClose, assetId, partnerName, currentUserType }: ChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (!isOpen || !assetId) return;

        // Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('asset_id', assetId)
                .order('created_at', { ascending: true });

            if (data && !error) {
                setMessages(data);
                setTimeout(scrollToBottom, 100);
            }
        };

        fetchMessages();

        // Subscribe to real-time updates
        const channel = supabase.channel(`chat_${assetId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `asset_id=eq.${assetId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as Message]);
                    setTimeout(scrollToBottom, 100);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isOpen, assetId, supabase]);

    const handleSend = async () => {
        if (!inputText.trim() || isSending) return;
        setIsSending(true);
        try {
            await sendMessage({
                assetId,
                content: inputText,
                senderType: currentUserType
            });
            setInputText("");
        } catch (error) {
            console.error("Failed to send message", error);
            alert("送信に失敗しました");
        } finally {
            setIsSending(false);
        }
    };

    const applyTemplate = async (type: 'map' | 'menu' | 'camera' | 'schedule', dates?: string[]) => {
        if (currentUserType !== 'shop' || isGenerating) return;

        setIsGenerating(true);
        try {
            const res = await getAssistantResponse({
                type,
                shopId: 'demo-shop', // Mock ID
                dates
            });

            if (res.success && res.text) {
                setInputText(res.text);
            } else {
                // Fallback to static text if AI fails
                switch (type) {
                    case 'schedule':
                        setInputText("Regarding the schedule: Could you please provide your available dates and times?");
                        break;
                    case 'map':
                        setInputText("Here is the location information. Please let us know if you have trouble finding it.");
                        break;
                }
            }
        } catch (error) {
            console.error("AI Generation Error", error);
        } finally {
            setIsGenerating(false);
            setShowDatePicker(false);
        }
    };

    const toggleDate = (date: string) => {
        setSelectedDates(prev =>
            prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
        );
    };

    const next7Days = Array.from({ length: 7 }, (_, i) => {
        const d = addDays(new Date(), i);
        return {
            dateStr: format(d, 'yyyy-MM-dd'),
            display: format(d, 'MM/dd (eee)', { locale: ja })
        };
    });

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm"
            >
                {/* Background overlay click to close */}
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full max-w-md bg-stone-50 h-full flex flex-col relative shadow-2xl border-l border-stone-200 pt-16 md:pt-0"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-white border-b border-stone-200 shadow-sm z-10">
                        <div>
                            <h3 className="font-black text-lg text-stone-900 leading-tight">{partnerName}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">AIアシスタントが作動中</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-stone-400 text-sm mt-10 font-medium">
                                まだメッセージはありません。<br />挨拶を送ってみましょう！
                            </div>
                        )}

                        {messages.map(msg => {
                            const isMe = msg.sender_type === currentUserType;
                            return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm ${isMe ? 'bg-stone-900 text-white rounded-tr-sm' : 'bg-white text-stone-900 border border-stone-200 rounded-tl-sm'
                                        }`}>
                                        <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.content_original}</p>

                                        {msg.content_translated && (
                                            <div className={`mt-3 pt-3 border-t ${isMe ? 'border-white/20' : 'border-stone-100'}`}>
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Sparkles className={`w-3 h-3 ${isMe ? 'text-yellow-400' : 'text-blue-500'}`} />
                                                    <span className={`text-[9px] font-black tracking-widest uppercase ${isMe ? 'text-stone-400' : 'text-stone-500'}`}>
                                                        NOTS TRANSLATED
                                                    </span>
                                                </div>
                                                <p className={`text-xs font-bold ${isMe ? 'text-stone-300' : 'text-stone-700'} whitespace-pre-wrap leading-relaxed`}>
                                                    {msg.content_translated}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-stone-400 mt-1.5 font-bold px-1">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white border-t border-stone-200 p-4 shrink-0">
                        {/* Templates */}
                        {currentUserType === 'shop' && (
                            <div className="grid grid-cols-4 gap-2 mb-3 relative">
                                {/* Date Picker Popover */}
                                <AnimatePresence>
                                    {showDatePicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full left-0 mb-2 w-[240px] bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
                                                <span className="text-xs font-black text-stone-900 uppercase tracking-widest">Select Dates</span>
                                                <button onClick={() => setShowDatePicker(false)} className="text-stone-400 hover:text-stone-900 transition"><X size={14} /></button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-1 max-h-[220px] overflow-y-auto pr-1">
                                                {next7Days.map(d => (
                                                    <div key={d.dateStr} className="flex items-center gap-3 p-1.5 hover:bg-stone-50 rounded-lg transition">
                                                        <input
                                                            type="checkbox"
                                                            id={d.dateStr}
                                                            checked={selectedDates.includes(d.display)}
                                                            onChange={() => toggleDate(d.display)}
                                                            className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                                                        />
                                                        <label htmlFor={d.dateStr} className="text-xs font-bold text-stone-700 cursor-pointer flex-1">
                                                            {d.display}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => applyTemplate('schedule', selectedDates)}
                                                disabled={selectedDates.length === 0 || isGenerating}
                                                className="w-full mt-4 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-stone-800 transition shadow-lg active:scale-95"
                                            >
                                                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="text-yellow-400" />}
                                                スケジュール打診文を生成
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button onClick={() => setShowDatePicker(!showDatePicker)} className="flex flex-col items-center gap-1.5 p-2 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition">
                                    <Clock size={16} className="text-stone-600" />
                                    <span className="text-[9px] font-black text-stone-600">日程候補</span>
                                </button>
                                <button onClick={() => applyTemplate('map')} className="flex flex-col items-center gap-1.5 p-2 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition">
                                    <MapPin size={16} className="text-stone-600" />
                                    <span className="text-[9px] font-black text-stone-600">地図情報</span>
                                </button>
                                <button onClick={() => applyTemplate('menu')} className="flex flex-col items-center gap-1.5 p-2 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition">
                                    <RefreshCw size={16} className="text-stone-600" />
                                    <span className="text-[9px] font-black text-stone-600">メニュー</span>
                                </button>
                                <button onClick={() => applyTemplate('camera')} className="flex flex-col items-center gap-1.5 p-2 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition">
                                    <Camera size={16} className="text-stone-600" />
                                    <span className="text-[9px] font-black text-stone-600">撮影要望</span>
                                </button>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <textarea
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder={currentUserType === 'shop'
                                    ? "メッセージを入力（自動でプロ仕様の英語に翻訳されます）"
                                    : "Type a message..."}
                                className="flex-1 resize-none h-24 max-h-48 bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-stone-900 transition-all placeholder:text-stone-400"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim() || isSending}
                                className="h-24 w-12 shrink-0 bg-stone-900 text-white rounded-xl flex items-center justify-center hover:bg-stone-800 disabled:opacity-50 transition active:scale-95"
                            >
                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
