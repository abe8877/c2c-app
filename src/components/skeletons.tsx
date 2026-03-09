export function SkeletonDashboard() {
    return (
        <div className="min-h-screen bg-zinc-950 flex justify-center">
            <div className="w-full max-w-md bg-black min-h-screen relative border-x border-zinc-900 px-6 pt-12">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center mb-10">
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                        <div className="h-8 w-40 bg-zinc-800 rounded animate-pulse" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse" />
                </div>

                {/* Tier Card Skeleton */}
                <div className="h-48 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-zinc-800 animate-pulse" />
                        <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-10 w-48 bg-zinc-800 rounded animate-pulse" />
                        <div className="h-3 w-40 bg-zinc-800 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between">
                            <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
                            <div className="h-3 w-10 bg-zinc-800 rounded animate-pulse" />
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
                    </div>
                </div>

                {/* Invites Section Skeleton */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-4 overflow-hidden pt-2">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="flex-none w-64 h-80 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-5 flex flex-col justify-end gap-3"
                            >
                                <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                                <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse" />
                                <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
                                <div className="h-10 w-full bg-zinc-800 rounded-lg animate-pulse mt-2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
