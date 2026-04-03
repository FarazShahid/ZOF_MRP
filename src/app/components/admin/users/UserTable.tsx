import { GetUsersType } from "@/store/useUserStore";
import {
  getKeyValue,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { useMemo, useState } from "react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getRoleColor } from "./getRoleColor";
import { StatusBadge } from "../common/StatusBadge";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

interface ComponentProp {
  users: GetUsersType[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const UserTable: React.FC<ComponentProp> = ({
  users,
  loading,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 15;
  const pages = Math.ceil(users?.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users?.slice(start, end);
  }, [page, users]);

  return (
    <Table
      isHeaderSticky
      aria-label="Client Table with pagination"
      bottomContent={
        <div className="grid grid-cols-2">
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
            onChange={(page) => setPage(page)}
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
        <TableColumn key="firstName" className="text-medium font-bold">
          First Name
        </TableColumn>
        <TableColumn key="lastName" className="text-medium font-bold">
          Last Name
        </TableColumn>
        <TableColumn key="roleName" className="text-medium font-bold">
          Role
        </TableColumn>
        <TableColumn key="Email" className="text-medium font-bold">
          Email
        </TableColumn>
        <TableColumn key="status" className="text-medium font-bold">
          Status
        </TableColumn>
        <TableColumn key="action" className="text-medium font-bold">
          Action
        </TableColumn>
      </TableHeader>
      <TableBody isLoading={loading} items={items}>
        {(items ?? []).map((item: any, index: number) => (
          <TableRow key={item.Id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "Sr" ? (
                  index + 1
                ) : columnKey === "status" ? (
                  <StatusBadge status={item.isActive ? "Active" : "Inactive"} />
                ) : columnKey === "roleName" ? (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                      item.roleName || ""
                    )}`}
                  >
                    {item.roleName}
                  </span>
                ) : columnKey !== "action" ? (
                  getKeyValue(item, columnKey)
                ) : (
                  <div className="flex items-center gap-2">
                    <PermissionGuard
                      required={PERMISSIONS_ENUM.USERS.UPDATE}
                    >
                      <button
                        type="button"
                        onClick={() => onEdit(item?.Id)}
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-md transition-colors"
                      >
                        <GoPencil className="w-3.5 h-3.5" />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard
                      required={PERMISSIONS_ENUM.USERS.DELETE}
                    >
                      <button
                        type="button"
                        onClick={() => onDelete(item?.Id)}
                        className="p-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white rounded-md transition-colors"
                      >
                        <RiDeleteBin6Line className="w-3.5 h-3.5" />
                      </button>
                    </PermissionGuard>
                  </div>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
