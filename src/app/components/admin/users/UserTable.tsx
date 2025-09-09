import { formatDate } from "@/src/app/interfaces";
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
      isStriped
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
        <TableColumn key="Email" className="text-medium font-bold">
          Email
        </TableColumn>
        <TableColumn key="CreatedOn" className="text-medium font-bold">
          Created On
        </TableColumn>
        <TableColumn key="UpdatedOn" className="text-medium font-bold">
          Updated On
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
                {columnKey === "CreatedOn" || columnKey === "UpdatedOn" ? (
                  formatDate(item[columnKey])
                ) : columnKey === "Sr" ? (
                  index + 1
                ) : columnKey !== "action" ? (
                  getKeyValue(item, columnKey)
                ) : (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onEdit(item?.Id)}>
                      <GoPencil color="green" />
                    </button>
                    <button
                      type="button"
                      className="hover:text-red-500 cursor-pointer"
                      onClick={() => onDelete(item?.Id)}
                    >
                      <RiDeleteBin6Line color="red" />
                    </button>
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
