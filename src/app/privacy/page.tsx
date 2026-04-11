"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans py-20">
            <div className="max-w-3xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-bold text-sm">
                    <ArrowLeft size={16} /> トップページに戻る
                </Link>

                <h1 className="text-4xl font-black tracking-tight mb-12">プライバシーポリシー</h1>

                <div className="space-y-10 text-slate-600 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">1. 個人情報の収集項目</h2>
                        <p>
                            当社は、本サービスの提供にあたり、以下の個人情報を収集する場合があります。
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>氏名、メールアドレス、電話番号等の連絡先情報</li>
                            <li>SNSアカウント情報（プロフィール、連携データ等）</li>
                            <li>店舗情報（住所、写真、ビジネス情報等）</li>
                            <li>クッキー及びアクセスログ</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">2. 利用目的</h2>
                        <p>
                            収集した情報は、以下の目的で利用されます。
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>本サービスの提供及び運営</li>
                            <li>マッチングエンジンの精度向上及び分析</li>
                            <li>お客様からのお問い合わせ対応</li>
                            <li>新機能、キャンペーンのご案内</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">3. 第三者提供について</h2>
                        <p>
                            当社は、法令に基づく場合を除き、あらかじめご本人の同意を得ることなく、個人情報を第三者に提供することはありません。ただし、マッチングの成立を目的として、広告主とクリエイター間で必要な情報を共有する場合があります。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">4. 安全管理措置</h2>
                        <p>
                            当社は、個人情報の漏洩、滅失、または毀損の防止その他の個人情報の安全管理のために、必要かつ適切な措置を講じます。
                        </p>
                    </section>
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-100 text-sm text-slate-400 font-bold">
                    最終更新日：2026年4月
                </footer>
            </div>
        </div>
    );
}
