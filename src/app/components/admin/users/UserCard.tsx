import React from "react";
import { getInitials, getRoleColor } from "./getRoleColor";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
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
      className=" rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-lg font-medium text-gray-700">
              {getInitials(fullName || "")}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                user.roleName || ""
              )}`}
            >
              {user.roleName}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">{user.Email}</p>
        {/* Assigned Clients */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-500">
            Assigned Clients
          </span>
          {clientLabels.length === 0 ? (
            <span className="text-sm text-gray-400">No clients assigned</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {visibleClients.map((label, idx) => (
                <span
                  key={`${label}-${idx}`}
                  className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs px-2.5 py-1 border border-gray-200"
                >
                  {label}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-600 text-xs px-2.5 py-1 border border-gray-200">
                  +{remainingCount} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={user.isActive ? "Active" : "Inactive"} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <PermissionGuard required={PERMISSIONS_ENUM.ADMIN_SETTING.UPDATE}>
          <button
            type="button"
            onClick={() => onEdit(user.Id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </PermissionGuard>

        <PermissionGuard required={PERMISSIONS_ENUM.ADMIN_SETTING.DELETE}>
          <button
            type="button"
            onClick={() => onDelete(user.Id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default UserCard;
