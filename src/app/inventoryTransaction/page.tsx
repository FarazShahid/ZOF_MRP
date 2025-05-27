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
} from "@heroui/react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoChevronBackOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import useInventoryTransection from "@/store/useInventoryTransection";
import { formatDate } from "../interfaces";
import DeleteItem from "./DeleteItem";
import AddInventoryTransaction from "./AddInventoryTransaction";
import TransactionTypeChip from "./TransactionTypeChip";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import Link from "next/link";


const page = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { loading, fetchInventoryTransactions, inventoryTransactions } =
    useInventoryTransection();

  const rowsPerPage = 15;
  const pages = Math.ceil(inventoryTransactions!.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return inventoryTransactions?.slice(start, end);
  }, [page, inventoryTransactions]);

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
    <AdminDashboardLayout>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          
          <Link href={'/inventoryItems'} className="font-sans text-lg font-semibold flex items-center gap-1">
            <IoChevronBackOutline />
            Inventory Transaction
          </Link>
          <button
            type="button"
           className="text-sm rounded-full bg-green-400 text-black font-semibold px-3 py-2 flex items-center gap-1"
            onClick={openAddModal}
          >
            <FiPlus />
            Add New
          </button>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="grid grid-cols-2">
              <span className="w-[30%] text-small text-gray-500">
                Total: {items.length || 0}
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
            <TableColumn key="ItemCode" className="text-medium font-bold">
              Code
            </TableColumn>
            <TableColumn key="UnitOfMeasure" className="text-medium font-bold">
              Unit Of Measure
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
            {(items ?? []).map((item: any, index: number) => (
              <TableRow key={item.Id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "TransactionDate" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "Sr" ? (
                      index + 1
                    ): columnKey === "TransactionType" ? (
                      <TransactionTypeChip type={item.TransactionType} />
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleOpenDeleteModal(item.Id)}
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
    </AdminDashboardLayout>
  );
};

export default page;
