import { updatePassword } from './actions';

export default function UpdatePasswordPage({ searchParams }: { searchParams: { error?: string } }) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <form className="w-full max-w-sm flex flex-col p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <h1 className="text-2xl font-bold mb-2 text-center">Welcome to MANEKEY</h1>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    招待ありがとうございます。<br />あなた専用のパスワードを設定してください。
                </p>

                <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="password">新しいパスワード</label>
                <input
                    className="rounded-md px-4 py-2 bg-gray-100 border mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    type="password"
                    name="password"
                    placeholder="6文字以上で入力"
                    required
                    minLength={6}
                />

                <button
                    formAction={updatePassword}
                    className="bg-black hover:bg-gray-800 text-white rounded-md px-4 py-2 font-medium transition-colors"
                >
                    設定してダッシュボードへ
                </button>

                {searchParams?.error && (
                    <p className="mt-4 p-4 bg-red-50 text-red-600 text-sm text-center rounded-md">
                        {searchParams.error}
                    </p>
                )}
            </form>
        </div>
    );
}