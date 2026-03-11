import React from "react";
import {
    Bell, CreditCard,
    Globe, Database, Mail
} from "lucide-react";
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';
import RoleSelect from '@/components/admin/RoleSelect';
import SettingsClientView from './_components/SettingsClientView';

export default async function AdminSettings() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // メタデータに名前があればそれを使用し、無ければメールアドレスの @ より前を名前にする
    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Unknown User';
    const emailAddress = user?.email || '';

    // 管理者として全ユーザー情報を取得（名前やメールアドレスを表示するため）
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { users: allUsers } } = await supabaseAdmin.auth.admin.listUsers();

    // DBからメンバーの権限一覧を取得
    const { data: teamRoles } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at');

    // 権限データとユーザー詳細データをマージ
    const teamMembers = teamRoles?.map(role => {
        const userInfo = allUsers.find(u => u.id === role.user_id);
        const name = userInfo?.user_metadata?.display_name || userInfo?.email?.split('@')[0] || 'Unknown User';
        return {
            ...role,
            name,
            email: userInfo?.email || ''
        };
    }) || [];

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
                <p className="text-slate-500">Configure your administration environment and preferences.</p>
            </header>

            <SettingsClientView
                displayName={displayName}
                emailAddress={emailAddress}
            >
                {/* Team & Permissions Table as Children */}
                <div className="space-y-4">
                    <div className="grid grid-cols-4 text-xs font-semibold text-slate-500 border-b pb-2">
                        <div className="col-span-2">USER</div>
                        <div>STATUS</div>
                        <div className="text-right">ROLE ACTION</div>
                    </div>

                    {teamMembers.map((member) => (
                        <div key={member.user_id} className="grid grid-cols-4 items-center py-3 border-b border-slate-50">
                            <div className="col-span-2">
                                <div className="flex flex-col">
                                    <p className="font-medium text-slate-800 text-sm capitalize">
                                        {member.user_id === user?.id ? `${member.name} (You)` : member.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400">{member.email}</p>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium uppercase">
                                    {member.status}
                                </span>
                            </div>
                            <div className="text-right flex justify-end">
                                <RoleSelect
                                    userId={member.user_id}
                                    currentRole={member.role}
                                    isCurrentUser={member.user_id === user?.id}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Notifications & System Section (Passed inside wrapper or beside) */}
                <div className="grid grid-cols-2 gap-6 mt-6">
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
                            <div className="w-full flex items-center justify-between p-2 border border-slate-100 rounded-lg bg-slate-50 transition">
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">Google Maps API</span>
                                </div>
                                <span className="text-[10px] text-green-500 font-bold">Connected</span>
                            </div>
                            <div className="w-full flex items-center justify-between p-2 border border-slate-100 rounded-lg bg-slate-50 transition">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">Postmark (Email)</span>
                                </div>
                                <span className="text-[10px] text-green-500 font-bold">Connected</span>
                            </div>
                        </div>
                    </section>
                </div>
            </SettingsClientView>
        </div>
    );
}
