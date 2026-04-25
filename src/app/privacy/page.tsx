"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans py-20">
            <div className="max-w-3xl mx-auto px-6">
                <Link href="/#footer" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-bold text-sm">
                    <ArrowLeft size={16} /> トップページに戻る
                </Link>

                <h1 className="text-3xl font-black tracking-tight mb-12">プライバシーポリシー</h1>

                <div className="space-y-10 text-slate-600 leading-relaxed font-medium text-sm">

                    <p>
                        株式会社nots（以下「当社」といいます。）は、プラットフォームサービス「INSIDERS」（以下「本サービス」といいます。）の提供において、ユーザー（広告主およびアンバサダーを含みます。）の個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
                    </p>

                    <section>
                        <h2 className="font-black text-slate-900 mb-4">1. 取得する情報</h2>
                        <p>
                            当社は、本サービスの提供にあたり、以下の情報を取得する場合があります。
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>登録情報:</strong> 氏名、法人名、メールアドレス、電話番号、SNSアカウント情報、店舗情報など</li>
                            <li><strong>取引情報:</strong> 本サービスを通じて行われたマッチング履歴、メッセージ内容、成果物データなど</li>
                            <li><strong>決済情報:</strong> クレジットカード決済や銀行振込に関連する取引情報</li>
                            <li><strong>端末・利用履歴情報:</strong> IPアドレス、Cookie、ブラウザ情報、アクセスログなど</li>
                        </ul>
                        <p className="mt-4 text-sm text-slate-600">
                            なお、クレジットカード決済における個別のカード番号およびセキュリティコード等の信用情報は、当社が提携する決済代行事業者が直接取得・管理するものであり、当社のシステム上には一切保持されません。
                        </p>
                    </section>

                    <section>
                        <h2 className="font-black text-slate-900 mb-4">2. 利用目的</h2>
                        <p>
                            収集した情報は、以下の目的で利用されます。
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>本サービスの提供、運営、およびユーザーサポートのため</li>
                            <li>広告主とアンバサダー間のマッチング、取引の円滑な進行、および代金決済（代理受領・送金）のため</li>
                            <li>ユーザーの本人確認および不正利用の防止のため</li>
                            <li>本サービスの維持、システム改善、および当社が提供する新たなサービスの調査・研究・開発のため。ならびに、各種データの分析、およびAI（人工知能）技術・機械学習モデルの研究・開発・学習・精度向上のため</li>
                            <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-black text-slate-900 mb-4">3. 第三者への情報提供および共有</h2>
                        <p>
                            1. 当社は、原則として、あらかじめユーザーの同意を得ることなく、個人情報を第三者に提供することはありません。ただし、次に掲げる法令に基づく例外事由に該当する場合はこの限りではありません。
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 mb-4">
                            <li>法令に基づく場合</li>
                            <li>人の生命、身体または財産の保護のために必要がある場合</li>
                            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                            <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
                            <li>合併、会社分割、事業譲渡その他の事由により事業の承継が行われる場合</li>
                        </ul>
                        <p>
                            2. 前項の定めに拘わらず、本サービスの目的である「広告主とアンバサダーとのマッチング」を円滑に遂行するため、ユーザーは、プロフィール情報、店舗情報、取引条件等の必要最小限の情報が、本サービス上において取引の相手方に共有されることに予め同意するものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="font-black text-slate-900 mb-4">4. 個人情報の開示・訂正・利用停止等</h2>
                        <p>
                            当社は、本人から個人情報の開示、訂正、追加、削除、利用停止等のお申し出があった場合には、所定の手続きに基づき、本人であることを確認のうえで対応いたします。ただし、法令により当社がこれらの義務を負わない場合は、この限りではありません。
                        </p>
                    </section>

                    <section>
                        <h2 className="font-black text-slate-900 mb-4">5. Cookie（クッキー）等の利用について</h2>
                        <p>
                            本サービスでは、利用状況の分析や広告配信、利便性向上のために、Cookieおよび類似技術を利用する場合があります。ユーザーはブラウザの設定によりCookieを無効にすることができますが、その場合、本サービスの一部機能が利用できなくなる可能性があります。
                        </p>
                    </section>

                    <section>
                        <h2 className="font-black text-slate-900 mb-4">6. プライバシーポリシーの変更</h2>
                        <p>
                            当社は、法令の改正や事業上の必要性に応じて、本ポリシーを事前の予告なく変更することがあります。変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="font-black text-slate-900 mb-4">7. お問い合わせ窓口</h2>
                        <p>
                            本ポリシーに関するお問い合わせ、個人情報の取扱いに関するご相談は、以下の窓口までお願いいたします。<br /><br />
                            株式会社nots　INSIDERS.個人情報お問い合わせ窓口<br />
                            メールアドレス：info@insiders-hub.jp
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
