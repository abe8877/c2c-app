'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowRight,
    Globe,
    Zap,
    Star,
    ChevronDown
} from 'lucide-react';

export default function CreatorJoinLP() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-zinc-800 font-sans">
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-xl font-playfair font-bold tracking-tighter italic">INSIDERS</div>
                    <a href="#apply" className="text-[10px] tracking-[0.2em] font-medium uppercase border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all">
                        Apply Now
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[10px] md:text-xs tracking-[0.4em] font-medium text-zinc-500 uppercase"
                    >
                        Beyond the Buzz
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-8xl font-light font-playfair tracking-tight leading-[1.1]"
                    >
                        Viral is cheap.<br />
                        <span className="italic">Insight is priceless.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-sm md:text-lg text-zinc-400 font-light tracking-wide max-w-xl mx-auto leading-relaxed"
                    >
                        Tourists follow the map. INSIDERS draw it.<br />
                        Apply for the exclusive curation network.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="pt-8"
                    >
                        <a href="#apply" className="group relative inline-flex items-center gap-4 border border-white/20 px-10 py-5 rounded-full hover:border-white transition-all">
                            <span className="text-sm font-medium tracking-[0.2em] uppercase">Apply for INSIDERS</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                    <ChevronDown size={24} />
                </div>
            </header>

            {/* Vision Section */}
            <section className="py-24 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <p className="text-[10px] tracking-[0.3em] font-medium text-zinc-500 uppercase">the philosophy</p>
                            <h2 className="text-4xl font-playfair italic leading-tight">Curation is an Intellectual Act.</h2>
                        </div>
                        <div className="space-y-8 text-zinc-400 font-light leading-relaxed">
                            <p>We believe the world doesn't need more "content." It needs perspective. The hidden path, the silent craft, the story that hasn't been compressed into a 15-second soundbite.</p>
                            <div className="pl-6 border-l border-white/10 space-y-6">
                                <div>
                                    <h4 className="text-white text-sm font-medium mb-1">Authenticity over Algorithm</h4>
                                    <p className="text-xs">Your value isn't measured in likes, but in the depth of your curation.</p>
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium mb-1">Quality over Quantity</h4>
                                    <p className="text-xs">We partner with brands who value legacy over temporary trends.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="aspect-[4/5] bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden grayscale">
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"
                            className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-1000"
                            alt="Luxury workspace"
                        />
                    </div>
                </div>
            </section>

            {/* Features (The Network) */}
            <section className="py-24 bg-zinc-950 px-6">
                <div className="max-w-7xl mx-auto text-center mb-20 space-y-4">
                    <p className="text-[10px] tracking-[0.3em] font-medium text-zinc-500 uppercase">Member Perks</p>
                    <h2 className="text-4xl font-playfair italic">The INSIDERS Advantage</h2>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Priority Access', icon: Zap, desc: 'Early invitations to private curation events and brand launches.' },
                        { title: 'Global Network', icon: Globe, desc: 'Connect with elite creators across Tokyo, Seoul, and New York.' },
                        { title: 'Monetized Vision', icon: Star, desc: 'Premium rates for creators who provide high-value perspectives.' }
                    ].map((feature, i) => (
                        <div key={i} className="group p-10 bg-black border border-white/5 rounded-3xl hover:border-white/20 transition-all">
                            <feature.icon className="text-zinc-500 mb-8 group-hover:text-white transition-colors" size={32} strokeWidth={1} />
                            <h3 className="text-lg font-playfair italic mb-4">{feature.title}</h3>
                            <p className="text-xs text-zinc-500 font-light leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section id="apply" className="py-32 px-6">
                <div className="max-w-3xl mx-auto text-center p-16 bg-white rounded-[3rem] text-black">
                    <h2 className="text-4xl md:text-5xl font-playfair italic mb-8">Ready to define the map?</h2>
                    <p className="text-sm md:text-base font-light mb-12 opacity-70 max-w-md mx-auto">
                        Applications are reviewed on a rolling basis. Quality and unique vision are our primary criteria.
                    </p>
                    <Link
                        href="/join/apply"
                        className="inline-flex items-center gap-4 bg-black text-white px-12 py-5 rounded-full text-sm font-medium tracking-[0.2em] uppercase hover:scale-105 transition-transform"
                    >
                        Begin Application <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-sm font-playfair italic font-bold">INSIDERS</div>
                    <div className="flex gap-8 text-[10px] tracking-widest uppercase font-medium text-zinc-600">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Press</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}