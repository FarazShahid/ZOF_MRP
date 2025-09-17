import React from "react";
import { getInitials, getRoleColor } from "./getRoleColor";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { StatusBadge } from "../common/StatusBadge";
import { GetUsersType } from "@/store/useUserStore";

interface UserCardProps {
  user: GetUsersType;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div
      key={user.Id}
      className=" rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-lg font-medium text-gray-700">
              {getInitials(user.Name || "")}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.Name}</h3>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                user.role || ""
              )}`}
            >
              {user.role}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">{user.Email}</p>
        <div className="flex items-center justify-between">
          <StatusBadge status={user.isActive ? "Active" : "Inactive"} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => onEdit(user.Id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(user.Id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
