"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, AlertCircle, ArrowRight, Upload, ChevronRight, Globe, Shield } from 'lucide-react';
import { submitCreatorApplication } from '../actions';
import { motion, AnimatePresence } from 'framer-motion';

// 新しく作成した規約コンポーネントをインポート
import TermsOfCuration from './TermsOfCuration';

const VIBE_OPTIONS = [
    'Cinematic', 'Luxury', 'Street', 'Minimal', 'Kawaii',
    'Retro', 'Nature', 'Cyberpunk', 'Traditional', 'Vlog'
];

export function OnboardingForm({ creator }: { creator: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Ticket, 2: Form

    // 画像ファイル自体を保持するStateを追加
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // 古い agreed_to_asset 等を削除
    const [formData, setFormData] = useState({
        portfolio_video_url: creator.portfolio_video_url || creator.scouted_video_url || '',
        avatar_url: creator.avatar_url || '', // 既存のURL、またはローカルプレビュー用
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

    // 変更: アップロードはせず、ローカルでプレビューURLを生成してFileをStateに保存するだけ
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];

        // 簡易的なファイルサイズチェック (例: 5MB以下)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB.');
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setAvatarFile(file); // 送信用にFileを保存
        setFormData({ ...formData, avatar_url: previewUrl }); // プレビュー表示用にURLをセット
        setError('');
    };

    // 変更: TermsOfCuration で「Agree」された時に呼ばれる
    const handleSubmit = async () => {
        setError('');
        if (!formData.real_name || !formData.contact_id || !formData.email || !formData.password) {
            setError('Please fill in all required fields including Account Creation.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
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

            // Fileが選択されていればFormDataに追加してServer Actionに送る
            if (avatarFile) {
                serverFormData.append('avatar_file', avatarFile);
            } else if (formData.avatar_url && !formData.avatar_url.startsWith('blob:')) {
                // 既存のURLがあればそのまま送る
                serverFormData.append('avatar_url', formData.avatar_url);
            }

            await submitCreatorApplication(serverFormData);

            // Routerの遷移等は Server Action 側で redirect() するか、ここで router.push() します

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center"
                    >
                        {/* Apple Wallet Style Ticket */}
                        <div className="w-full max-w-sm aspect-[2/3] relative bg-[#0a0a0a] rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col">
                            {/* Texture/Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/5 via-transparent to-zinc-500/5 pointer-events-none" />
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 blur-[60px] rounded-full pointer-events-none" />

                            {/* Header */}
                            <div className="p-8 border-b border-white/5 flex justify-between items-start z-10">
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase mb-1">Pass Status</p>
                                    <p className="text-xs font-semibold text-white uppercase tracking-tighter">Verified Insider</p>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40">
                                    <Shield size={14} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-8 flex flex-col justify-center space-y-10 z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase">Identity</p>
                                    <h2 className="text-3xl font-playfair italic text-white leading-tight">@{creator.tiktok_handle || 'Creator'}</h2>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase">Access Code</p>
                                    <p className="text-2xl font-mono text-white/90 tracking-tighter">{creator.invite_code}</p>
                                </div>

                                <div className="pt-4">
                                    <div className="flex items-center gap-3 text-zinc-400">
                                        <Globe size={14} className="opacity-50" />
                                        <span className="text-[10px] tracking-widest uppercase font-medium">Tokyo Network</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-8 bg-zinc-900/50 border-t border-white/5 z-10">
                                <p className="text-[9px] text-zinc-600 text-center leading-relaxed">
                                    THIS PASS IS CONFIDENTIAL AND INTENDED ONLY FOR THE RECIPIENT. UNAUTHORIZED SHARING IS PROHIBITED.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="mt-12 group flex flex-col items-center gap-4 transition-all"
                        >
                            <span className="text-sm font-medium tracking-[0.2em] text-white/80 uppercase">Accept the Mission</span>
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                                <ChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-3xl"
                    >
                        <div className="mb-12">
                            <h3 className="text-2xl font-light font-playfair italic text-white mb-2 flex items-center gap-3">
                                Focus Asset
                            </h3>
                            <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">
                                Advertisers will perceive your perspective through this choice.
                            </p>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                        Portfolio URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.portfolio_video_url}
                                        onChange={(e) => setFormData({ ...formData, portfolio_video_url: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all font-mono text-xs placeholder:text-zinc-700"
                                        placeholder="https://www.tiktok.com/@..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                        Perspective / Vibe Shot
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shrink-0 shadow-inner">
                                            {formData.avatar_url ? (
                                                <img src={formData.avatar_url} className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                                    <Upload size={20} />
                                                </div>
                                            )}
                                        </div>

                                        <label className="cursor-pointer group">
                                            <div className="bg-zinc-900 border border-white/5 hover:border-white/20 text-white px-6 py-3 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all">
                                                <Upload size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                                                {avatarFile ? 'Change Best Shot' : 'Upload Best Shot'}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/webp"
                                                onChange={handleImageSelect}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                        Curation Keywords (Max 3)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {VIBE_OPTIONS.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-medium tracking-widest uppercase border transition-all ${formData.vibe_tags.includes(tag)
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-zinc-600 border-white/5 hover:border-white/10 hover:text-zinc-400'
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12 pt-8 border-t border-white/5">
                            <h3 className="text-2xl font-light font-playfair italic text-white mb-2">
                                Connection
                            </h3>
                            <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">
                                Coordination is handled through direct intelligence channels.
                            </p>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                            Signature Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.real_name}
                                            onChange={(e) => setFormData({ ...formData, real_name: e.target.value })}
                                            className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700"
                                            placeholder="Confidential"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                            Nationality
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.nationality}
                                                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                                className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none appearance-none text-sm cursor-pointer"
                                            >
                                                <option value="Japan">Japan 🇯🇵</option>
                                                <option value="USA">USA 🇺🇸</option>
                                                <option value="China">China 🇨🇳</option>
                                                <option value="Korea">Korea 🇰🇷</option>
                                                <option value="Other">Other 🌏</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                                <ChevronRight size={14} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                        Communication Mode
                                    </label>
                                    <div className="flex gap-4">
                                        {['Instagram', 'LINE', 'WhatsApp'].map(app => (
                                            <label key={app} className="flex-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="contact_app"
                                                    value={app}
                                                    checked={formData.contact_app === app}
                                                    onChange={() => setFormData({ ...formData, contact_app: app })}
                                                    className="hidden"
                                                />
                                                <div className={`px-4 py-3 rounded-xl text-[10px] text-center font-medium tracking-widest uppercase border transition-all ${formData.contact_app === app
                                                    ? 'bg-zinc-100 text-black border-zinc-100'
                                                    : 'bg-zinc-900/30 text-zinc-600 border-white/5 hover:border-white/10'
                                                    }`}>
                                                    {app}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.contact_id}
                                        onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700"
                                        placeholder={`${formData.contact_app} Identification`}
                                    />
                                </div>

                                {/* Account Creation Section */}
                                <div className="mt-8 pt-8 border-t border-zinc-900/50">
                                    <h3 className="text-2xl font-light font-playfair italic text-white mb-2">
                                        Account Creation
                                    </h3>
                                    <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">
                                        Access your exclusive dashboard and tracking tools.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                                Email Address (Login ID)
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">
                                                Set Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                required
                                                minLength={6}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700"
                                                placeholder="Min. 6 characters"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 text-red-400 text-[10px] font-medium tracking-wider uppercase mb-8 bg-red-950/20 px-4 py-3 rounded-xl border border-red-900/20">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        {/* 古いチェックボックスとボタンを削除し、TermsOfCuration コンポーネントに置き換え */}
                        {loading ? (
                            <div className="w-full bg-white/10 text-white/50 font-semibold text-sm tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center uppercase">
                                Processing...
                            </div>
                        ) : (
                            <TermsOfCuration onAccept={handleSubmit} />
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}