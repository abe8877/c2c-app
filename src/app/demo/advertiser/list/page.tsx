"use client";

import React from "react";
import { FloatingActionBar } from "@/components/floating-action-bar";
import { Search, MessageCircle, CheckCircle, Clock, ExternalLink, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// 確定・交渉中クリエイターのダミーデータ
const hiredCreators = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Cinematic Shorts",
        status: "Negotiating", // 交渉中
        date: "2024-03-01",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop",
        fee: "¥45,000",
    },
    {
        id: 2,
        name: "Li Wei",
        role: "Gourmet Vlogger",
        status: "Contracted", // 契約締結
        date: "2024-02-28",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
        fee: "¥38,000",
    },
    {
        id: 3,
        name: "Elena Rossi",
        role: "Art & Cafe",
        status: "Completed", // 投稿完了
        date: "2024-02-15",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3461&auto=format&fit=crop",
        fee: "¥50,000",
    },
];

const statusStyles = {
    Negotiating: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Contracted: "bg-blue-100 text-blue-800 border-blue-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
};

const statusLabels = {
    Negotiating: "交渉中",
    Contracted: "契約済",
    Completed: "投稿完了",
};

export default function AdvertiserList() {
    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/demo/advertiser" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                        MANEKEY
                    </Link>
                    <div className="text-sm text-gray-500">Asset Management</div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    依頼確定リスト
                </h1>

                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 divide-y">
                        {hiredCreators.map((creator) => (
                            <div key={creator.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors group">
                                {/* User Info */}
                                <div className="flex items-center gap-4">
                                    <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover border" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{creator.name}</h3>
                                        <p className="text-sm text-gray-500">{creator.role}</p>
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-1 md:justify-center items-center gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {creator.date}
                                    </div>
                                    <div className="font-medium text-gray-900">
                                        {creator.fee}
                                    </div>
                                </div>

                                {/* Status & Action */}
                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[creator.status as keyof typeof statusStyles]}`}>
                                        {statusLabels[creator.status as keyof typeof statusLabels]}
                                    </span>

                                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State / Add more */}
                    <div className="p-8 text-center bg-gray-50 border-t">
                        <p className="text-gray-500 mb-4">新しいクリエイターを探して、資産を増やしましょう。</p>
                        <Link href="/demo/advertiser" className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                            <Search className="w-4 h-4" />
                            クリエイターを探す
                        </Link>
                    </div>
                </div>
            </main>

            {/* Floating Action Bar */}
            <FloatingActionBar
                items={[
                    { name: "ホーム", link: "/demo/advertiser", icon: <Search className="w-4 h-4" /> },
                    { name: "AI相談", link: "#", icon: <MessageCircle className="w-4 h-4" /> },
                    { name: "確定リスト", link: "/demo/advertiser/list", icon: <CheckCircle className="w-4 h-4" /> },
                ]}
            />
        </div>
    );
}