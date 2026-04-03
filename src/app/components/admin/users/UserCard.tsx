import React from "react";
import { getInitials, getRoleColor } from "./getRoleColor";
import { Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "../common/StatusBadge";
import { GetUsersType } from "@/store/useUserStore";
import { MAX_CLIENT_CHIPS } from "@/src/types/admin";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

interface UserCardProps {
  user: GetUsersType;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const fullName = user.firstName + " " + user.lastName;

  // Build client labels from assignments, showing name when available, else #id
  const clientLabels: string[] =
    (user.assignedClients ?? []).map((c) => c.name ?? `#${c.clientId}`) ?? [];

  const visibleClients = clientLabels.slice(0, MAX_CLIENT_CHIPS);
  const remainingCount = Math.max(
    0,
    clientLabels.length - visibleClients.length
  );

  return (
    <div
      key={user.Id}
      className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {getInitials(fullName || "")}
              </span>
            </div>
            <div className="leading-none">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h3>
              <span className="text-sm text-gray-500 dark:text-slate-400">{user.Email}</span>
            </div>
          </div>
          <StatusBadge status={user.isActive ? "Active" : "Inactive"} />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 pt-3 space-y-3">
        {/* Role & Status row */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-slate-400">Role</span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(
              user.roleName || ""
            )}`}
          >
            {user.roleName}
          </span>
        </div>

        {/* Assigned Clients */}
        <div>
          <div>
            <span className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">Assigned Clients</span>
            {clientLabels.length === 0 ? (
              <span className="text-xs text-gray-400 dark:text-slate-500">No clients assigned</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {clientLabels.map((label, idx) => (
                  <span
                    key={`${label}-${idx}`}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-slate-800">
        <PermissionGuard required={PERMISSIONS_ENUM.USERS.UPDATE}>
          <button
            type="button"
            onClick={() => onEdit(user.Id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-lg transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </PermissionGuard>

        <PermissionGuard required={PERMISSIONS_ENUM.USERS.DELETE}>
          <button
            type="button"
            onClick={() => onDelete(user.Id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default UserCard;
