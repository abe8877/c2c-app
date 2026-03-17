"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AdvertiserRegisterPage() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate registration process
        setTimeout(() => {
            if (inviteCode.toUpperCase() === "BETA2026") {
                localStorage.setItem("freeOffers", "3");
                localStorage.setItem("isPremium", "false");
            } else {
                localStorage.setItem("freeOffers", "0");
                localStorage.setItem("isPremium", "false");
            }

            router.push("/demo/advertiser");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 font-sans text-stone-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl relative"
            >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500" />

                <div className="p-8 pb-6">
                    <div className="flex items-center justify-center mb-6">
                        <div className="font-black text-2xl tracking-tighter flex items-center gap-1.5">
                            INSIDERS.
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-center mb-2 tracking-tight">広告主アカウント登録</h1>
                    <p className="text-stone-500 text-xs text-center font-bold mb-8">
                        グローバル基準のUGCクリエイターとマッチングし、<br />
                        インバウンド集客を最大化しましょう。
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Company / Name</label>
                            <input
                                type="text"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="株式会社nots"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 font-bold transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="info@nots.jp"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 font-bold transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1 flex items-center gap-1">
                                Invite Code <span className="text-stone-300 font-medium">(Optional)</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    placeholder="BETA2026"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:bg-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 font-bold uppercase transition-all"
                                />
                                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                            </div>
                            <p className="text-[10px] text-stone-400 font-bold mt-1 ml-1">&quot;BETA2026&quot; で無料オファー枠3回を獲得できます</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-stone-900 text-white rounded-xl py-4 font-black flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] mt-8 shadow-xl shadow-stone-200"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>登録して始める <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-stone-50 p-4 text-center border-t border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400">
                        登録することで、利用規約およびプライバシーポリシーに同意したものとみなされます。
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
