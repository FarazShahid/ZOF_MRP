import { Events } from "@/store/useEventsStore";
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
  Events: Events[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const EventTable: React.FC<ComponentProp> = ({
  Events,
  loading,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 15;
  const pages = Math.ceil(Events?.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return Events?.slice(start, end);
  }, [page, Events]);
  return (
    <Table
      isStriped
      isHeaderSticky
      aria-label="Product Table with pagination"
      classNames={{
        wrapper: "min-h-[222px]",
        th: "tableHeaderWrapper",
      }}
      bottomContent={
        <div className="grid grid-cols-2 mt-5">
          <span className="w-[30%] text-small text-gray-500">
            Total: {Events?.length || 0}
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
    >
      <TableHeader>
        <TableColumn key="Sr" className="text-medium font-bold">
          Sr
        </TableColumn>
        <TableColumn
          key="EventName"
          className="text-medium font-bold cursor-pointer"
        >
          Event Name
        </TableColumn>
        <TableColumn key="ClientName" className="text-medium font-bold">
          Client
        </TableColumn>
        <TableColumn key="Description" className="text-medium font-bold">
          Description
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

export default EventTable;
