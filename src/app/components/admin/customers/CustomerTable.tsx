import { GetClientsType } from "@/store/useClientStore";
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
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ComponentProp {
  clients: GetClientsType[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CustomerTable: React.FC<ComponentProp> = ({
  clients,
  loading,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 15;
  const pages = Math.ceil(clients?.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return clients?.slice(start, end);
  }, [page, clients]);
  return (
    <Table
      isStriped
      isHeaderSticky
      aria-label="Client Table with pagination"
      selectionMode="single"
      bottomContent={
        <div className="grid grid-cols-2 mt-5">
          <span className="w-[30%] text-small text-gray-500">
            Total: {clients?.length || 0}
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
        th: "tableHeaderWrapper",
      }}
    >
      <TableHeader>
        <TableColumn
          key="Name"
          className="text-medium font-bold cursor-pointer"
        >
          Business Name
        </TableColumn>
        <TableColumn
          key="Email"
          className="text-medium font-bold cursor-pointer"
        >
          Business Email
        </TableColumn>
        <TableColumn key="POCName" className="text-medium font-bold">
          POC Name
        </TableColumn>
        <TableColumn
          key="Phone"
          className="text-medium font-bold cursor-pointer"
        >
          POC Phone
        </TableColumn>

        <TableColumn key="POCEmail" className="text-medium font-bold">
          POC Email
        </TableColumn>
        <TableColumn key="Action" className="text-medium font-bold">
          Action
        </TableColumn>
      </TableHeader>
      <TableBody isLoading={loading} items={items}>
        {(item) => (
          <TableRow key={item.Id}>
            {(columnKey) => (
              <TableCell>
                {columnKey !== "Action" ? (
                  getKeyValue(item, columnKey)
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href={`/client/${item.Id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View Client Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <PermissionGuard
                      required={PERMISSIONS_ENUM.CLIENTS.UPDATE}
                    >
                      <button type="button" onClick={() => onEdit(item?.Id)}>
                        <GoPencil color="green" />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard
                      required={PERMISSIONS_ENUM.CLIENTS.DELETE}
                    >
                      <button
                        type="button"
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => onDelete(item?.Id)}
                      >
                        <RiDeleteBin6Line color="red" />
                      </button>
                    </PermissionGuard>
                  </div>
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CustomerTable;
