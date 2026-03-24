'use client';

import { useState } from 'react';

export default function BillingPortalButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handlePortalRedirect = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'エラーが発生しました');

            // Stripeカスタマーポータルへリダイレクト
            window.location.href = data.url;
        } catch (error: any) {
            console.error(error);
            alert(`エラー: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePortalRedirect}
            disabled={isLoading}
            className="px-6 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200"
        >
            {isLoading ? '読み込み中...' : 'お支払い情報・プランの管理'}
        </button>
    );
}