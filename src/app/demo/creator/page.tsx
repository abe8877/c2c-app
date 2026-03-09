// src/app/demo/creator/page.tsx
import CreatorDashboardContent from "./CreatorDashboardContent";
// import { createClient } from "@/utils/supabase/server"; // 実装時にコメントアウト解除

export default async function CreatorDashboard() {
    // -----------------------------
    // Data Fetching (Server Side)
    // -----------------------------
    // 本来は Supabase から取得しますが、一旦モックデータをここで定義して渡します
    // const supabase = await createClient();
    // const { data: profile } = await supabase.from('creators').select('*').single();

    const creatorData = {
        name: "Elena Tokyo",
        tier: "Tier S",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
        assetsGenerated: 12,
        nextMilestone: 15,
    };

    const exclusiveInvites = [
        {
            id: "shop_1",
            name: "WAGYU OMAKASE 凛",
            genre: "Fine Dining",
            vibe: "Elegant & Traditional",
            thumbnail: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=500&q=80",
        },
        {
            id: "shop_2",
            name: "TOKYO NEON BAR",
            genre: "Nightlife",
            vibe: "Cyberpunk & Edgy",
            thumbnail: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=500&q=80",
        },
    ];

    return (
        <CreatorDashboardContent
            creatorData={creatorData}
            exclusiveInvites={exclusiveInvites}
        />
    );
}