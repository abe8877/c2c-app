'use client';

import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { updateSystemSettings } from '@/app/admin/settings/actions';
import EditProfileModal from '@/components/admin/EditProfileModal';
import AddMemberModal from '@/components/admin/AddMemberModal';

interface SettingsClientViewProps {
    displayName: string;
    emailAddress: string;
    children: React.ReactNode;
}

export default function SettingsClientView({
    displayName,
    emailAddress,
    children
}: SettingsClientViewProps) {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdateAll = async () => {
        setIsSaving(true);
        try {
            await updateSystemSettings({ notified: true });
            alert('Settings updated successfully');
        } catch (err) {
            alert('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {/* Header & Profile Section Wrapper */}
            <div className="max-w-4xl space-y-6">
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">Admin Profile</h2>
                                <p className="text-xs text-slate-500">Your personal account information</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditProfileOpen(true)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            Edit Profile
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Display Name</label>
                                <div className="p-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800 font-medium capitalize">
                                    {displayName}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Email Address</label>
                                <div className="p-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800">
                                    {emailAddress}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team & Permissions Section Wrapper (Partially) */}
                <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">Team & Permissions</h2>
                                <p className="text-xs text-slate-500">Manage your CS and Ops team access</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAddMemberOpen(true)}
                            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all"
                        >
                            Add Member
                        </button>
                    </div>
                    {children}
                </section>

                <div className="pt-4 flex justify-end">
                    <button
                        onClick={handleUpdateAll}
                        disabled={isSaving}
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg transition-transform active:scale-95 disabled:bg-slate-400"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Update All Settings
                    </button>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                currentName={displayName}
            />
            <AddMemberModal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
            />
        </>
    );
}
