import { login } from './actions';

// Next.js 15仕様: searchParams は Promise になりました
export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>
}) {
    // パラメータを非同期で展開する
    const params = await searchParams;

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <form className="w-full max-w-sm flex flex-col p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center">MANEKEY Login</h1>

                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                <input
                    className="rounded-md px-4 py-2 bg-gray-100 border mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    name="email"
                    placeholder="you@example.com"
                    required
                />

                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                <input
                    className="rounded-md px-4 py-2 bg-gray-100 border mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />

                <button
                    formAction={login}
                    className="bg-black hover:bg-gray-800 text-white rounded-md px-4 py-2 font-medium transition-colors"
                >
                    Sign In
                </button>

                {/* 認証エラー時のメッセージ表示 */}
                {params?.error && (
                    <p className="mt-4 p-4 bg-red-50 text-red-600 text-sm text-center rounded-md">
                        {params.error}
                    </p>
                )}
            </form>
        </div>
    );
}