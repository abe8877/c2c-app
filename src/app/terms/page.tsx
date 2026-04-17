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

                <h1 className="text-4xl font-black tracking-tight mb-12">INSIDERS 利用規約</h1>

                <div className="space-y-10 text-slate-600 leading-relaxed font-medium">
                    <p className="text-sm">
                        この利用規約（以下「本規約」といいます。）は、株式会社nots（以下「当社」といいます。）が提供するプラットフォームサービス「INSIDERS」（以下「本サービス」といいます。）の利用条件、および当社とユーザーとの間の権利義務関係を定めるものです。
                    </p>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第1条（定義）</h2>
                        <p>本規約において使用する用語は、各々以下に定める意味を有します。</p>
                        <ol className="list-decimal pl-5 mt-2 space-y-1">
                            <li>「ユーザー」とは、本サービスを利用する「広告主」および「クリエイター」の総称をいいます。</li>
                            <li>「本業務」とは、広告主がクリエイターに対して依頼する、店舗等への来店、動画撮影、クリエイター自身のSNSアカウントへのPR投稿、および動画データの納品等の業務全般をいいます。</li>
                            <li>「成果物等」とは、本業務に基づきクリエイターが完了させるべき「SNSへの投稿完了（およびその報告）」、および当社システムへ納品する「透かしのない動画データ（MP4形式等）」の総称をいいます。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第2条（契約の性質とコンシェルジュ運用）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li>本サービスは、広告主とクリエイターが本業務の委託・受託を行うためのプラットフォームを提供するものです。当社がマッチング成立を通知した時点で、広告主とクリエイターの間に直接の業務委託契約（以下「個別契約」といいます。）が成立します。</li>
                            <li>当社は個別契約の当事者とはならず、本規約に明示する場合を除き、本業務の履行について法的責任を負いません。</li>
                            <li>プラットフォームの秩序維持およびトラブル防止のため、広告主とクリエイター間の連絡・調整は、原則としてすべて当社事務局（以下「コンシェルジュ」といいます。）を介して行うものとします。ユーザー同士の直接連絡（SNSのDM等による直接交渉）は固く禁止します。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第3条（オファーとマッチングの非保証）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li>広告主は、オファー送信時に本業務の必須要件、撮影条件、およびNG事項を明確に指定するものとします。</li>
                            <li>広告主によるオファー送信は、マッチングの成立を確約するものではありません。クリエイターの意向や表現スタイルとの不一致等により受諾されない場合があることを予め了承するものとします。</li>
                            <li>オファー送信後、一定期間内にマッチングが成立しなかった場合、当社は代替クリエイターの提案等の対応を行います。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第4条（決済と代理受領・対価の性質）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li>本サービスにおける決済は、月額システム利用料（SaaS利用料）と、個別契約成立時に発生する対価（以下「個別契約対価」といいます。）により構成されます。</li>
                            <li><strong>（対価の性質）</strong>個別契約対価は、クリエイターの交通費、機材費、滞在経費、および本業務の遂行に対する報酬を含むものとします。</li>
                            <li><strong>（代理受領）</strong>当社は、クリエイターからの委託を受け、広告主からの個別契約対価を代理受領します。広告主が当社指定の決済リンク等より決済を完了した時点で、クリエイターに対する支払い義務は完了します。</li>
                            <li><strong>（クリエイターへの送金）</strong>当社が受領した金銭は、成果物等の納品および検収完了後、以下の通り送金されます。なお、送金にかかる手数料等は原則としてクリエイターの負担とします。
                                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-500">
                                    <li>日本居住者：原則として投稿月の翌月末日までに銀行振込。</li>
                                    <li>非居住者（外国人等）：原則として納品検収後速やかに、当社指定の決済手段（PayPal等）にて送金。</li>
                                </ul>
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第5条（演出の一任と検収ルール）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li><strong>（表現手法の尊重）</strong>広告主は、クリエイターの独自の世界観、感性、および表現手法を最大限尊重するものとし、原則として事前に絵コンテまたは字コンテの提出を求めることはできないものとします。演出はクリエイターに一任するものとします。</li>
                            <li><strong>（修正の制限）</strong>SNS投稿内容および納品された動画データに対する修正依頼は、オファー送信時に広告主が指定した「必須要件・NG事項」からの明らかな逸脱、または「事実誤認」がある場合に限り、最大2回まで可能とします。クリエイターの主観的表現やクオリティに対する広告主の個人的な嗜好を理由とした修正・リテイクはできません。</li>
                            <li><strong>（みなし検収）</strong>成果物等（SNS投稿の報告および動画データのアップロード）の完了報告後、<strong>120時間（5日間）以内</strong>に広告主から具体的な不備の指摘（修正依頼等の異議申し立て）がない場合、当該成果物等は承認（検収完了）されたものとみなします。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第6条（成果物の権利帰属と二次利用）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li><strong>（権利帰属）</strong>成果物等に関する著作権（著作権法第27条および第28条に定める権利を含みます。）はクリエイターに帰属します。ただし、クリエイターは、本条に定める範囲での利用を広告主および当社に永久的かつ無償で許諾するものとします。</li>
                            <li><strong>（著作者人格権の不行使）</strong>クリエイターは、広告主および当社に対し、本条で認められた範囲内の利用について、著作者人格権（公表権、氏名表示権、同一性保持権）を行使しないものとします。一度納品・公開された成果物等に対するクリエイターからの事後の削除請求・非公開請求には応じません。</li>
                            <li>広告主は、納品された動画データを以下の範囲に限り利用（二次利用）できます。
                                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-500">
                                    <li>自店舗または自社のGoogle Mapsへの掲載</li>
                                    <li>自社の公式SNSアカウントおよび公式Webサイトへの「改変を加えない状態」での掲載</li>
                                </ul>
                            </li>
                            <li><strong>（広告利用等の制限）</strong>広告主は、事前の書面による同意なく、成果物の編集（テロップの追加、カット等）や、運用型広告等の有料広告媒体への利用を行うことはできません。これに違反しトラブルが生じた場合、広告主が自らの責任と費用で解決し、当社を完全に免責するものとします。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第7条（オファーの制限およびアカウント停止）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li>当社は、プラットフォームの品質維持の観点から、広告主によるオファーの内容が以下のいずれかに該当すると判断した場合、事前の通知なく当該オファーの送信を保留、取り消し、または制限することができるものとします。
                                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-500">
                                    <li>クリエイターの表現手法や過去の投稿ジャンルと著しく乖離した、無差別な大量送信（スパム行為）と認められる場合。</li>
                                    <li>個別契約対価や物品または役務の提供（ギフティング等）が、依頼する本業務の負担に対して著しく不当であると当社が判断した場合。</li>
                                    <li>その他、当社がプラットフォームのブランドを著しく毀損すると判断した場合。</li>
                                </ul>
                            </li>
                            <li>広告主が前項の行為を繰り返し行った場合、または本規約に著しく違反した場合、当社は当該広告主のアカウントを直ちに停止し、本サービスの提供を解除することができるものとします。この場合、受領済みのシステム利用料等の返金は一切行いません。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第8条（直接取引の禁止）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li>ユーザーは、本サービスを通じて知り得た相手方に対し、本サービスを介さずに、本業務またはこれに類する業務について直接取引（契約の締結、SNSを通じた直接の依頼等）を打診し、またはこれに応じてはなりません。</li>
                            <li>前項に違反した場合、当社は該当ユーザーのアカウントを即時停止し、違約金として過去1年間の取引額相当額または金50万円のいずれか高い金額を請求できるものとします。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第9条（当社の免責と任意のサポート）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li>当社は、クリエイターの無断キャンセル、遅刻、成果物の品質不備、および納品遅延等について、一切の法的損害賠償義務を負いません。</li>
                            <li>前項にかかわらず、マッチング成立後にクリエイターの責に帰すべき事由により役務が提供されなかった場合、当社は任意の裁量によるビジネス上のサポートとして、受領済み代金（個別契約対価）の全額返金、または代替クリエイターの優先手配を行うものとします。なお、広告主都合によるマッチング成立後のキャンセルおよび返金は一切お受けできません。</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-slate-900 mb-4">第10条（一般条項）</h2>
                        <ol className="list-decimal pl-5 mt-2 space-y-2">
                            <li><strong>（データ利用）</strong>第6条に定める許諾に加え、クリエイターは広告主および当社に対し、当社システムにアップロードされた成果物等を当社のシステム改善・AI学習データとして利用することを永久的かつ無償で許諾したものとみなします。</li>
                            <li><strong>（反社会的勢力の排除）</strong>ユーザーは、自身が反社会的勢力に該当しないことを確約します。</li>
                            <li><strong>（分離可能性）</strong>本規約の一部が無効と判断された場合でも、残りの規定は完全に効力を有します。</li>
                            <li><strong>（準拠法と管轄）</strong>本規約の準拠法は日本法とし、一切の紛争については東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
                        </ol>
                    </section>
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-100 text-sm text-slate-400 font-bold">
                    制定日：2026年4月
                </footer>
            </div>
        </div>
    );
}