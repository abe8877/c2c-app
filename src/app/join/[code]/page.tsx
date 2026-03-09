// src/app/join/[code]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { OnboardingForm } from './_components/OnboardingForm';

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
    const { code: rawCode } = await params;
    const code = decodeURIComponent(rawCode).trim(); // URLデコードと空白除去

    console.log("--------------------------------------------------");
    console.log("🔍 [Debug] Join Page Accessed");
    console.log(`👉 Raw Params: ${rawCode}`);
    console.log(`👉 Processed Code: '${code}'`);

    const supabase = await createClient();

    // 1. まず全件取得して接続確認（1件だけ取る）
    const { data: checkData, error: checkError } = await supabase.from('creators').select('id').limit(1);
    if (checkError) {
        console.error("❌ [Fatal] DB Connection Failed:", checkError.message);
        return <div>Error: Database connection failed. Check server logs.</div>;
    }
    console.log("✅ [Debug] DB Connection OK. Rows available:", checkData?.length ?? 0);

    // 2. 本命の検索
    const { data: creator, error } = await supabase
        .from('creators')
        .select('*')
        .eq('invite_code', code) // 完全一致検索
        .single();

    if (error) {
        console.error("❌ [Debug] Query Error:", error.message, error.details);

        // ヒント: 似たコードがあるか探す（デバッグ用）
        const { data: similar } = await supabase.from('creators').select('invite_code').ilike('invite_code', `%${code}%`);
        if (similar && similar.length > 0) {
            console.log("💡 [Hint] Did you mean one of these?", similar);
        }
    }

    if (creator) {
        console.log(`✅ [Debug] Creator Found: ${creator.name} (ID: ${creator.id})`);
    } else {
        console.log("⚠️ [Debug] Creator NOT found.");
    }
    console.log("--------------------------------------------------");

    if (!creator) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-neutral-900 p-8 rounded-2xl border border-red-900/50">
                    <h1 className="text-xl font-bold text-red-500 mb-4">Invitation Not Found</h1>
                    <p className="text-gray-400 mb-4">The code <strong>'{code}'</strong> is invalid or expired.</p>
                    <p className="text-xs text-gray-600 font-mono">Debug: Check terminal for details.</p>
                </div>
            </div>
        );
    }

    if (creator.is_onboarded) {
        redirect('/dashboard');
    }

    // データが見つかったら表示
    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black">
            <section className="relative h-[60vh] flex flex-col justify-end p-8 border-b border-white/10">
                <div className="absolute inset-0 opacity-40 overflow-hidden pointer-events-none">
                    {/* 動画があれば表示、なければ画像 */}
                    {creator.scouted_video_url ? (
                        <video src={creator.scouted_video_url} className="w-full h-full object-cover grayscale" muted autoPlay loop playsInline />
                    ) : (
                        <img src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale" />
                    )}
                </div>

                <div className="relative z-10 max-w-2xl mx-auto w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                        ✨ Scouted for {creator.genre || 'You'}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                        Hi, @{creator.tiktok_handle}
                    </h1>
                    <p className="text-xl text-gray-300 font-light">
                        We discovered your unique vibe via this video. <br />
                        Top brands in Tokyo are waiting for <span className="text-white font-bold underline decoration-yellow-400">{creator.vibe_tags?.[0] || 'Talented'}</span> creators like you.
                    </p>
                </div>
            </section>

            <section className="max-w-2xl mx-auto px-8 py-12">
                <OnboardingForm creator={creator} />
            </section>
        </div>
    );
}