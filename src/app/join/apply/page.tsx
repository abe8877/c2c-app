// src/app/join/apply/page.tsx
import { OnboardingForm } from '../[code]/_components/OnboardingForm';

export default async function ApplyPage() {
    // 招待状がない応募のパターン：デフォルトのクリエイター情報を渡す
    const defaultCreator = {
        id: 'new-applicant',
        tiktok_handle: 'Creator',
        invite_code: 'apply',
        is_onboarded: false,
        vibe_tags: ['Cinematic'],
        tier: 'B',
        profile_image_url: null,
        scouted_video_url: null
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white font-sans">
            <section className="relative h-[40vh] flex flex-col justify-end p-8 border-b border-white/5">
                <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
                    <p className="text-[10px] tracking-[0.3em] font-medium text-zinc-500 uppercase mb-6">
                        Open Application
                    </p>
                    <h1 className="text-5xl md:text-7xl font-light font-playfair tracking-tight mb-4 italic">
                        Become an <span className="text-white">INSIDER.</span>
                    </h1>
                    <p className="text-sm md:text-base text-zinc-400 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
                        Join our curated community of high-engagement creators.<br />
                        Your perspective matters to the world's finest brands.
                    </p>
                </div>
            </section>

            <section className="max-w-xl mx-auto px-8 py-16">
                <OnboardingForm creator={defaultCreator as any} isApplyMode={true} />
            </section>
        </div>
    );
}
