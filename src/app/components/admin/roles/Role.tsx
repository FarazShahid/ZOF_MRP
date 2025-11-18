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
        isStriped
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
              color="secondary"
              page={page}
              total={pages}
              onChange={(p) => setPage(p)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
          th: "tableHeaderWrapper",
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
                  <div className="flex gap-2">
                    <PermissionGuard
                      required={PERMISSIONS_ENUM.ROLES_AND_RIGHTS.UPDATE}
                    >
                      <button
                        type="button"
                        disabled={role.id === 1 ? true : false}
                        onClick={() => handleEdit(role?.id)}
                        className={`${role.id === 1 ? "cursor-not-allowed text-gray-500" : "cursor-pointer text-green-500"}`}
                      >
                        <GoPencil />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard
                      required={PERMISSIONS_ENUM.ROLES_AND_RIGHTS.DELETE}
                    >
                      <button
                        type="button"
                        className={`${role.id === 1 ? "cursor-not-allowed text-gray-500" : "cursor-pointer text-red-500"}`}
                        disabled={loading || role.id === 1 ? true : false}
                        onClick={() => handleDelete(role?.id)}
                      >
                        <RiDeleteBin6Line />
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
