"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Input,
} from "@heroui/react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import useInventoryTransection from "@/store/useInventoryTransection";
import { formatDate } from "../interfaces";
import DeleteItem from "./DeleteItem";
import AddInventoryTransaction from "./AddInventoryTransaction";
import TransactionTypeChip from "./TransactionTypeChip";
import AddButton from "../components/common/AddButton";
import { useSearch } from "@/src/hooks/useSearch";
import { CiSearch } from "react-icons/ci";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { ROWS_PER_PAGE } from "@/src/types/admin";

const InventoryTransaction = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { loading, fetchInventoryTransactions, inventoryTransactions } =
    useInventoryTransection();

  // Search on 4 fields
  const filtered = useSearch(inventoryTransactions, query, [
    "ItemName",
    "ClientName",
    "OrderName",
    "TransactionType",
    "TransactionDate",
  ]);

  const total = filtered?.length ?? 0;
  const rawPages = Math.ceil(total / ROWS_PER_PAGE);
  const pages = Math.max(1, rawPages);

  const items = useMemo(() => {
    const safePage = Math.min(page, pages);
    const start = (safePage - 1) * ROWS_PER_PAGE;
    return filtered?.slice(start, start + ROWS_PER_PAGE) ?? [];
  }, [filtered, page, pages]);

  // reset page on new search
  useEffect(() => setPage(1), [query]);

  // also clamp page whenever filtered changes (e.g., after search)
  useEffect(() => {
    if (page > pages) setPage(pages);
    if (page < 1) setPage(1);
  }, [pages, page]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const handleOpenDeleteModal = (Id: number) => {
    setSelectedItemId(Id);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const handleOpenEditModal = (Id: number) => {
    setSelectedItemId(Id);
    setIsEdit(true);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    fetchInventoryTransactions();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">
            Inventory Transaction
          </h6>
          <div className="flex items-center justify-end gap-2">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              classNames={{
                base: "max-w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              startContent={<CiSearch />}
              variant="bordered"
            />
            <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.ADD}>
              <AddButton title="Add New" onClick={openAddModal} />
            </PermissionGuard>
          </div>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="flex items-center justify-between gap-2">
              <span className="text-small text-gray-500">
                Items per Page: {items?.length || 0}
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
              <span className="text-small text-gray-500">
                Total Items: {inventoryTransactions?.length || 0}
              </span>
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
            th: "tableHeaderWrapper",
          }}
        >
          <TableHeader>
            <TableColumn key="Sr" className="text-medium font-bold">
              Sr
            </TableColumn>
            <TableColumn key="ItemName" className="text-medium font-bold">
              Item Name
            </TableColumn>
            <TableColumn key="ClientName" className="text-medium font-bold">
              Client
            </TableColumn>
            <TableColumn key="OrderName" className="text-medium font-bold">
              Order Name
            </TableColumn>
            <TableColumn key="Quantity" className="text-medium font-bold">
              Quantity
            </TableColumn>
            <TableColumn
              key="TransactionType"
              className="text-medium font-bold"
            >
              Transaction Type
            </TableColumn>
            <TableColumn key="Stock" className="text-medium font-bold">
              Available Stock
            </TableColumn>
            <TableColumn
              key="TransactionDate"
              className="text-medium font-bold"
            >
              Transaction Date
            </TableColumn>
            <TableColumn key="action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(items ?? [])?.map((item: any, index: number) => (
              <TableRow key={item?.Id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "TransactionDate" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey === "TransactionType" ? (
                      <TransactionTypeChip type={item?.TransactionType} />
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <PermissionGuard
                          required={PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.UPDATE}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item?.Id)}
                          >
                            <GoPencil color="green" />
                          </button>
                        </PermissionGuard>

                        <PermissionGuard
                          required={PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.DELETE}
                        >
                          <button
                            type="button"
                            className="hover:text-red-500 cursor-pointer"
                            onClick={() => handleOpenDeleteModal(item?.Id)}
                          >
                            <RiDeleteBin6Line color="red" />
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

        {isAddModalOpen ? (
          <AddInventoryTransaction
            isOpen={isAddModalOpen}
            closeAddModal={closeAddModal}
            isEdit={isEdit}
            Id={selectedItemId}
          />
        ) : (
          <></>
        )}

        <DeleteItem
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          Id={selectedItemId}
        />
      </div>
    </>
  );
};

export default InventoryTransaction;
