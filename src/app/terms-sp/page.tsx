"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SpecifiedCommercialTransactions() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans py-20">
            <div className="max-w-3xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 font-bold text-sm">
                    <ArrowLeft size={16} /> トップページに戻る
                </Link>

                <h1 className="text-4xl font-black tracking-tight mb-12">特定商取引法に基づく表記</h1>

                <div className="border-t border-slate-200">
                    <dl className="divide-y divide-slate-200 text-sm md:text-base">

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">販売事業者名</dt>
                            <dd className="col-span-2 text-slate-600 font-medium">株式会社nots</dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">運営統括責任者</dt>
                            <dd className="col-span-2 text-slate-600 font-medium">阿部脩平</dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">所在地</dt>
                            <dd className="col-span-2 text-slate-600 font-medium leading-relaxed">
                                〒153-0061<br />
                                東京都目黒区中目黒三丁目6番2号 中目黒F・Sビル 5階
                            </dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">連絡先</dt>
                            <dd className="col-span-2 text-slate-600 font-medium leading-relaxed">
                                メールアドレス：info@insiders-hub.jp<br />
                                電話番号：080-4471-1198<br />
                                <span className="text-xs text-slate-400 mt-2 block">
                                    （※サービスに関するお問い合わせは、原則としてメールまたはプラットフォーム内のメッセージにてお願いいたします）
                                </span>
                            </dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">販売価格・役務の対価</dt>
                            <dd className="col-span-2 text-slate-600 font-medium leading-relaxed">
                                システム利用料（月額プラン等）は各プラン購入画面にて明記いたします。また、クリエイターへの業務委託実費（報酬）等が発生する場合は、マッチング成立時に別途明記いたします。
                            </dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">商品代金以外に必要な料金</dt>
                            <dd className="col-span-2 text-slate-600 font-medium leading-relaxed">
                                ・消費税（サイト内の価格表記は特段の定めのない限り税抜または税込を明記します）<br />
                                ・インターネット接続料金、通信料金等（お客様のご負担となります）
                            </dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">支払方法</dt>
                            <dd className="col-span-2 text-slate-600 font-medium leading-relaxed">
                                クレジットカード決済（Stripeを利用）<br />
                                ※一部の法人向けプラン等については、銀行振込（請求書払い）が可能な場合があります。
                            </dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">支払時期</dt>
                            <dd className="col-span-2 text-slate-600 font-medium leading-relaxed space-y-4">
                                <div>
                                    <strong className="block text-slate-900 mb-1">クレジットカード決済の場合：</strong>
                                    ・システム利用料（月額プラン）：初回登録時に決済され、以降は毎月同日に自動更新（決済）されます。<br />
                                    ・クリエイターへの実費等（都度決済）：マッチング成立後、当社が発行する専用決済ページのURLより、指定の期日までにお支払いください。
                                </div>
                                <div>
                                    <strong className="block text-slate-900 mb-1">銀行振込の場合：</strong>
                                    ・当社が発行する請求書に記載の支払期日までにお支払いください。
                                </div>
                            </dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">役務の提供時期</dt>
                            <dd className="col-span-2 text-slate-600 font-medium leading-relaxed space-y-2">
                                <p>・月額プラン：決済完了後、直ちにご利用いただけます。</p>
                                <p>・マッチングサービス：マッチング成立後、広告主とクリエイター間で合意した日程に基づき、クリエイターによる店舗訪問・撮影・SNSへの投稿・成果物（動画データ等）の納品が行われます。納品までの期間は個別契約により異なります。</p>
                            </dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">キャンセル・返金に関する特約</dt>
                            <dd className="col-span-2 text-slate-600 font-medium leading-relaxed space-y-4">
                                <p>1. サービスの性質上、月額プランの決済確定後、およびマッチング成立後（都度決済確定後）の広告主都合によるキャンセルおよび返金は原則としてお受けできません。</p>
                                <p>2. 月額プランの解約は、管理画面（専用ポータル）または所定の連絡先よりお手続きが可能です。次回更新日の前日までに解約手続きが完了した場合、以降の請求は発生いたしません（日割りでの返金は行っておりません）。</p>
                                <p>3. クリエイター手配のための都度決済完了後、マッチングが最終的に不成立となった場合、またはクリエイターの責に帰すべき事由（無断キャンセル、極度な納品遅延等）により役務が提供されなかった場合は、速やかに該当の都度決済分を全額返金いたします。</p>
                            </dd>
                        </div>

                        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
                            <dt className="font-bold text-slate-900">動作環境</dt>
                            <dd className="col-span-2 text-slate-600 font-medium">
                                本サービスは、最新のGoogle Chrome、Safari、Edgeブラウザ環境でのご利用を推奨いたします。
                            </dd>
                        </div>

                    </dl>
                </div>

            </div>
        </div>
    );
}