"use client";

import { useState } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Play, Check, AlertCircle, ArrowRight, Instagram, Video, Upload } from 'lucide-react';

const VIBE_OPTIONS = [
    'Cinematic', 'Luxury', 'Street', 'Minimal', 'Kawaii',
    'Retro', 'Nature', 'Cyberpunk', 'Traditional', 'Vlog'
];

export function OnboardingForm({ creator }: { creator: any }) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        portfolio_video_url: creator.portfolio_video_url || creator.scouted_video_url,
        avatar_url: creator.avatar_url || '',
        vibe_tags: creator.vibe_tags || [],
        real_name: '',
        nationality: 'Japan',
        contact_app: 'Instagram',
        contact_id: '',
        agreed_to_asset: false,
        agreed_to_noshow: false,
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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${creator.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData({ ...formData, avatar_url: publicUrl });
        } catch (error) {
            alert('Error uploading image!');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        setError('');
        if (!formData.real_name || !formData.contact_id) {
            setError('Please fill in your Name and Contact ID.');
            return;
        }
        if (!formData.agreed_to_asset || !formData.agreed_to_noshow) {
            setError('You must agree to the Partner Terms to join.');
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase
                .from('creators')
                .update({
                    portfolio_video_url: formData.portfolio_video_url,
                    avatar_url: formData.avatar_url,
                    vibe_tags: formData.vibe_tags,
                    real_name: formData.real_name,
                    nationality: formData.nationality,
                    contact_app: formData.contact_app,
                    contact_id: formData.contact_id,
                    agreed_to_terms: true,
                    is_onboarded: true,
                    status: 'onboarded',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', creator.id);

            if (updateError) throw updateError;
            router.push('/dashboard?welcome=true');
        } catch (err: any) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
            <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Video className="text-yellow-400" size={20} />
                    Your Best Asset
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    Advertisers will see this video first. Is this your best work?
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                            Portfolio Video URL
                        </label>
                        <input
                            type="text"
                            value={formData.portfolio_video_url}
                            onChange={(e) => setFormData({ ...formData, portfolio_video_url: e.target.value })}
                            className="w-full bg-black/50 border border-white/20 text-white rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors font-mono text-sm"
                            placeholder="https://www.tiktok.com/@..."
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                            Profile / Vibe Photo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 bg-black/50 shrink-0">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        No Img
                                    </div>
                                )}
                            </div>

                            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                                <Upload size={16} />
                                {uploading ? 'Uploading...' : 'Upload Best Shot'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">
                            *This will be shown to advertisers. Choose a photo that represents your style.
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                            Refine Your Vibe (Max 3)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {VIBE_OPTIONS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${formData.vibe_tags.includes(tag)
                                        ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]'
                                        : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Instagram className="text-yellow-400" size={20} />
                    Contact Info
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    We coordinate dates via Chat, not Email.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                            Real Name (Private)
                        </label>
                        <input
                            type="text"
                            value={formData.real_name}
                            onChange={(e) => setFormData({ ...formData, real_name: e.target.value })}
                            className="w-full bg-black/50 border border-white/20 text-white rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                            placeholder="Used for reservations"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                            Nationality
                        </label>
                        <select
                            value={formData.nationality}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                            className="w-full bg-black/50 border border-white/20 text-white rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none appearance-none"
                        >
                            <option value="Japan">Japan 🇯🇵</option>
                            <option value="USA">USA 🇺🇸</option>
                            <option value="China">China 🇨🇳</option>
                            <option value="Korea">Korea 🇰🇷</option>
                            <option value="Other">Other 🌏</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                        Preferred Messenger
                    </label>
                    <div className="flex gap-4 mb-2">
                        {['Instagram', 'LINE', 'WhatsApp'].map(app => (
                            <label key={app} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="contact_app"
                                    value={app}
                                    checked={formData.contact_app === app}
                                    onChange={() => setFormData({ ...formData, contact_app: app })}
                                    className="hidden"
                                />
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${formData.contact_app === app
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black/30 text-gray-500 border-white/10'
                                    }`}>
                                    {app}
                                </span>
                            </label>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={formData.contact_id}
                        onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                        className="w-full bg-black/50 border border-white/20 text-white rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none"
                        placeholder={`Your ${formData.contact_app} ID or Handle`}
                    />
                </div>
            </div>

            <div className="mb-10 p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Partner Agreement</h3>

                <label className="flex gap-4 cursor-pointer mb-6 group">
                    <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${formData.agreed_to_asset ? 'bg-yellow-400 border-yellow-400' : 'border-gray-500 group-hover:border-white'}`}>
                        {formData.agreed_to_asset && <Check size={16} className="text-black" />}
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.agreed_to_asset}
                        onChange={(e) => setFormData({ ...formData, agreed_to_asset: e.target.checked })}
                    />
                    <div>
                        <div className="text-white font-bold text-sm mb-1">
                            Allow "Official Asset" Usage
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            I grant permission for the Merchant to feature my content on their <span className="text-white font-medium">Official Google Maps & Website</span>.
                        </p>
                    </div>
                </label>

                <label className="flex gap-4 cursor-pointer group">
                    <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${formData.agreed_to_noshow ? 'bg-yellow-400 border-yellow-400' : 'border-gray-500 group-hover:border-white'}`}>
                        {formData.agreed_to_noshow && <Check size={16} className="text-black" />}
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.agreed_to_noshow}
                        onChange={(e) => setFormData({ ...formData, agreed_to_noshow: e.target.checked })}
                    />
                    <div>
                        <div className="text-white font-bold text-sm mb-1">
                            No "No-Show" Policy
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            I understand that a confirmed seat is reserved for me. Cancellation within 24h or No-Show will result in a ban.
                        </p>
                    </div>
                </label>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all flex items-center justify-center gap-2 group"
            >
                {loading ? 'Activating...' : (
                    <>
                        ACTIVATE PARTNERSHIP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </div>
    );
}