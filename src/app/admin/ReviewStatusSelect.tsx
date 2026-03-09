"use client";

import { useState } from "react";
// ※プロジェクト環境に合わせてSupabaseクライアントのパスを調整してください
import { createClient } from "@/utils/supabase/client";

type ReviewStatus = "pending" | "approved" | "rejected";

interface ReviewStatusSelectProps {
    creatorId: string;
    initialStatus: string | null;
}

export default function ReviewStatusSelect({ creatorId, initialStatus }: ReviewStatusSelectProps) {
    // DBが空の場合は 'pending' をフォールバック
    const [status, setStatus] = useState<ReviewStatus>((initialStatus as ReviewStatus) || "pending");
    const [isUpdating, setIsUpdating] = useState(false);

    const supabase = createClient();

    const handleStatusChange = async (newStatus: ReviewStatus) => {
        setIsUpdating(true);
        setStatus(newStatus); // 楽観的UI更新（ユーザーを待たせない）

        const { error } = await supabase
            .from("creators")
            .update({ review_status: newStatus })
            .eq("id", creatorId);

        if (error) {
            console.error("Status update failed:", error);
            alert("ステータスの更新に失敗しました。");
        }

        setIsUpdating(false);
    };

    // ステータスに応じたTailwindカラーリング
    const styles = {
        pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
        approved: "bg-green-50 text-green-700 border-green-200",
        rejected: "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <div className="relative inline-block">
            <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as ReviewStatus)}
                disabled={isUpdating}
                className={`appearance-none cursor-pointer outline-none text-xs font-medium px-3 py-1.5 pr-8 rounded-full border transition-colors ${styles[status]} ${isUpdating ? "opacity-50" : ""}`}
            >
                <option value="pending">⏳ Pending</option>
                <option value="approved">✓ Approved</option>
                <option value="rejected">✕ Rejected</option>
            </select>

            {/* ドロップダウン用のカスタム矢印 */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
    );
}