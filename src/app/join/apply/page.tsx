// src/app/join/apply/page.tsx
import { OnboardingPageContent } from '../[code]/_components/OnboardingPageContent';

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
        <OnboardingPageContent 
            creator={defaultCreator as any} 
            isApplyMode={true} 
        />
    );
}
