'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';

const GENRES = [
    { id: 'FOOD', label: 'Food', emoji: '🍣' },
    { id: 'BEAUTY', label: 'Beauty', emoji: '💅' },
    { id: 'TRAVEL', label: 'Travel', emoji: '⛩️' },
    { id: 'EXPERIENCE', label: 'Experience', emoji: '🧖‍♀️' },
    { id: 'LIFESTYLE', label: 'Lifestyle', emoji: '✨' },
];

export function GuidedSearchBar({ defaultValue = '', defaultGenre = 'FOOD', className = '' }: { defaultValue?: string, defaultGenre?: string, className?: string }) {
    const router = useRouter();
    const [url, setUrl] = useState(defaultValue);
    const [genre, setGenre] = useState(defaultGenre);

    const handleAnalyze = () => {
        if (!url.trim()) return;
        // 解析画面へジャンル付きで遷移
        router.push(`/demo/analyzing?genre=${genre}`);
    };

    return (
        <div className={`max-w-3xl mx-auto bg-white rounded-full p-2 shadow-2xl flex items-center border border-stone-200 ring-1 ring-black/5 ${className}`}>
            {/* Genre Select */}
            <div className="relative border-r border-stone-200 pr-2 flex items-center">
                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="appearance-none bg-transparent font-bold text-sm pl-6 pr-10 py-3 outline-none cursor-pointer hover:bg-stone-50 rounded-l-full transition-colors text-stone-900"
                >
                    {GENRES.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.emoji} {g.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 pointer-events-none" />
            </div>

            {/* URL Input */}
            <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="w-5 h-5 text-stone-400 shrink-0" />
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Googleマップ または InstagramのURL"
                    className="w-full py-3 outline-none text-stone-700 placeholder:text-stone-300 font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
            </div>

            {/* Button */}
            <button
                onClick={handleAnalyze}
                disabled={!url.trim()}
                className="bg-black text-white px-8 py-4 rounded-full font-black flex items-center gap-2 hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-black/10"
            >
                VIBE解析を開始 <span className="text-yellow-400 animate-pulse">✨</span>
            </button>
        </div>
    );
}
