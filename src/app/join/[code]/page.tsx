// src/app/join/[code]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { OnboardingPageContent } from './_components/OnboardingPageContent';

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
    const { code: rawCode } = await params;
    const code = decodeURIComponent(rawCode).trim();

    const supabase = await createClient();

    // 1. クリエイター情報の取得
    const { data: creator } = await supabase
        .from('creators')
        .select('id, invite_code, is_onboarded, tiktok_handle, vibe_tags, tier, scouted_video_url, portfolio_video_url, avatar_url')
        .ilike('invite_code', code)
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

    // 2. 保留中(PENDING)のオファー情報と店舗名を取得
    let pendingOffer = null;
    if (creator.id !== 'new-applicant') {
        const { data: assetData } = await supabase
            .from('assets')
            .select('client_tag, offer_price, barter_details')
            .eq('creator_id', creator.id)
            .eq('status', 'PENDING')
            .limit(1)
            .maybeSingle();

        if (assetData) {
            const { data: shopData } = await supabase
                .from('shops')
                .select('name')
                .eq('client_tag', assetData.client_tag)
                .maybeSingle();

            pendingOffer = {
                shop_name: shopData?.name || 'VIP Client',
                offer_price: assetData.offer_price,
                barter_details: assetData.barter_details,
            };
        }
    }

    return (
        <OnboardingPageContent 
            creator={creator} 
            offer={pendingOffer} 
            isApplyMode={false} 
        />
    );
}