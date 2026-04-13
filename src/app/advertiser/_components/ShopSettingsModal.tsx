'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight, ChevronLeft, MapPin, Camera, Utensils, Globe, Info, Clock, CheckCircle2 } from 'lucide-react';
import { translateText } from '@/app/actions/translate';
import { upsertShop } from '@/app/actions/shop';
import { createClient } from '@/utils/supabase/client';

type Step = 'basic' | 'access' | 'inbound' | 'rules' | 'social';

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: '基本情報', icon: <Info className="w-4 h-4" /> },
    { id: 'access', label: 'アクセス・営業', icon: <MapPin className="w-4 h-4" /> },
    { id: 'inbound', label: 'メニュー情報', icon: <Utensils className="w-4 h-4" /> },
    { id: 'rules', label: '撮影ルール', icon: <Camera className="w-4 h-4" /> },
    { id: 'social', label: 'ソーシャルリンク', icon: <Globe className="w-4 h-4" /> },
];

export default function ShopSettingsModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess?: () => void }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isTranslating, setIsTranslating] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        genre: 'FOOD',
        description_en: '',
        business_hours_en: '',
        closed_days_en: '',
        address_en: '',
        access_info_en: '',
        google_maps_url: '',
        preset_menu_en: '',
        dietary_options: [] as string[],
        english_friendly_level: 'Basic',
        reservation_url: '',
        preferred_shoot_time: 'Lunch',
        shoot_rules_en: '',
        instagram_handle: '',
        tiktok_handle: '',
        requirements: [] as string[],
        preset_request: '',
        updated_at: new Date().toISOString()
    });

    useEffect(() => {
        if (!isOpen) return;

        async function fetchShop() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('shops')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setFormData({
                    name: data.name || '',
                    genre: data.genre || 'FOOD',
                    description_en: data.description_en || '',
                    business_hours_en: data.business_hours_en || '',
                    closed_days_en: data.closed_days_en || '',
                    address_en: data.address_en || '',
                    access_info_en: data.access_info_en || '',
                    google_maps_url: data.google_maps_url || '',
                    preset_menu_en: data.preset_menu_en || '',
                    dietary_options: data.dietary_options || [],
                    english_friendly_level: data.english_friendly_level || 'Basic',
                    reservation_url: data.reservation_url || '',
                    preferred_shoot_time: data.preferred_shoot_time || 'Lunch',
                    shoot_rules_en: data.shoot_rules_en || '',
                    instagram_handle: data.instagram_handle || '',
                    tiktok_handle: data.tiktok_handle || '',
                    requirements: data.requirements || [],
                    preset_request: data.preset_request || '',
                    updated_at: data.updated_at || new Date().toISOString(),
                });
            }
        }
        fetchShop();
    }, [isOpen]);

    const updateField = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleRequirement = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.includes(tag)
                ? prev.requirements.filter(t => t !== tag)
                : [...prev.requirements, tag]
        }));
    };

    const toggleDietaryOption = (option: string) => {
        setFormData(prev => {
            const exists = prev.dietary_options.includes(option);
            return {
                ...prev,
                dietary_options: exists
                    ? prev.dietary_options.filter(o => o !== option)
                    : [...prev.dietary_options, option]
            };
        });
    };

    // AI Translation Widget
    const handleTranslate = async (field: keyof typeof formData, e?: React.MouseEvent) => {
        e?.preventDefault();
        const textToTranslate = formData[field] as string;
        if (!textToTranslate) return;

        setIsTranslating(field);
        try {
            const result = await translateText(textToTranslate);
            if (result.success && result.translatedText) {
                updateField(field, result.translatedText);
            } else {
                alert("翻訳に失敗しました。もう一度お試しください。");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsTranslating(null);
        }
    };

    const nextStep = () => setCurrentStepIndex(i => Math.min(STEPS.length - 1, i + 1));
    const prevStep = () => setCurrentStepIndex(i => Math.max(0, i - 1));
    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async () => {
        if (!formData.name) {
            alert("店舗名は必須です");
            return;
        }

        setIsSaving(true);
        try {
            const res = await upsertShop(formData);
            if (res.success) {
                alert("設定を保存しました！");
                if (onSuccess) onSuccess();
                onClose();
            } else {
                alert("エラー: " + res.error);
            }
        } catch (error) {
            console.error(error);
            alert("保存中に予期せぬエラーが発生しました");
        } finally {
            setIsSaving(false);
        }
    };

    const currentStep = STEPS[currentStepIndex].id;

    if (!isOpen) return null;

    // AI Translation wrapper helper function (returns JSX directly to avoid unmounting)
    const renderAITextField = (label: string, field: keyof typeof formData, placeholder: string, isTextarea = false) => (
        <div className="space-y-3 md:space-y-4 w-full">
            <label className="text-sm font-bold text-gray-700">{label}</label>
            <div className="relative group">
                {isTextarea ? (
                    <textarea
                        value={formData[field] as string}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black transition shadow-inner font-medium text-sm text-gray-800 placeholder:text-stone-300"
                    />
                ) : (
                    <input
                        type="text"
                        value={formData[field] as string}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black transition shadow-inner font-medium text-sm text-gray-800 placeholder:text-stone-300"
                    />
                )}

                <div className={`md:absolute md:top-2 md:right-2 mt-2 md:mt-0 transition-opacity flex justify-end ${isTranslating === field ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
                    <button
                        type="button"
                        onClick={(e) => handleTranslate(field, e)}
                        disabled={isTranslating === field}
                        className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm
                            ${isTranslating === field
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'}`}
                    >
                        {isTranslating === field ? (
                            <>翻訳中<span className="animate-pulse">...</span></>
                        ) : (
                            <><Sparkles className="w-3 h-3 text-yellow-500" /> <span className="md:inline">日本語で入力してAI翻訳</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh] relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left Sidebar: Progress Navigation */}
                <div className="md:w-64 bg-stone-900 text-stone-300 shrink-0 p-4 md:p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-2 md:mb-8">
                        <h2 className="text-white font-black text-lg md:text-xl tracking-tight">Profile Settings</h2>
                        <button onClick={onClose} className="md:hidden text-stone-400 hover:text-white transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4 flex-1 hidden md:flex md:flex-col">
                        {STEPS.map((step, idx) => {
                            const isActive = currentStepIndex === idx;
                            const isPast = currentStepIndex > idx;
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStepIndex(idx)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold shrink-0 snap-start
                                        ${isActive
                                            ? 'bg-stone-800 text-white shadow-inner border border-stone-700/50'
                                            : isPast
                                                ? 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-300'
                                                : 'text-stone-500 hover:bg-stone-800/30'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                                        ${isActive ? 'border-yellow-500 text-yellow-500' : isPast ? 'border-green-500 text-green-500' : 'border-stone-700 bg-stone-800'}`}>
                                        {isPast ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                                    </div>
                                    <span className="hidden md:inline">{step.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="hidden md:block mt-auto text-[10px] text-stone-500 font-bold uppercase tracking-widest">
                        AI Translation Included
                        <Sparkles className="w-3 h-3 inline ml-1 text-yellow-500/50" />
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                    <button onClick={onClose} className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-black transition z-10 p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 md:p-8 md:pt-10 md:pb-24 space-y-5 md:space-y-8 h-full">
                        <AnimatePresence mode="wait">
                            {currentStep === 'basic' && (
                                <motion.div key="basic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                        <Info className="w-6 h-6 text-blue-500" /> 基本情報
                                    </h3>

                                    <div className="space-y-4 md:space-y-6">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-1.5 md:mb-2">店舗名 *</label>
                                            <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="例：SUSHI TOKYO 渋谷店" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-bold placeholder:text-stone-300 transition-all shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-1.5 md:mb-2">カテゴリ *（近いものを選択下さい）</label>
                                            <select value={formData.genre} onChange={e => updateField('genre', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none transition-all shadow-sm">
                                                <option>FOOD</option><option>TRAVEL</option><option>EXPERIENCE</option><option>BEAUTY</option><option>LIFESTYLE SHOP</option>
                                            </select>
                                        </div>
                                        {renderAITextField('コンセプトやイチオシポイント *（英語）', 'description_en', '例：Authentic Edo-mae sushi experience in the heart of Shibuya, perfect for foreign visitors seeking traditional flavors.', true)}
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 'access' && (
                                <motion.div key="access" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                            <MapPin className="w-6 h-6 text-red-500" /> アクセス・営業情報
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold">※必須項目ではありませんが、クリエイターへの依頼時に簡単に情報共有ができるようになります。</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-6">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">営業時間（日本語可）</label>
                                                <input type="text" value={formData.business_hours_en} onChange={e => updateField('business_hours_en', e.target.value)} placeholder="例: Mon-Sun 17:00-23:00" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-medium" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">定休日（日本語可）</label>
                                                <input type="text" value={formData.closed_days_en} onChange={e => updateField('closed_days_en', e.target.value)} placeholder="例: Irregular holidays" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-medium" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-2">住所（日本語可）</label>
                                            <input type="text" value={formData.address_en} onChange={e => updateField('address_en', e.target.value)} placeholder="例: 1-2-3 Shibuya, Shibuya-ku, Tokyo" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-medium" />
                                        </div>
                                        {renderAITextField("アクセス情報（英語）", "access_info_en", "例: 渋谷駅ハチコウ口から徒歩3分")}

                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-2">Google Map URL</label>
                                            <input type="text" value={formData.google_maps_url} onChange={e => updateField('google_maps_url', e.target.value)} placeholder="https://maps.google.com/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-medium" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 'inbound' && (
                                <motion.div key="inbound" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                            <Utensils className="w-6 h-6 text-orange-500" /> メニュー情報
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold">※必須項目ではありませんが、クリエイターへの依頼時に簡単に情報共有ができるようになります。</p>
                                    </div>

                                    <div className="space-y-6">
                                        {renderAITextField("クリエイターに提供するメニュー・サービス (英語)", "preset_menu_en", "例: 特選和牛コース（8品）")}

                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-3">対応可能な食事制限（あれば）</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['Vegan', 'Vegetarian', 'Halal-friendly', 'Gluten-Free', 'Dairy-Free'].map(option => (
                                                    <button
                                                        key={option}
                                                        onClick={() => toggleDietaryOption(option)}
                                                        className={`px-4 py-2 border-2 rounded-xl text-xs font-bold transition-all ${formData.dietary_options.includes(option)
                                                            ? 'bg-black text-white border-black'
                                                            : 'bg-white text-gray-500 hover:border-gray-300 border-gray-200'
                                                            }`}
                                                    >
                                                        {option} {formData.dietary_options.includes(option) && <CheckCircle2 className="w-3 h-3 inline ml-1" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 'rules' && (
                                <motion.div key="rules" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                            <Camera className="w-6 h-6 text-purple-500" /> 撮影ルール・要望設定
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold">※必須項目ではありませんが、クリエイターへの依頼時に簡単に情報共有ができるようになります。</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-700 block">動画に盛り込んでほしい要素</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['看板メニュー', '店内の雰囲気', 'スタッフの接客', '外観・看板', 'アクセス情報', '利用シーン提案'].map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => toggleRequirement(tag)}
                                                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all duration-200 ${formData.requirements.includes(tag) ? 'bg-black text-white border-black shadow-md scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">希望する撮影時間帯</label>
                                                <select value={formData.preferred_shoot_time} onChange={e => updateField('preferred_shoot_time', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none">
                                                    <option>Lunch</option><option>Dinner</option><option>Anytime</option><option>Off-peak Hours（閑散時間）</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">スタッフの映り込み・顔出し可否</label>
                                                <select value={formData.preferred_shoot_time} onChange={e => updateField('preferred_shoot_time', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none">
                                                    <option>OK</option><option>NG</option><option>ASK（応相談）</option>
                                                </select>
                                            </div>
                                        </div>
                                        {renderAITextField("特別ルール・注意事項（英語）", "shoot_rules_en", "例: 他のお客様の顔が映らないよう配慮をお願いします", true)}
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 'social' && (
                                <motion.div key="social" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                            <Globe className="w-6 h-6 text-pink-500" /> ソーシャルリンク設定
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold">※必須項目ではありませんが、クリエイターへの依頼時に簡単に情報共有ができるようになります。</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white font-black">
                                                IG
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-black tracking-widest text-gray-400">Instagram</label>
                                                <input type="text" value={formData.instagram_handle} onChange={e => updateField('instagram_handle', e.target.value)} placeholder="@your_accountname" className="w-full bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black font-bold text-gray-900" />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white font-black">
                                                TT
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-black tracking-widest text-gray-400">TikTok</label>
                                                <input type="text" value={formData.tiktok_handle} onChange={e => updateField('tiktok_handle', e.target.value)} placeholder="@your_accountname" className="w-full bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black font-bold text-gray-900" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 md:px-6 md:py-4 flex items-center justify-between" style={{ boxShadow: '0 -10px 30px rgba(0,0,0,0.05)' }}>
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <button
                                onClick={prevStep}
                                className={`flex items-center gap-1.5 px-2.5 py-2 md:px-3 md:py-2 text-[11px] md:text-sm font-bold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition ${currentStepIndex === 0 ? 'invisible' : ''}`}
                            >
                                <ChevronLeft className="w-4 h-4" /> 戻る
                            </button>
                            {currentStepIndex < STEPS.length - 1 && (
                                <button
                                    onClick={nextStep}
                                    className="bg-black text-white px-3 py-2 md:px-4 md:py-2 rounded-xl text-[11px] md:text-sm font-black flex items-center gap-1.5 md:gap-2 hover:bg-stone-800 transition active:scale-95 shadow-sm"
                                >
                                    次へ <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-full text-[11px] md:text-sm font-black flex items-center gap-1.5 md:gap-2 transition hover:opacity-90 shadow-lg shadow-teal-500/30 active:scale-95 border-2 border-white whitespace-nowrap ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Sparkles className="w-4 h-4" />
                            {isSaving ? '保存中...' : '保存して公開する'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
