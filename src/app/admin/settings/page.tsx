"use client";

import React from "react";
import {
    User, Bell, Shield, CreditCard,
    Globe, Database, Mail, Save
} from "lucide-react";

export default function AdminSettings() {
    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
                <p className="text-slate-500">Configure your administration environment and preferences.</p>
            </header>

            <div className="max-w-4xl space-y-6">
                {/* Profile Section */}
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                                <User size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">Admin Profile</h2>
                                <p className="text-xs text-slate-500">Your personal account information</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Edit Profile</button>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                            <input type="text" readOnly value="Admin (Abe)" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                            <input type="email" readOnly value="abe@notts.example.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none" />
                        </div>
                    </div>
                </section>

                {/* Team Management */}
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800">Team & Permissions</h2>
                                <p className="text-xs text-slate-500">Manage your CS and Ops team access</p>
                            </div>
                        </div>
                        <button className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-all">Add Member</button>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-tight border-b border-slate-100">
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Role</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="group">
                                    <td className="py-4 font-bold text-slate-700">Abe (You)</td>
                                    <td className="py-4 text-slate-500 uppercase text-[10px] font-black">Super Admin</td>
                                    <td className="py-4"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">Active</span></td>
                                    <td className="py-4 text-right text-slate-400">-</td>
                                </tr>
                                <tr className="group">
                                    <td className="py-4 font-bold text-slate-700">Takahashi</td>
                                    <td className="py-4 text-slate-500 uppercase text-[10px] font-black">Ops Manager</td>
                                    <td className="py-4"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">Active</span></td>
                                    <td className="py-4 text-right"><button className="text-slate-400 hover:text-red-500 transition">Remove</button></td>
                                </tr>
                                <tr className="group">
                                    <td className="py-4 font-bold text-slate-700">Sato</td>
                                    <td className="py-4 text-slate-500 uppercase text-[10px] font-black">Ops Member</td>
                                    <td className="py-4"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">Active</span></td>
                                    <td className="py-4 text-right"><button className="text-slate-400 hover:text-red-500 transition">Remove</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Notifications & System Section */}
                <div className="grid grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                                <Bell size={20} />
                            </div>
                            <h2 className="font-bold text-slate-800">Alert Notification</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 font-medium">New Ticket Arrival</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 font-medium">Low Stock Warning</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 font-medium">Weekly Analysis Report</span>
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black" />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                <Database size={20} />
                            </div>
                            <h2 className="font-bold text-slate-800">System Integration</h2>
                        </div>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">Google Maps API</span>
                                </div>
                                <span className="text-[10px] text-green-500 font-bold">Connected</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">Postmark (Email)</span>
                                </div>
                                <span className="text-[10px] text-green-500 font-bold">Connected</span>
                            </button>
                        </div>
                    </section>
                </div>

                <div className="pt-4 flex justify-end">
                    <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                        <Save size={18} /> Update All Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
