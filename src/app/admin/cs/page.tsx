"use client";

import React, { useState } from "react";
import {
    MessageCircle, Globe, Zap, AlertTriangle, Send,
    CheckCircle, Save, UserCog, Plus, X
} from "lucide-react";

// Types
type Ticket = {
    id: number;
    user: string;
    type: "Creator (EN)" | "Client (JP)";
    status: "Unread" | "Pending" | "Resolved";
    subject: string;
    body: string;
    time: string;
};

type Playbook = {
    id: number;
    category: "Creator" | "Client";
    label: string;
    text: string;
};

// 1. 初期データ: 鉄板Playbook 8選
const initialPlaybooks: Playbook[] = [
    // --- For Creators (English) ---
    { id: 1, category: "Creator", label: "💰 Payment (報酬)", text: "Payments are processed at the end of the month and transferred to your account on the 15th of the following month." },
    { id: 2, category: "Creator", label: "🗓 Schedule (日程変更)", text: "Please consult directly with the shop owner via chat. If you cannot reach them, let us know 3 potential dates." },
    { id: 3, category: "Creator", label: "👥 Plus One (同伴者)", text: "Basically, the offer is for one person. Please ask the shop owner for permission in advance if you need an assistant." },
    { id: 4, category: "Creator", label: "❌ Cancellation (キャンセル)", text: "Understood. Please notify the shop owner immediately. Note that frequent cancellations may affect your account rating." },

    // --- For Clients (Japanese) ---
    { id: 5, category: "Client", label: "📴 音信不通", text: "事務局からクリエイターへ緊急連絡（電話/SMS）を行います。24時間以内に反応がない場合、他の候補者を優先手配いたします。" },
    { id: 6, category: "Client", label: "📹 修正依頼", text: "原則としてクリエイターの世界観（VIBE）にお任せいただいておりますが、明らかな誤情報やNG事項が含まれる場合は修正可能です。該当箇所をご教示ください。" },
    { id: 7, category: "Client", label: "©️ 二次利用", text: "MANEKEY経由で納品された動画は、御社のGoogleマップおよびWebサイトでの利用許諾済みです。管理画面の「Asset Hub」からダウンロード・連携が可能です。" },
    { id: 8, category: "Client", label: "📄 請求書払い", text: "可能です。管理画面の「Settings > Billing」より、支払い方法を「Invoice」に変更してください。月末締めで請求書を発行いたします。" },
];

// Inbox Mock Data
const inboxData: Ticket[] = [
    { id: 1, user: "Sarah Jenkins", type: "Creator (EN)", status: "Unread", subject: "Payment Question", body: "Hi, when exactly will I get paid for the Sushi project? I need to know the date.", time: "10 min ago" },
    { id: 2, user: "居酒屋 権八", type: "Client (JP)", status: "Pending", subject: "動画の二次利用について", body: "納品された動画を自社のインスタ広告に使いたいのですが、追加料金はかかりますか？", time: "1 hour ago" },
    { id: 3, user: "Liam Wong", type: "Creator (EN)", status: "Unread", subject: "Can I bring my GF?", body: "I'm planning to visit the cafe tomorrow. Can I bring my girlfriend? She can help me record.", time: "2 hours ago" },
];

export default function CSCommandCenter() {
    // State
    const [playbooks, setPlaybooks] = useState<Playbook[]>(initialPlaybooks);
    const [selectedTicket, setSelectedTicket] = useState<Ticket>(inboxData[0]);
    const [replyText, setReplyText] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false); // デモ用: 管理者モード切替

    // Modal State for "Add to Playbook"
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [newPlaybookLabel, setNewPlaybookLabel] = useState("");

    // Handler: Apply Template
    const applyTemplate = (text: string) => {
        setReplyText(text);
    };

    // Handler: Send Message
    const handleSendClick = () => {
        if (replyText.trim() === "") return;

        // Adminモードなら保存フローへ、Opsなら即完了
        if (isAdminMode) {
            setShowSaveModal(true);
        } else {
            alert("送信しました (Ops Mode: No Playbook Save)");
            setReplyText("");
        }
    };

    // Handler: Save as New Playbook
    const handleSavePlaybook = () => {
        if (newPlaybookLabel) {
            const newPb: Playbook = {
                id: Date.now(),
                category: selectedTicket.type.includes("Creator") ? "Creator" : "Client",
                label: `✨ ${newPlaybookLabel}`, // 新規追加分を目立たせる
                text: replyText
            };
            setPlaybooks([...playbooks, newPb]);
            alert(`送信完了＆Playbookに「${newPlaybookLabel}」を追加しました！`);
        } else {
            alert("送信完了（Playbookには追加しませんでした）");
        }
        setShowSaveModal(false);
        setReplyText("");
        setNewPlaybookLabel("");
    };

    return (
        <div className="flex flex-1 overflow-hidden relative">




            {/* 1. Inbox Sidebar */}
            <div className="w-80 bg-white border-r flex flex-col shrink-0">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-bold text-gray-700 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" /> CS Inbox
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{inboxData.length}</span>
                    </h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    {inboxData.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => { setSelectedTicket(ticket); setReplyText(""); setIsTranslated(false); }}
                            className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors ${selectedTicket.id === ticket.id ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className={`text-[10px] px-1.5 rounded font-bold ${ticket.type.includes("Creator") ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>
                                    {ticket.type}
                                </span>
                                <span className="text-xs text-gray-400">{ticket.time}</span>
                            </div>
                            <div className="font-bold text-sm text-gray-900 truncate">{ticket.user}</div>
                            <div className="text-xs text-gray-500 truncate">{ticket.subject}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Header */}
                <div className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
                    <div>
                        <h1 className="font-bold text-lg">{selectedTicket.subject}</h1>
                        <p className="text-xs text-gray-500">From: {selectedTicket.user}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* --- DEMO TOGGLE --- */}
                        <div className="flex items-center bg-white p-1 rounded-full border shadow-sm">
                            <button
                                onClick={() => setIsAdminMode(false)}
                                className={`px-3 py-1 text-xs rounded-full transition-all ${!isAdminMode ? "bg-gray-200 font-bold" : "text-gray-500"}`}
                            >
                                Ops Member
                            </button>
                            <button
                                onClick={() => setIsAdminMode(true)}
                                className={`px-3 py-1 text-xs rounded-full transition-all flex items-center gap-1 ${isAdminMode ? "bg-black text-white font-bold" : "text-gray-500"}`}
                            >
                                <UserCog className="w-3 h-3" /> Admin (Abe)
                            </button>
                        </div>

                        <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold border border-red-100 flex items-center gap-2 hover:bg-red-100 transition-colors">
                            <AlertTriangle className="w-4 h-4" />
                            {isAdminMode ? "対応中 (You are Admin)" : "エスカレーションする"}
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">

                    {/* Received Message Bubble */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm max-w-3xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className="font-bold text-gray-700 text-sm">Message Content</div>
                            {selectedTicket.type.includes("Creator") && (
                                <button
                                    onClick={() => setIsTranslated(!isTranslated)}
                                    className="text-xs bg-black text-white px-3 py-1 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors"
                                >
                                    <Globe className="w-3 h-3" /> {isTranslated ? "Show Original" : "Translate to Japanese"}
                                </button>
                            )}
                        </div>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {isTranslated
                                ? "【自動翻訳】\nこんにちは、寿司プロジェクトの報酬は具体的にいつ振り込まれますか？日付を知りたいです。"
                                : selectedTicket.body
                            }
                        </p>
                    </div>

                    {/* Playbooks & Reply Area */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                        <div className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            Playbooks (正解テンプレート)
                        </div>

                        {/* Playbook Buttons (Filtered by User Type) */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {playbooks
                                .filter(pb => selectedTicket.type.includes(pb.category))
                                .map((pb) => (
                                    <button
                                        key={pb.id}
                                        onClick={() => applyTemplate(pb.text)}
                                        className="text-xs bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all text-left shadow-sm active:scale-95"
                                    >
                                        {pb.label}
                                    </button>
                                ))}
                            <button className="text-xs border border-dashed border-gray-400 text-gray-400 px-3 py-2 rounded-lg cursor-not-allowed">
                                + New
                            </button>
                        </div>

                        {/* Text Area */}
                        <div className="relative">
                            <textarea
                                className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-black outline-none resize-none shadow-sm"
                                placeholder={selectedTicket.type.includes("Creator") ? "返信内容を入力（日本語でOK → 自動で英語になります）..." : "返信内容を入力..."}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
                                {replyText.length} chars
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                {selectedTicket.type.includes("Creator")
                                    ? <><Globe className="w-3 h-3" /> 送信時にAIが自動でビジネス英語に変換します。</>
                                    : <><CheckCircle className="w-3 h-3" /> そのまま送信されます。</>
                                }
                            </p>
                            <button
                                onClick={handleSendClick}
                                className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                                {isAdminMode ? "返信して解決 (Admin)" : "返信して解決 (Resolve)"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Admin Feedback Loop Modal (The "Magic" Part) */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="bg-yellow-400 p-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-black fill-white" />
                            <h3 className="font-bold text-black">今回の対応をQAデータに加えますか？</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                ご対応お疲れ様です。<br />
                                今回の返信はイレギュラー対応ですか？<br />
                                それとも、今後Opsチームが使える<strong>「新しい正解」</strong>ですか？
                            </p>

                            <div className="bg-gray-50 p-3 rounded border text-xs text-gray-500 italic mb-2">
                                "{replyText.length > 50 ? replyText.substring(0, 50) + "..." : replyText}"
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-1 block">
                                    Playbookに追加する場合のタイトル
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newPlaybookLabel}
                                        onChange={(e) => setNewPlaybookLabel(e.target.value)}
                                        placeholder="例: 台風時の特別対応"
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => { alert("送信しました（保存なし）"); setShowSaveModal(false); setReplyText(""); }}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                                >
                                    今回は保存しない
                                </button>
                                <button
                                    onClick={handleSavePlaybook}
                                    disabled={!newPlaybookLabel}
                                    className="flex-1 py-3 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Save className="w-4 h-4" /> 保存して追加
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}