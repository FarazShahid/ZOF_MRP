import { Plus } from "lucide-react";
import React from "react";
import Role from "./Role";
import { useDisclosure } from "@heroui/react";
import RoleFormModal from "./RoleForm";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const RoleModule = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingRoleId, setEditingRoleId] = React.useState<number | undefined>(
    undefined
  );

  const openForCreate = () => {
    setEditingRoleId(undefined);
    onOpen();
  };

  const openForEdit = (id: number) => {
    setEditingRoleId(id);
    onOpen();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Roles & Permissions
          </h2>
          <p className="text-gray-600 mt-1">
            Manage system role and permissions
          </p>
        </div>

        <PermissionGuard required={PERMISSIONS_ENUM.ROLES_AND_RIGHTS.ADD}>
          <button
            type="button"
            onClick={openForCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
        </PermissionGuard>
      </div>

      <Role onEditRole={openForEdit} />

      {/* Modal for Add/Edit */}
      {
        isOpen && (
          <RoleFormModal isOpen={isOpen} onClose={onClose} roleId={editingRoleId} />
        )
      }
     
    </div>
  );
};

export default RoleModule;
