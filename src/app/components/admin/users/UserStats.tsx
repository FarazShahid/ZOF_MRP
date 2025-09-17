import { User } from "@/src/types/admin";
import { GetUsersType } from "@/store/useUserStore";
import React from "react";

interface UserStateProps {
  users: GetUsersType[];
}

const UserStats: React.FC<UserStateProps> = ({ users }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className=" p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className=" p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "Active").length}
            </p>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className=" p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Admins</p>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.role === "Admin").length}
            </p>
          </div>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
