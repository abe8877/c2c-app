// src/app/legal/terms/page.tsx
// ※ privacy ページも中身のテキストを変えるだけで同じレイアウトで実装できます。

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans selection:bg-white selection:text-black py-20 px-6">
            <div className="max-w-3xl mx-auto">

                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors mb-12 uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to INSIDERS.
                </Link>

                <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Terms of Service</h1>
                <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mb-12">
                    Last Updated: March 2026
                </p>

                <div className="space-y-12 text-sm font-light leading-relaxed">

                    <section>
                        <h2 className="text-lg font-bold text-white mb-4">1. 適用範囲 (Scope of Application)</h2>
                        <p>
                            本規約は、INSIDERS.（以下「本プラットフォーム」）が提供するすべてのサービスにおける、クリエイターおよび広告主（店舗）の利用条件を定めるものです...
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-4">2. 報酬と支払い (Compensation and Payment)</h2>
                        <p>
                            本プラットフォームにおける報酬は、指定された納品物が承認（Approved）された後、翌月末までに指定の口座へ支払われます...
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-4">3. コンテンツの権利帰属 (Intellectual Property Rights)</h2>
                        <p>
                            納品されたコンテンツの著作権（著作権法第27条および第28条の権利を含む）は、プラットフォームを通じて広告主に譲渡されるものとします...
                        </p>
                    </section>

                    {/* 追加の条項をここに記述 */}

                </div>
            </div>
        </div>
    );
}