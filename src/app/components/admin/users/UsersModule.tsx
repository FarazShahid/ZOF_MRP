import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ViewMode } from "@/src/types/admin";
import { ViewToggle } from "../common/ViewToggle";
import UserCard from "./UserCard";
import UserStats from "./UserStats";
import AddUser from "@/src/app/components/admin/users/AddUser";
import DeleteUser from "@/src/app/components/admin/users/DeleteUser";
import useUserStore from "@/store/useUserStore";
import UserTable from "./UserTable";

export const UsersModule: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);

  const { loading, fetchUsers, users } = useUserStore();

  // Add  / Edit Modal
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const handleOpenEditModal = (Id: number) => {
    setSelectedItemId(Id);
    setIsEdit(true);
    setIsAddModalOpen(true);
  };

  // Delete Modal
  const handleOpenDeleteModal = (Id: number) => {
    setSelectedItemId(Id);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600 mt-1">
            Manage system users and their permissions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <UserStats users={users} />

      {/* Content */}
      {viewMode === "table" ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <UserTable
            loading={loading}
            users={users}
            onEdit={(id) => handleOpenEditModal(id)}
            onDelete={(id) => handleOpenDeleteModal(id)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              user={user}
              onEdit={(id) => handleOpenEditModal(id)}
              onDelete={(id) => handleOpenDeleteModal(id)}
            />
          ))}
        </div>
      )}

      <AddUser
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        Id={selectedItemId}
      />
      <DeleteUser
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        Id={selectedItemId}
      />
    </div>
  );
};
