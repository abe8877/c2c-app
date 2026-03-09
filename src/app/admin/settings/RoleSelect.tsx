'use client';

import { useTransition } from 'react';
import { updateUserRole } from '@/app/admin/settings/actions';

interface RoleSelectProps {
    userId: string;
    currentRole: string;
    isCurrentUser: boolean; // 自分自身のプルダウンは操作不可にするため
}

export default function RoleSelect({ userId, currentRole, isCurrentUser }: RoleSelectProps) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value;

        // Server Actionを呼び出す
        startTransition(async () => {
            try {
                await updateUserRole(userId, newRole);
                // ※必要であればここでToast等で「更新しました」と通知を出す
            } catch (error) {
                alert(error instanceof Error ? error.message : "権限の更新に失敗しました");
            }
        });
    };

    return (
        <div className="relative inline-block">
            <select
                value={currentRole}
                onChange={handleChange}
                disabled={isPending || isCurrentUser}
                className={`appearance-none outline-none text-xs font-medium px-3 py-1.5 pr-8 rounded-md border transition-colors 
          ${isCurrentUser ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800 cursor-pointer hover:bg-gray-50'}
          ${isPending ? 'opacity-50' : ''}
        `}
            >
                <option value="super_admin">SUPER ADMIN</option>
                <option value="ops_manager">OPS MANAGER</option>
                <option value="ops_member">OPS MEMBER</option>
            </select>

            {/* ドロップダウンの矢印アイコン */}
            {!isCurrentUser && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            )}
        </div>
    );
}