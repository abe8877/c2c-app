'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    MapPin,
    Smartphone,
    Instagram,
    Utensils,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Camera,
    TrendingUp,
    Send
} from 'lucide-react';

export default function CreatorJoinLP() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500/30 selection:text-yellow-200 overflow-x-hidden scroll-smooth">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[150px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full" />
                    <span className="text-lg font-bold tracking-tight">MANEKEY</span>
                </div>
                <button className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full border border-white/10 hover:bg-white/5">
                    Creator Login
                </button>
            </nav>

            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden z-10">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold tracking-wide">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                            PREMIUM CREATOR PARTNERSHIP
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05]">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600">
                                Creator Career.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                            Stop chasing generic gigs. MANEKEY connects you with hospitality brands that perfectly match your vibe. From exclusive experiences to paid partnerships, we manage your growth.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 pt-4">
                            <a href="#join">
                                <button className="px-10 py-5 bg-white text-black font-extrabold rounded-2xl hover:bg-yellow-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/10 flex items-center justify-center gap-2">
                                    Apply for Partnership <ArrowRight className="w-5 h-5" />
                                </button>
                            </a>
                            <div className="flex items-center gap-4 px-6 py-4 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="creator" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">120+ Joined</p>
                                    <p className="text-xs text-gray-500">Only Tier-1 creators</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Mockup */}
                    <div className="relative flex justify-center items-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 40, rotate: 0 }}
                            animate={{ opacity: 1, y: 0, rotate: -4 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative group cursor-default"
                        >
                            {/* Glow element */}
                            <div className="absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-[3rem] opacity-50 group-hover:opacity-80 transition-opacity" />

                            {/* Phone Mockup Frame */}
                            <div className="relative w-[280px] sm:w-[320px] aspect-[9/18.5] bg-[#0c0c0c] border-[10px] border-zinc-900 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl z-30" />

                                {/* Inner Screen */}
                                <div className="w-full h-full bg-[#0c0c0c] relative flex flex-col overflow-hidden">
                                    <div className="h-2/5 relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop"
                                            className="w-full h-full object-cover grayscale-[20%] brightness-75 transition-all group-hover:grayscale-0 group-hover:brightness-100"
                                            alt="Aesthetic Cafe"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent" />
                                        <div className="absolute bottom-4 left-6">
                                            <span className="px-2 py-0.5 bg-yellow-500 text-black text-[9px] font-black rounded-sm uppercase mb-1 inline-block">PORTFOLIO ASSET</span>
                                            <h3 className="text-xl font-bold text-white leading-tight">Luxury Cafe Shoot</h3>
                                            <p className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> Omotesando, Tokyo</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-6 space-y-4">
                                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                            <div>
                                                <p className="text-[10px] text-gray-600 uppercase font-black">Offer Level</p>
                                                <p className="text-xs text-white font-medium">Premium Collaboration</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-600 uppercase font-black">Status</p>
                                                <p className="text-xs text-yellow-500 font-bold italic">High Match</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 mb-1">Career Growth</p>
                                            <p className="text-xs text-gray-200 leading-relaxed font-medium">
                                                Building trust leads to high-ticket paid campaigns.
                                            </p>
                                        </div>

                                        <button className="w-full py-4 bg-white/10 hover:bg-yellow-500 hover:text-black text-white font-bold rounded-xl text-xs transition-colors border border-white/10">
                                            View Opportunities
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Feature Section (The 3 Pillars) */}
            <section className="py-32 bg-[#080808] border-y border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter">The 3 Pillars of Growth</h2>
                        <p className="text-gray-500">We don't just provide "free food". We provide the infrastructure for your creative business.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Sparkles className="w-6 h-6" />,
                                step: "01",
                                title: "Smart Vibe Matching",
                                desc: "Our AI analyzes your content style (Vibe) and only connects you with brands that fit your aesthetic. No mismatches."
                            },
                            {
                                icon: <Camera className="w-6 h-6" />,
                                step: "02",
                                title: "Premium Portfolio Building",
                                desc: "Access exclusive locations (Hotels, Fine Dining) that are usually hard to book. Turn these into powerful assets for your portfolio."
                            },
                            {
                                icon: <TrendingUp className="w-6 h-6" />,
                                step: "03",
                                title: "From Barter to Business",
                                desc: "Start with exclusive invitations to build trust, then unlock high-ticket paid offers as a 'Certified Partner'."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="relative p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/5 hover:border-yellow-500/20 transition-all group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <span className="text-8xl font-black text-white/[0.02] leading-none group-hover:text-yellow-500/[0.02] transition-colors">{item.step}</span>
                                </div>
                                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-yellow-500 mb-8 border border-white/5 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 italic uppercase">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Visual Break (Professional Creator vibes) */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-80 rounded-[2rem] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Professional Camera" />
                    </div>
                    <div className="h-80 rounded-[2rem] overflow-hidden md:col-span-1 lg:col-span-1">
                        <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Food Filming" />
                    </div>
                    <div className="h-80 rounded-[2rem] overflow-hidden hidden lg:block">
                        <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Toky Cafe" />
                    </div>
                </div>
            </section>

            {/* 4. Application Form */}
            <section className="py-32 px-6 relative" id="join">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-yellow-500/5 blur-[120px] rounded-full opacity-50 pointer-events-none" />

                <div className="max-w-3xl mx-auto relative">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic underline decoration-yellow-500 decoration-4 underline-offset-8">Apply for Partnership.</h2>
                        <p className="text-gray-500 text-xl font-medium">We are currently curating Tier-1 creators. <br />Submit your profile for review.</p>
                    </div>

                    <form className="space-y-8 bg-[#0c0c0c]/80 backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl relative">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                                <input type="text" className="w-full bg-[#050505] border border-zinc-800 rounded-2xl p-5 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 focus:outline-none transition-all" placeholder="Your name" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <Instagram className="w-4 h-4" /> SNS Handle
                                </label>
                                <input type="text" className="w-full bg-[#050505] border border-zinc-800 rounded-2xl p-5 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 focus:outline-none transition-all" placeholder="@username" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Niche/Genre</label>
                                <select className="w-full bg-[#050505] border border-zinc-800 rounded-2xl p-5 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 focus:outline-none transition-all appearance-none">
                                    <option>Hospitality / Food</option>
                                    <option>Luxury Travel</option>
                                    <option>Lifestyle / Beauty</option>
                                    <option>Tech / Vlog</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Current Base</label>
                                <input type="text" className="w-full bg-[#050505] border border-zinc-800 rounded-2xl p-5 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 focus:outline-none transition-all" placeholder="Tokyo, Japan" />
                            </div>
                        </div>

                        <button className="w-full bg-yellow-500 text-black font-black text-xl py-6 rounded-2xl hover:bg-yellow-400 transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-6 flex justify-center items-center gap-3 italic uppercase">
                            Submit Application <Send className="w-6 h-6" />
                        </button>

                        <p className="text-center text-[10px] text-gray-600 font-bold tracking-tight uppercase flex items-center justify-center gap-2">
                            <ShieldCheck className="w-3 h-3" /> Partnership is subject to manual curation.
                        </p>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer className="py-20 border-t border-white/5 text-center bg-[#050505]">
            <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-5 h-5 bg-yellow-500 rounded-full" />
                <span className="text-sm font-bold tracking-widest uppercase">MANEKEY</span>
            </div>
            <p className="text-gray-600 text-[10px] font-bold tracking-widest uppercase opacity-50">© 2026 MANEKEY Inc. Creator Partnership Division. All Rights Reserved.</p>
        </footer>
    );
}