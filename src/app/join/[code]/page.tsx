// src/app/join/[code]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { OnboardingForm } from './_components/OnboardingForm';

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
    const { code: rawCode } = await params;
    const code = decodeURIComponent(rawCode).trim(); // URLデコードと空白除去

    const supabase = await createClient();

    const { data: creator } = await supabase
        .from('creators')
        .select('*')
        .eq('invite_code', code)
        .single();

    if (!creator) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-zinc-800">
                <div className="max-w-md w-full bg-zinc-950 p-10 rounded-[2.5rem] border border-white/5 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-[10px] tracking-[0.4em] font-medium text-zinc-600 uppercase">System Notice</p>
                        <h1 className="text-3xl font-playfair italic font-light tracking-tight text-white">Invitation Not Found</h1>
                    </div>
                    <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed">
                        The access code <strong className="text-zinc-300">'{code}'</strong> is invalid, expired, or has already been utilized.
                    </p>
                    <div className="pt-6 border-t border-white/5">
                        <a href="/join" className="text-[10px] tracking-[0.2em] font-medium uppercase text-zinc-400 hover:text-white transition-colors">
                            Return to Application
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (creator.is_onboarded) {
        redirect('/dashboard');
    }

    // データが見つかったら表示
    return (
        <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white font-sans">
            <section className="relative h-[50vh] flex flex-col justify-end p-8 border-b border-white/5">
                <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
                    {/* 動画があれば表示、なければ画像 */}
                    {creator.scouted_video_url ? (
                        <video src={creator.scouted_video_url} className="w-full h-full object-cover grayscale brightness-50" muted autoPlay loop playsInline />
                    ) : (
                        <img src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale brightness-50" />
                    )}
                </div>

                <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
                    <p className="text-[10px] tracking-[0.3em] font-medium text-zinc-500 uppercase mb-6">
                        Confidential Invitation
                    </p>
                    <h1 className="text-5xl md:text-7xl font-light font-playfair tracking-tight mb-4">
                        Welcome, <span className="italic">@{creator.tiktok_handle}</span>
                    </h1>
                    <p className="text-sm md:text-base text-zinc-400 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
                        We discovered your perspective via your unique vision. <br />
                        Selected brands in Tokyo are seeking <span className="text-white font-medium border-b border-zinc-700 pb-0.5">{creator.vibe_tags?.[0] || 'Exclusive'}</span> creators of your caliber.
                    </p>
                </div>
            </section>

            <section className="max-w-xl mx-auto px-8 py-16">
                <OnboardingForm creator={creator} />
            </section>
        </div>
    );
}