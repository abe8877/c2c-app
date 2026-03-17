"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Upload, ChevronRight, Globe, Shield, Sparkles } from 'lucide-react';
import { submitCreatorApplication } from '../actions';
import TermsOfCuration from './TermsOfCuration';

const VIBE_OPTIONS = [
    'Cinematic', 'Luxury', 'Street', 'Minimal', 'Kawaii',
    'Retro', 'Nature', 'Cyberpunk', 'Traditional', 'Vlog'
];

export function OnboardingForm({ creator }: { creator: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        portfolio_video_url: creator.portfolio_video_url || creator.scouted_video_url || '',
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
            setError('Image must be less than 5MB.');
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        setAvatarFile(file);
        setFormData({ ...formData, avatar_url: previewUrl });
        setError('');
    };

    const handleSubmit = async () => {
        setError('');
        if (!formData.real_name || !formData.contact_id || !formData.email || !formData.password) {
            setError('Please fill in all required fields.');
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

            if (avatarFile) {
                serverFormData.append('avatar_file', avatarFile);
            } else if (formData.avatar_url && !formData.avatar_url.startsWith('blob:')) {
                serverFormData.append('avatar_url', formData.avatar_url);
            }

            await submitCreatorApplication(serverFormData);

            // NOTE: ServerAction内でredirect処理を行っている前提
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-10 items-stretch relative px-4 pb-20">
            <div className="w-full flex flex-col gap-6">

                {/* Pending Offer Card */}
                <div className="w-full bg-gradient-to-br from-amber-500/20 via-[#1a1a1a] to-[#0a0a0a] border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

                    <div className="flex items-center gap-4 mb-5 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shrink-0">
                            <span className="text-amber-500 text-2xl animate-pulse">🎁</span>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded inline-block mb-1.5">
                                1 Pending Offer
                            </div>
                            <div className="text-lg font-bold text-white tracking-wide leading-tight">WAGYU OMAKASE 凛</div>
                        </div>
                    </div>

                    <div className="bg-black/60 rounded-2xl p-4 border border-white/5 relative z-10 backdrop-blur-sm">
                        <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Offer Details</div>
                        <div className="text-sm font-bold text-amber-400 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> 無料ご招待 ＋ 報酬 (¥50,000)
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 font-light leading-relaxed">
                            このオファーを受諾し、専用ダッシュボードにアクセスするには、以下のフォームを完了してINSIDERS.へ参加してください。
                        </p>
                    </div>
                </div>

                {/* Identity / Ticket Info */}
                <div className="w-full bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 flex flex-col gap-6">
                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                        <div>
                            <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase mb-1">Pass Status</p>
                            <p className="text-xs font-semibold text-white uppercase tracking-tighter">Verified Insider</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40">
                            <Shield size={14} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase">Identity</p>
                        <h2 className="text-2xl font-playfair italic text-white leading-tight">@{creator.tiktok_handle || 'Creator'}</h2>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] tracking-[0.2em] font-medium text-zinc-500 uppercase">Access Code</p>
                        <p className="text-xl font-mono text-white/90 tracking-tighter">{creator.invite_code}</p>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 pt-2">
                        <Globe size={14} className="opacity-50" />
                        <span className="text-[10px] tracking-widest uppercase font-medium">Tokyo Network</span>
                    </div>
                </div>

            </div>

            {/* ========================================================
                RIGHT COLUMN: Form Entry 
            ======================================================== */}
            <div className="flex-1 w-full bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

                <div className="mb-12">
                    <h3 className="text-2xl font-light font-playfair italic text-white mb-2">Focus Asset</h3>
                    <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">Advertisers will perceive your perspective through this choice.</p>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">Portfolio URL</label>
                            <input
                                type="text"
                                value={formData.portfolio_video_url}
                                onChange={(e) => setFormData({ ...formData, portfolio_video_url: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all font-mono text-xs placeholder:text-zinc-700"
                                placeholder="https://www.tiktok.com/@..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">Perspective / Vibe Shot</label>
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
                                        {avatarFile ? 'Change Best Shot' : 'Upload Best Shot'}
                                    </div>
                                    <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageSelect} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">Curation Keywords (Max 3)</label>
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
                    </div>
                </div>

                <div className="mb-12 pt-8 border-t border-white/5">
                    <h3 className="text-2xl font-light font-playfair italic text-white mb-2">Connection</h3>
                    <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">Coordination is handled through direct intelligence channels.</p>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">Signature Name</label>
                                <input
                                    type="text"
                                    value={formData.real_name}
                                    onChange={(e) => setFormData({ ...formData, real_name: e.target.value })}
                                    className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700"
                                    placeholder="Confidential"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">Nationality</label>
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
                            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">Communication Mode</label>
                            <div className="flex gap-4">
                                {['Instagram', 'LINE', 'WhatsApp'].map(app => (
                                    <label key={app} className="flex-1 cursor-pointer">
                                        <input type="radio" name="contact_app" value={app} checked={formData.contact_app === app} onChange={() => setFormData({ ...formData, contact_app: app })} className="hidden" />
                                        <div className={`px-4 py-3 rounded-xl text-[10px] text-center font-medium tracking-widest uppercase border transition-all ${formData.contact_app === app ? 'bg-zinc-100 text-black border-zinc-100' : 'bg-zinc-900/30 text-zinc-600 border-white/5 hover:border-white/10'}`}>
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

                        <div className="mt-8 pt-8 border-t border-zinc-900/50">
                            <h3 className="text-2xl font-light font-playfair italic text-white mb-2">Account Creation</h3>
                            <p className="text-xs text-zinc-500 tracking-wide font-light mb-8">Access your exclusive dashboard and tracking tools.</p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">Email Address (Login ID)</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700" placeholder="your@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em] block">Set Password</label>
                                    <input type="password" minLength={6} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-zinc-900/50 border border-white/5 text-white rounded-xl px-4 py-4 focus:border-white focus:outline-none transition-all text-sm placeholder:text-zinc-700" placeholder="Min. 6 characters" />
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
                        Processing...
                    </div>
                ) : (
                    <TermsOfCuration onAccept={handleSubmit} />
                )}

            </div>
        </div>
    );
}