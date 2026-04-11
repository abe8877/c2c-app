"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans py-20">
            <div className="max-w-3xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-bold text-sm">
                    <ArrowLeft size={16} /> トップページに戻る
                </Link>

                <h1 className="text-4xl font-black tracking-tight mb-12">利用規約</h1>

                <div className="space-y-10 text-slate-600 leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">1. 本規約の適用</h2>
                        <p>
                            この利用規約は、株式会社nots（以下「当社」）が提供する「INSIDERS.」（以下「本サービス」）の利用条件を定めるものです。本サービスを利用する全てのユーザーに適用されます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">2. サービス内容</h2>
                        <p>
                            本サービスは、広告主（以下「ショップ」）とインフルエンサー（以下「クリエイター」）を繋ぐマッチングプラットフォーム、及び動画資産管理ツールを提供します。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">3. コンテンツの権利帰属</h2>
                        <p>
                            本サービスを通じて提供・納品された動画コンテンツの著作権は、特段の合意がない限りクリエイターに帰属します。ただし、ショップは、本規約及び契約の範囲内において、当該動画をGoogleマップ等への掲載、自社広告での利用など、目的の範囲内で自由に二次利用できるものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">4. 禁止事項</h2>
                        <p>
                            ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>虚偽の情報登録</li>
                            <li>マッチング成立後の正当な理由なきキャンセル</li>
                            <li>プラットフォームを介さない直接取引の誘引</li>
                            <li>公序良俗に反するコンテンツの投稿</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">5. 免責事項</h2>
                        <p>
                            当社は、本サービスにおけるショップとクリエイター間のトラブルについて、一切の責任を負いません。当事者間で誠実に解決するものとします。
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
