// src/app/join/[code]/_components/OnboardingForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Upload, ChevronRight, CheckCircle2, Sparkles, Globe, Eye, EyeOff } from 'lucide-react';
import { submitCreatorApplication } from '../actions';
import TermsOfCuration from './TermsOfCuration';

const VIBE_OPTIONS = [
    'Cinematic', 'Luxury', 'Street', 'Minimal', 'Kawaii',
    'Retro', 'Nature', 'Cyberpunk', 'Traditional', 'Vlog'
];

type Lang = 'en' | 'ja';

const dict = {
    en: {
        reviewTitle: "Application Review",
        reviewDesc: "INSIDERS. adopts a strict curation process. After submission, our team will review your portfolio and contact you with results.",
        pendingOfferCount: "1 Pending Offer",
        offerDetails: "Offer Details",
        accAndAccept: "Unlock & Accept",
        offerAcceptInstruction: "To accept this offer and access your dashboard, please complete the form below to join INSIDERS.",
        provisionalTier: "Provisional Tier",
        evaluatedVibe: "Evaluated Aesthetic",
        underReview: "Under Review",
        inviteNote: "INSIDERS. Curation Team highly evaluates your unique perspective and has issued this private invitation. Complete the registration to unlock your pending offers.",
        applyNote: "After application, the curation team will strictly review your social media accounts. You will be notified via registered contact if approved.",
        displayPreview: "Current Display Preview",
        previewNote: "This is how you appear to advertisers",
        yourProfile: "Your Profile",
        profileDesc: "Advertisers will use this information to understand your strengths and consider making you an offer.",
        portfolioUrl: "Portfolio URL",
        vibeShot: "Perspective / Vibe Shot",
        uploadShot: "Upload Best Shot",
        changeShot: "Change Best Shot",
        keywords: "Curation Keywords (Max 3)",
        region: "Primary Audience Region",
        contactInfo: "Contact Information",
        contactDesc: "Coordination is handled through direct intelligence channels.",
        confidentialNote: "※These information are used only for payments and support. They are strictly protected and never shared with advertisers.",
        realName: "Real Name",
        notifId: "Notification ID (Instagram / LINE etc.)",
        accCreation: "Account Creation",
        accDesc: "Access your exclusive dashboard and tracking tools.",
        email: "Email Address (Login ID)",
        password: "Set Password",
        minChars: "Min. 6 characters",
        processing: "Processing...",
        missingFields: "Please fill in all required fields.",
        shortPassword: "Password must be at least 6 characters.",
        somethingWrong: "Something went wrong.",
        confidential: "Confidential",
        applicantStatus: "Applicant Status",
        curationStatus: "Official Curation Status",
        systemNotice: "System Notice",
        invitationNotFound: "Invitation Not Found",
        returnToApp: "Return to Application"
    },
    ja: {
        reviewTitle: "審査について",
        reviewDesc: "INSIDERS.は厳格な審査制を採用しています。フォーム送信後、キュレーションチームがあなたのポートフォリオを審査し、結果をご連絡いたします。",
        pendingOfferCount: "1件の保留中オファー",
        offerDetails: "オファー詳細",
        accAndAccept: "特典を解放して承諾",
        offerAcceptInstruction: "このオファーを受諾し、専用ダッシュボードにアクセスするには、以下のフォームから本登録を完了してください。",
        provisionalTier: "暫定ティア",
        evaluatedVibe: "審査済み世界観 (VIBE)",
        underReview: "審査中",
        inviteNote: "キュレーションチームはあなたの卓越した世界観を高く評価し、このプライベート招待状を発行しました。登録を完了して特典を解放してください。",
        applyNote: "申請後、キュレーションチームがSNSアカウントを厳査します。承認された場合、登録された連絡先へ通知が届きます。",
        displayPreview: "表示プレビュー",
        previewNote: "※広告主にはこのように表示されます",
        yourProfile: "プロフィール設定",
        profileDesc: "広告主はこれらの情報を見て、あなたの強みを理解し、オファーを検討します。",
        portfolioUrl: "ポートフォリオURL (SNS)",
        vibeShot: "世界観を表す1枚 (Best Shot)",
        uploadShot: "画像をアップロード",
        changeShot: "画像を差し替える",
        keywords: "キュレーションキーワード (最大3つ)",
        region: "メインのリーチ層 (地域)",
        contactInfo: "連絡先情報",
        contactDesc: "案件の進行や連絡は、ダイレクトラインを通じて行われます。",
        confidentialNote: "※これらは報酬支払いやサポートのみに使用されます。運営が厳重に管理し、広告主に公開されることはありません。",
        realName: "氏名（本名）",
        notifId: "連絡用ID (Instagram / LINE等)",
        accCreation: "アカウント作成",
        accDesc: "専用ダッシュボードにアクセスするためのログイン情報を設定してください。",
        email: "メールアドレス (ログインID)",
        password: "パスワード設定",
        minChars: "6文字以上",
        processing: "処理中...",
        missingFields: "必須項目をすべて入力してください。",
        shortPassword: "パスワードは6文字以上で設定してください。",
        somethingWrong: "エラーが発生しました。もう一度お試しください。",
        confidential: "非公開情報",
        applicantStatus: "申請ステータス",
        curationStatus: "公式キュレーションステータス",
        systemNotice: "システム通知",
        invitationNotFound: "招待状が見つかりません",
        returnToApp: "応募ページに戻る"
    }
};

export function OnboardingForm({ 
    creator, 
    offer, 
    isApplyMode = false, 
    initialLang = 'ja' 
}: { 
    creator: any, 
    offer?: any, 
    isApplyMode?: boolean,
    initialLang?: Lang
}) {
    const router = useRouter();
    const [lang, setLang] = useState<Lang>(initialLang);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const t = dict[lang];

    // 親コンポーネントからの言語変更を反映
    useEffect(() => {
        setLang(initialLang);
    }, [initialLang]);

    const [formData, setFormData] = useState({
        portfolio_video_url: (creator.portfolio_video_urls && creator.portfolio_video_urls[0]) || creator.scouted_video_url || '',
        avatar_url: creator.avatar_url || '',
        vibe_tags: creator.vibe_tags || [],
        real_name: '',
        nationality: 'Japan',
        contact_app: 'Instagram',
        contact_id: '',
        email: '',
        password: '',
    });

    const toggleTag = (tag: string) => {
        setFormData(prev => {
            if (prev.vibe_tags.includes(tag)) {
                return { ...prev, vibe_tags: prev.vibe_tags.filter((t: string) => t !== tag) };
            } else {
                if (prev.vibe_tags.length >= 3) return prev;
                return { ...prev, vibe_tags: [...prev.vibe_tags, tag] };
            }
        });
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            setError(lang === 'en' ? 'Image must be less than 5MB.' : '画像サイズは5MB以下にしてください。');
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        setAvatarFile(file);
        setFormData({ ...formData, avatar_url: previewUrl });
        setError('');
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        if (!formData.real_name || !formData.contact_id || !formData.email || !formData.password) {
            setError(t.missingFields);
            return;
        }
        if (formData.password.length < 6) {
            setError(t.shortPassword);
            return;
        }

        setLoading(true);
        try {
            const serverFormData = new FormData();
            serverFormData.append('inviteCode', creator.invite_code);
            serverFormData.append('email', formData.email);
            serverFormData.append('password', formData.password);
            serverFormData.append('portfolio_video_url', formData.portfolio_video_url);
            serverFormData.append('real_name', formData.real_name);
            serverFormData.append('nationality', formData.nationality);
            serverFormData.append('contact_app', formData.contact_app);
            serverFormData.append('contact_id', formData.contact_id);
            serverFormData.append('vibe_tags', JSON.stringify(formData.vibe_tags));

            if (avatarFile) {
                serverFormData.append('avatar_file', avatarFile);
            } else if (formData.avatar_url && !formData.avatar_url.startsWith('blob:')) {
                serverFormData.append('avatar_url', formData.avatar_url);
            }

            const result = await submitCreatorApplication(serverFormData);

            if (result && !result.success) {
                setError(result.error || t.somethingWrong);
                setLoading(false);
                return;
            }
        } catch (err: any) {
            if (err.digest?.startsWith('NEXT_REDIRECT') || err.message?.includes('NEXT_REDIRECT')) {
                throw err;
            }
            console.error(err);
            setError(err.message || t.somethingWrong);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-10 items-stretch relative px-4 pb-20">
            <div className="w-full flex flex-col gap-6">

                {/* Apply Mode: Application Review Message */}
                {isApplyMode && (
                    <div className="w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                <Sparkles size={20} />
                            </div>
                            <h4 className="text-lg font-bold text-white tracking-tight uppercase">{t.reviewTitle}</h4>
                        </div>
                        <p className="text-sm text-zinc-400 font-light leading-relaxed">
                            {t.reviewDesc}
                        </p>
                    </div>
                )}

                {!isApplyMode && creator.id !== 'new-applicant' && offer && (
                    <div className="w-full bg-gradient-to-br from-amber-500/20 via-[#1a1a1a] to-[#0a0a0a] border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

                        <div className="flex items-center gap-4 mb-5 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shrink-0">
                                <span className="text-amber-500 text-2xl animate-pulse">🎁</span>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded inline-block mb-1.5">
                                    {t.pendingOfferCount}
                                </div>
                                <div className="text-lg font-bold text-white tracking-wide leading-tight">{offer.shop_name || (lang === 'en' ? 'VIP Client' : '先行招待クライアント')}</div>
                            </div>
                        </div>

                        <div className="bg-black/60 rounded-2xl p-4 border border-white/5 relative z-10 backdrop-blur-sm">
                            <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">{t.offerDetails}</div>
                            <div className="text-sm font-bold text-amber-400 flex items-center gap-2 leading-relaxed">
                                <Sparkles className="w-4 h-4 shrink-0" />
                                <span>{offer.barter_details} <br className="md:hidden" />＋ {lang === 'en' ? 'Rewards' : '報酬'} (¥{offer.offer_price?.toLocaleString()})</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-3 font-light leading-relaxed">
                                {t.offerAcceptInstruction}
                            </p>
                        </div>
                    </div>
                )}

                {!isApplyMode && (
                    <div className="w-full bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 md:p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

                        <div className="flex justify-between items-center pb-5 border-b border-white/5 mb-6">
                            <div>
                                <p className="text-[10px] tracking-[0.2em] font-medium text-amber-500 uppercase mb-1">
                                    {creator.id === 'new-applicant' ? t.applicantStatus : t.curationStatus}
                                </p>
                                <p className="text-sm font-bold text-white uppercase tracking-wider">
                                    {creator.id === 'new-applicant' ? t.applicantStatus : t.curationStatus}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-500">
                                {creator.id === 'new-applicant' ? <Sparkles size={14} /> : <CheckCircle2 size={14} />}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase">Creator</p>
                                    <p className="text-xl font-playfair italic text-white leading-tight">@{formData.real_name || (creator.tiktok_handle || 'Creator')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase">{t.provisionalTier}</p>
                                    <p className="text-xs font-black text-amber-400 tracking-widest mt-1 uppercase">
                                        {creator.id === 'new-applicant' ? (lang === 'en' ? 'TBD' : '審査中') : (
                                            creator.tier === 'S' ? 'Tier S (Elite)' :
                                                creator.tier === 'A' ? 'Tier A (High)' :
                                                    creator.tier === 'B' ? 'Tier B (Certified)' :
                                                        `Tier ${creator.tier || 'Pending'}`
                                        )}
                                    </p>
                                </div>
                            </div>

                            {creator.id !== 'new-applicant' && (
                                <div className="space-y-2 border-t border-white/5 pt-4">
                                    <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase mb-2">{t.evaluatedVibe}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {creator.vibe_tags?.length > 0 ? (
                                            creator.vibe_tags.map((tag: string) => (
                                                <span key={tag} className="px-2.5 py-1 bg-white/10 border border-white/20 text-white text-[10px] rounded font-bold tracking-wider uppercase">
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-zinc-600 italic">{t.underReview}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className={creator.id === 'new-applicant' ? "" : "bg-white/5 rounded-xl p-4 border border-white/5 mt-2"}>
                                <p className="text-[11px] text-zinc-300 leading-relaxed font-light">
                                    {creator.id === 'new-applicant' ? t.applyNote : (lang === 'en' ? t.inviteNote : <>INSIDERS.キュレーションチームは、あなたの卓越した<span className="text-white font-bold">「{creator.vibe_tags?.[0] || 'Exclusive'}」</span>な世界観を高く評価し、このプライベート招待状を発行しました。<br className="hidden md:block" />以下のフォームを完了して本登録を済ませることで、特典を解放できます。</>)}
                                </p>
                            </div>

                            {/* Current Display Preview */}
                            <div className="pt-6 border-t border-white/5">
                                <p className="text-[10px] tracking-[0.2em] font-medium text-amber-500 uppercase mb-4">{t.displayPreview}</p>
                                <div className="flex justify-center">
                                    <div className="w-[180px] aspect-[9/16] rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 group cursor-default">
                                        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                                            {formData.avatar_url ? (
                                                <img src={formData.avatar_url} className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700" alt="Preview" />
                                            ) : (
                                                <Sparkles className="text-zinc-800 w-8 h-8" />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />

                                        <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1">
                                            {creator.vibe_tags?.[0] && (
                                                <span className="bg-white/20 backdrop-blur-md text-[6px] text-white px-1.5 py-0.5 rounded font-bold border border-white/10 uppercase">
                                                    {creator.vibe_tags[0]}
                                                </span>
                                            )}
                                            <span className="bg-indigo-500/20 backdrop-blur-md text-[6px] text-indigo-400 px-1.5 py-0.5 rounded font-bold border border-indigo-400/30 uppercase">AI RECOMMENDED</span>
                                        </div>

                                        <div className="absolute bottom-3 left-3 z-20 text-left">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <p className="text-[10px] font-black text-white tracking-tight italic">@{formData.real_name || (creator.tiktok_handle || 'Creator')}</p>
                                                <div className="bg-teal-500/20 backdrop-blur-sm border border-teal-400/50 rounded-full px-1 py-0.5 flex items-center gap-0.5">
                                                    <CheckCircle2 size={6} className="text-teal-400" />
                                                    <span className="text-[5px] font-black text-teal-400 uppercase tracking-tighter">Verified</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {formData.vibe_tags.map((tag: string) => (
                                                    <span key={tag} className="text-[5px] text-zinc-400 font-bold">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {formData.portfolio_video_url && (
                                            <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 bg-black/60 transition-opacity pointer-events-none group-hover:opacity-100">
                                                <p className="text-[6px] text-white font-bold tracking-tighter text-center px-4">
                                                    ADVERTISERS WILL SEE YOUR PORTFOLIO VIA:<br />
                                                    <span className="text-amber-400 truncate block w-full">{formData.portfolio_video_url}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[9px] text-zinc-500 text-center mt-3 font-medium">{t.previewNote}</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="flex-1 w-full bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

                <div className="mb-12">
                    <h3 className="text-2xl font-light font-playfair italic text-white mb-2">{t.yourProfile}</h3>
                    <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">{t.profileDesc}</p>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">{t.portfolioUrl}</label>
                            <input
                                type="text"
                                value={formData.portfolio_video_url}
                                onChange={(e) => setFormData({ ...formData, portfolio_video_url: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all font-mono text-xs placeholder:text-zinc-700"
                                placeholder="https://www.tiktok.com/@..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">{t.vibeShot}</label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shrink-0 shadow-inner">
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500" alt="Avatar Preview" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                            <Upload size={20} />
                                        </div>
                                    )}
                                </div>
                                <label className="cursor-pointer group">
                                    <div className="bg-zinc-900 border border-white/5 hover:border-white/20 text-white px-6 py-3 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all">
                                        <Upload size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                                        {avatarFile ? t.changeShot : t.uploadShot}
                                    </div>
                                    <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageSelect} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">{t.keywords}</label>
                            <div className="flex flex-wrap gap-2">
                                {VIBE_OPTIONS.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-medium tracking-widest uppercase border transition-all ${formData.vibe_tags.includes(tag) ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-600 border-white/5 hover:border-white/10 hover:text-zinc-400'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                {t.region}
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.nationality}
                                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none appearance-none text-sm cursor-pointer"
                                >
                                    <option value="Japan">Japan (Domestic)</option>
                                    <option value="Asia">Asia (excl. Japan)</option>
                                    <option value="Middle East">Middle East</option>
                                    <option value="Europe">Europe</option>
                                    <option value="North America">North America</option>
                                    <option value="Latin America">Latin America</option>
                                    <option value="Africa">Africa</option>
                                    <option value="Oceania">Oceania</option>
                                    <option value="Global / Mixed">Global / Mixed</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <ChevronRight size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12 pt-8 border-t border-white/5">
                    <h3 className="text-2xl font-light font-playfair italic text-white mb-2">{t.contactInfo}</h3>
                    <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">
                        {t.contactDesc}<br />
                        <span className="text-amber-500/80 font-medium text-[10px] mt-1 inline-block">
                            {t.confidentialNote}
                        </span>
                    </p>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">{t.realName}</label>
                                <input
                                    type="text"
                                    value={formData.real_name}
                                    onChange={(e) => setFormData({ ...formData, real_name: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700"
                                    placeholder={t.confidential}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">{t.notifId}</label>
                            <input
                                type="text"
                                value={formData.contact_id}
                                onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700"
                                placeholder={lang === 'en' ? 'Contact ID for emergency notification' : '緊急時の連絡用ID'}
                            />
                        </div>

                        <div className="mt-8 pt-8 border-t border-zinc-900/50">
                            <h3 className="text-2xl font-light font-playfair italic text-white mb-2">{t.accCreation}</h3>
                            <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">{t.accDesc}</p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">{t.email}</label>
                                    <input type="email" name="email" autoComplete="username" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700" placeholder="your@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">{t.password}</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password"
                                            autoComplete="new-password"
                                            minLength={6} 
                                            value={formData.password} 
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                            className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 pr-12 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700" 
                                            placeholder={t.minChars} 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 text-red-400 text-[10px] font-medium tracking-wider uppercase mb-8 bg-red-950/20 px-4 py-3 rounded-xl border border-red-900/20">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                {/* Submit & Terms Component */}
                {loading ? (
                    <div className="w-full bg-white/10 text-white/50 font-semibold text-sm tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center uppercase">
                        {t.processing}
                    </div>
                ) : (
                    <TermsOfCuration />
                )}

            </div>
        </form>
    );
}