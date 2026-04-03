"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import useRoleRightsStore from "@/store/useRoleRightsStore";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import DeleteRole from "./DeleteRole";

const rowsPerPage = 8;

type RoleProps = {
  /** Called when user clicks edit; opens modal in parent */
  onEditRole?: (id: number) => void;
};

const Role: React.FC<RoleProps> = ({ onEditRole }) => {

  const { fetchRoles, roles, loading } = useRoleRightsStore();

  const [page, setPage] = useState<number>(1);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const pages = Math.max(1, Math.ceil((roles?.length ?? 0) / rowsPerPage));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return (roles ?? []).slice(start, end);
  }, [page, roles]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleEdit = (id: number) => {
    if (onEditRole) {
      onEditRole(id); // open modal in parent
    }
  };

  const handleDelete = (id: number) => {
    if (!id) return;
    setSelectedRoleId(id);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <Table
        isHeaderSticky
        aria-label="Roles table with pagination"
        bottomContent={
          <div className="grid grid-cols-2 items-center">
            <span className="w-[30%] text-small text-gray-500">
              Total: {items?.length || 0}
            </span>
            <Pagination
              isCompact
              showControls
              showShadow
              color="success"
              page={page}
              total={pages}
              onChange={(p) => setPage(p)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px] !bg-transparent dark:!bg-transparent shadow-none",
          th: "tableHeaderWrapper",
          tr: "hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors",
          td: "text-gray-700 dark:text-slate-300",
        }}
      >
        <TableHeader>
          <TableColumn key="Sr" className="text-medium font-bold">
            Sr.
          </TableColumn>
          <TableColumn key="Name" className="text-medium font-bold">
            Name
          </TableColumn>
          <TableColumn key="action" className="text-medium font-bold">
            Action
          </TableColumn>
        </TableHeader>

        <TableBody isLoading={loading} items={items}>
          {(items ?? []).map((role: any, index: number) => {
            const start = (page - 1) * rowsPerPage;
            return (
              <TableRow key={role?.id ?? index}>
                <TableCell>{start + index + 1}</TableCell>
                <TableCell>{role?.name ?? "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PermissionGuard
                      required={PERMISSIONS_ENUM.ROLES_AND_RIGHTS.UPDATE}
                    >
                      <button
                        type="button"
                        disabled={role.id === 1}
                        onClick={() => handleEdit(role?.id)}
                        className={`p-1.5 rounded-md transition-colors ${role.id === 1 ? "cursor-not-allowed opacity-40 bg-gray-100 dark:bg-slate-800 text-gray-400" : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white"}`}
                      >
                        <GoPencil className="w-3.5 h-3.5" />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard
                      required={PERMISSIONS_ENUM.ROLES_AND_RIGHTS.DELETE}
                    >
                      <button
                        type="button"
                        disabled={loading || role.id === 1}
                        onClick={() => handleDelete(role?.id)}
                        className={`p-1.5 rounded-md transition-colors ${role.id === 1 ? "cursor-not-allowed opacity-40 bg-gray-100 dark:bg-slate-800 text-gray-400" : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white"}`}
                      >
                        <RiDeleteBin6Line className="w-3.5 h-3.5" />
                      </button>
                    </PermissionGuard>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {isDeleteOpen && selectedRoleId !== null && (
        <DeleteRole
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedRoleId(null);
          }}
          id={selectedRoleId}
        />
      )}
    </div>
  );
};

export default Role;
