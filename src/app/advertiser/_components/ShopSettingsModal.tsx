'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight, ChevronLeft, MapPin, Camera, Utensils, Globe, Info, Clock, CheckCircle2 } from 'lucide-react';
import { translateText } from '@/app/actions/translate';

type Step = 'basic' | 'access' | 'inbound' | 'rules' | 'social';

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: '基本情報', icon: <Info className="w-4 h-4" /> },
    { id: 'access', label: 'アクセス・営業', icon: <MapPin className="w-4 h-4" /> },
    { id: 'inbound', label: 'インバウンド・メニュー', icon: <Utensils className="w-4 h-4" /> },
    { id: 'rules', label: '撮影ルール', icon: <Camera className="w-4 h-4" /> },
    { id: 'social', label: 'ソーシャルリンク', icon: <Globe className="w-4 h-4" /> },
];

export default function ShopSettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isTranslating, setIsTranslating] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        // 1. Basic Info
        name: 'WAGYU OMAKASE 凛',
        logo_url: '',
        genre: 'レストラン',
        area: '渋谷・原宿',
        description_en: 'Authentic Wagyu Omakase experience in the heart of Tokyo.',

        // 2. Access & Operations
        hours_en: 'Mon-Sun: 17:00 - 23:00',
        closed_days_en: 'Irregular holidays',
        address_en: '1-2-3 Shibuya, Shibuya-ku, Tokyo',
        access_info_en: '3 minute walk from Shibuya Station Hachiko Exit',
        google_map_url: 'https://maps.google.com/...',

        // 3. Inbound & Menu
        preset_menu_en: 'Premium Wagyu Tasting Course (8 items)',
        dietary_options: [] as string[],
        english_friendly_level: 'Basic',
        reservation_url: 'https://tablecheck.com/...',

        // 4. Shooting Rules
        preferred_shoot_time: 'Anytime',
        preset_request: '顔出し可能 / スタッフ映り込みOK',
        requested_elements: ['看板メニュー', '店内の雰囲気'] as string[],
        shoot_rules_en: 'Please refrain from filming other customers. Flash photography is allowed.',

        // 5. Social Links
        instagram_handle: '@wagyu_rin_tokyo',
        tiktok_handle: '@wagyu_rin',
    });

    const updateField = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleRequestedElement = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            requested_elements: prev.requested_elements.includes(tag) 
                ? prev.requested_elements.filter(t => t !== tag)
                : [...prev.requested_elements, tag]
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
    const handleSave = () => {
        alert("設定を保存しました！");
        onClose();
    };

    const currentStep = STEPS[currentStepIndex].id;

    if (!isOpen) return null;

    // Translation wrapper component
    const AITextField = ({ label, field, placeholder, isTextarea = false }: { label: string, field: keyof typeof formData, placeholder: string, isTextarea?: boolean }) => (
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">{label}</label>
            <div className="relative group">
                {isTextarea ? (
                    <textarea
                        value={formData[field] as string}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black transition shadow-inner font-medium text-sm text-gray-800"
                    />
                ) : (
                    <input
                        type="text"
                        value={formData[field] as string}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black transition shadow-inner font-medium text-sm text-gray-800"
                    />
                )}

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        type="button"
                        onClick={(e) => handleTranslate(field, e)}
                        disabled={isTranslating === field}
                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shadow-sm
                            ${isTranslating === field
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'}`}
                    >
                        {isTranslating === field ? (
                            <>翻訳中 <span className="animate-pulse">...</span></>
                        ) : (
                            <><Sparkles className="w-3 h-3 text-yellow-500" /> 日本語で入力してAI翻訳</>
                        )}
                    </button>
                </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">💡 インバウンド向けに英語での提供が推奨されます。日本語で入力後、ボタンを押すと自動翻訳されます。</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-auto md:max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left Sidebar: Progress Navigation */}
                <div className="md:w-64 bg-stone-900 text-stone-300 shrink-0 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-white font-black text-xl tracking-tight">Profile Settings</h2>
                        <button onClick={onClose} className="md:hidden text-stone-400 hover:text-white transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-2 flex-1 overflow-x-auto md:overflow-visible flex md:flex-col snap-x">
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

                    <div className="flex-1 overflow-y-auto p-8 pt-10 pb-24 space-y-8">
                        <AnimatePresence mode="wait">
                            {currentStep === 'basic' && (
                                <motion.div key="basic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                        <Info className="w-6 h-6 text-blue-500" /> 基本情報 (Basic Info)
                                    </h3>
                                    <p className="text-gray-500 text-sm font-bold">店舗の顔となる情報です。魅力的なプロフィールを作成しましょう。</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-2">店舗名 *</label>
                                            <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-bold" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">ジャンル</label>
                                                <select value={formData.genre} onChange={e => updateField('genre', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none">
                                                    <option>レストラン</option><option>カフェ</option><option>アクティビティ</option><option>美容・サロン</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">エリア</label>
                                                <select value={formData.area} onChange={e => updateField('area', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none">
                                                    <option>渋谷・原宿</option><option>新宿・代々木</option><option>銀座・丸の内</option><option>浅草・上野</option>
                                                </select>
                                            </div>
                                        </div>
                                        <AITextField label="店舗の魅力・コンセプト (英語)" field="description_en" placeholder="例: 厳選された和牛を提供する隠れ家風レストランです" isTextarea />
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
                                            <AITextField label="営業時間 (英語)" field="hours_en" placeholder="例: 月〜金 17:00-23:00" />
                                            <AITextField label="定休日 (英語)" field="closed_days_en" placeholder="例: 不定休" />
                                        </div>
                                        <AITextField label="住所 (英語)" field="address_en" placeholder="例: 東京都渋谷区〇〇" />
                                        <AITextField label="アクセス情報 (英語)" field="access_info_en" placeholder="例: 渋谷駅ハチコウ口から徒歩3分" />

                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-2">Google Map URL</label>
                                            <input type="text" value={formData.google_map_url} onChange={e => updateField('google_map_url', e.target.value)} placeholder="https://maps.google.com/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-medium" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 'inbound' && (
                                <motion.div key="inbound" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                            <Utensils className="w-6 h-6 text-orange-500" /> インバウンド・メニュー設定
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold">※必須項目ではありませんが、クリエイターへの依頼時に簡単に情報共有ができるようになります。</p>
                                    </div>

                                    <div className="space-y-6">
                                        <AITextField label="提供するプリセットメニュー (英語)" field="preset_menu_en" placeholder="例: 特選和牛コース（8品）" />

                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-3">対応可能な食事制限</label>
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">英語対応レベル</label>
                                                <select value={formData.english_friendly_level} onChange={e => updateField('english_friendly_level', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-bold appearance-none">
                                                    <option>Basic (翻訳機など使用)</option><option>Conversational (日常会話程度)</option><option>Advanced (流暢)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">予約サイトURL (インバウンド向け)</label>
                                                <input type="text" value={formData.reservation_url} onChange={e => updateField('reservation_url', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-medium" />
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
                                            <label className="text-sm font-bold text-gray-700 block">撮影で盛り込んでほしい要素</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['看板メニュー', '店内の雰囲気', 'スタッフの接客', '外観・看板', '調理シーン', 'テラス席'].map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => toggleRequestedElement(tag)}
                                                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all duration-200 ${formData.requested_elements.includes(tag) ? 'bg-black text-white border-black shadow-md scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
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
                                                    <option>Lunch</option><option>Dinner</option><option>Anytime</option><option>Off-peak Hours (閑散時間)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-2">顔出し・スタッフ映り込み可否等</label>
                                                <input type="text" value={formData.preset_request} onChange={e => updateField('preset_request', e.target.value)} placeholder="顔出しNGなど" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black text-sm font-medium" />
                                            </div>
                                        </div>
                                        <AITextField label="特別ルール・注意事項 (英語)" field="shoot_rules_en" placeholder="例: 他のお客様の顔が映らないよう配慮をお願いします" isTextarea />
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
                                                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Instagram</label>
                                                <input type="text" value={formData.instagram_handle} onChange={e => updateField('instagram_handle', e.target.value)} placeholder="@your_account" className="w-full bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black font-bold text-gray-900" />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white font-black">
                                                TT
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">TikTok</label>
                                                <input type="text" value={formData.tiktok_handle} onChange={e => updateField('tiktok_handle', e.target.value)} placeholder="@your_account" className="w-full bg-transparent border-b border-gray-300 py-2 outline-none focus:border-black font-bold text-gray-900" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-teal-50 border border-teal-100 rounded-3xl text-center space-y-3">
                                        <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto" />
                                        <div>
                                            <h4 className="font-black text-teal-900">すべての設定が完了しました！</h4>
                                            <p className="text-xs font-bold text-teal-700 mt-1">保存ボタンを押してプロフィールを更新してください。</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:px-6 py-4 flex items-center justify-between" style={{ boxShadow: '0 -10px 30px rgba(0,0,0,0.05)' }}>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevStep}
                                className={`flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition ${currentStepIndex === 0 ? 'invisible' : ''}`}
                            >
                                <ChevronLeft className="w-4 h-4" /> 戻る
                            </button>
                            {currentStepIndex < STEPS.length - 1 && (
                                <button
                                    onClick={nextStep}
                                    className="bg-black text-white px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-stone-800 transition active:scale-95 shadow-sm"
                                >
                                    次へ <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            className="bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-6 py-3 rounded-full text-sm font-black flex items-center gap-2 transition hover:opacity-90 shadow-lg shadow-teal-500/30 active:scale-95 border-2 border-white"
                        >
                            <Sparkles className="w-4 h-4" /> 
                            {currentStepIndex === 0 ? 'このまま保存して公開' : '保存して公開する'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
