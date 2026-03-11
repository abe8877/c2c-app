import { updatePassword } from './actions';

export default function UpdatePasswordPage({ searchParams }: { searchParams: { error?: string } }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white selection:bg-zinc-800">
            {/* Subtle Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
            </div>

            <form className="relative z-10 w-full max-w-md p-10 md:p-14 bg-zinc-950 border border-white/5 rounded-[2.5rem] shadow-3xl space-y-12">
                <div className="space-y-4 text-center">
                    <p className="text-[10px] tracking-[0.4em] font-medium text-zinc-500 uppercase">the network</p>
                    <h1 className="text-4xl font-playfair italic font-light tracking-tight">Welcome to INSIDERS.</h1>
                    <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed px-4">
                        招待ありがとうございます。<br />あなた専用のパスワードを設定してください。
                    </p>
                </div>

                <div className="space-y-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block pl-1" htmlFor="password">
                            Private Password
                        </label>
                        <input
                            className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all font-mono text-sm placeholder:text-zinc-800"
                            type="password"
                            name="password"
                            placeholder="......"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        formAction={updatePassword}
                        className="w-full bg-white hover:bg-zinc-200 text-black font-semibold text-sm tracking-[0.2em] py-5 rounded-2xl transition-all uppercase shadow-xl"
                    >
                        Initialize Signature
                    </button>
                </div>

                {searchParams?.error && (
                    <div className="p-4 bg-red-950/20 text-red-400 text-[10px] text-center rounded-xl border border-red-900/20 font-medium tracking-wider uppercase">
                        {searchParams.error}
                    </div>
                )}

                <div className="pt-8 text-center border-t border-white/5">
                    <p className="text-[9px] text-zinc-700 tracking-[0.1em] uppercase font-medium">Verified Curation Infrastructure</p>
                </div>
            </form>
        </div>
    );
}