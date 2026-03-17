"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Share, PlusSquare, ArrowBigDown, Sparkles, Smartphone } from "lucide-react";
import Link from "next/link";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function OnboardingSuccess() {
    const [os, setOs] = useState<"ios" | "android" | "other" | null>(null);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // OS判定
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1) {
            setOs("ios");
        } else if (ua.indexOf("android") > -1) {
            setOs("android");
        } else {
            setOs("other");
        }

        // インストール済み判定 (Standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
        }

        // Android/Chrome用プロンプトのキャプチャ
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        });

        // インストール成功時のイベント
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        });
    }, []);

    const handleAndroidInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex justify-center selection:bg-amber-500/30">
            <div className="w-full max-w-md bg-black text-white min-h-screen relative shadow-2xl border-x border-zinc-900 p-6 flex flex-col items-center justify-center font-sans overflow-hidden">

                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zinc-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm text-center"
                >
                    <div className="mb-8 flex justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                            className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30"
                        >
                            <CheckCircle2 className="w-10 h-10 text-black" />
                        </motion.div>
                    </div>

                    <h1 className="text-3xl font-bold mb-3 tracking-tight">Welcome, Tier-S</h1>
                    <p className="text-zinc-400 mb-10 leading-relaxed text-sm">
                        Registration complete. Your exclusive creator dashboard is now ready.
                    </p>

                    {/* VIP Pass / PWA Installation Section */}
                    <AnimatePresence>
                        {!isInstalled && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 relative"
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    Required Step
                                </div>

                                <h2 className="text-lg font-bold mb-4 flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    Activate Your VIP Pass
                                </h2>

                                <p className="text-xs text-zinc-500 mb-6 px-2">
                                    Add MANEKEY to your home screen to unlock all VIP features and get real-time invite notifications.
                                </p>

                                {os === "ios" ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-left text-sm text-zinc-300 bg-black/40 p-3 rounded-xl">
                                            <div className="bg-zinc-800 p-2 rounded-lg">
                                                <Share className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <span>1. Tap "Share" icon on Safari toolbar</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-left text-sm text-zinc-300 bg-black/40 p-3 rounded-xl relative">
                                            <div className="bg-zinc-800 p-2 rounded-lg">
                                                <PlusSquare className="w-5 h-5 text-white" />
                                            </div>
                                            <span>2. Select "Add to Home Screen"</span>
                                            <motion.div
                                                animate={{ y: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-amber-500"
                                            >
                                                <ArrowBigDown className="w-6 h-6" />
                                            </motion.div>
                                        </div>
                                        <div className="pt-8"></div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAndroidInstall}
                                        className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors active:scale-95"
                                    >
                                        <Smartphone className="w-5 h-5" />
                                        <span>Install VIP App</span>
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Direct Link as Fallback */}
                    <Link
                        href="/creator"
                        className="text-zinc-500 text-sm font-medium hover:text-white transition-colors underline underline-offset-4"
                    >
                        Continue to Dashboard without App
                    </Link>
                </motion.div>
            </div>
        </div>

    );
}
