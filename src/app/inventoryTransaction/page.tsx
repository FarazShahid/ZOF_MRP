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

  const rowsPerPage = 10;
  const pages = Math.ceil(inventoryTransactions?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered?.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  // reset page on new search
  useEffect(() => setPage(1), [query]);

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
            <AddButton title="Add New" onClick={openAddModal} />
          </div>
        </div>
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
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item?.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleOpenDeleteModal(item?.Id)}
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
