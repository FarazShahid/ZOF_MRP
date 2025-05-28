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
  Tooltip,
} from "@heroui/react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import useInventoryItemsStore from "@/store/useInventoryItemsStore";
import DeleteInventoryItem from "./DeleteInventoryItem";
import AddItems from "./AddItems";
import StockDataVisulizer from "./StockDataVisulizer";
import { FiPlus, FiSettings } from "react-icons/fi";
import Link from "next/link";

const InventoryItemsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { loading, fetchInventoryItems, inventoryItems } =
    useInventoryItemsStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(inventoryItems?.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return inventoryItems?.slice(start, end);
  }, [page, inventoryItems]);

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
    fetchInventoryItems();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">Inventory Items</h6>
          <div className="flex items-center gap-2">
            <Tooltip content="Inventory Settings">
              <Link
                href={"/inventoryItems/Inventorysetup"}
                className="bg-gray-700 rounded-lg p-2"
              >
                <FiSettings size={20} />
              </Link>
            </Tooltip>
            <button
              type="button"
              className="text-sm rounded-full bg-green-400 text-black font-semibold px-3 py-2 flex items-center gap-1"
              onClick={openAddModal}
            >
              <FiPlus />
              Add New
            </button>
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
            <TableColumn key="ItemCode" className="text-medium font-bold">
              Code
            </TableColumn>
            <TableColumn key="Name" className="text-medium font-bold">
              Name
            </TableColumn>
            <TableColumn
              key="SubCategoryName"
              className="text-medium font-bold"
            >
              Sub Category
            </TableColumn>
            <TableColumn key="SupplierName" className="text-medium font-bold">
              Supplier
            </TableColumn>
            <TableColumn
              key="UnitOfMeasureName"
              className="text-medium font-bold"
            >
              Unit Of Measure
            </TableColumn>

            <TableColumn key="ReorderLevel" className="text-medium font-bold">
              Reorder Level
            </TableColumn>
            <TableColumn key="Stock" className="text-medium font-bold">
              Stock
            </TableColumn>
            <TableColumn key="action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(items ?? [])?.map((item: any, index: number) => (
              <TableRow key={index}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey === "Stock" ? (
                      <StockDataVisulizer
                        stock={item?.Stock}
                        reorderLevel={item?.ReorderLevel}
                        itemCode={item?.ItemCode}
                      />
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
      </div>
      {isAddModalOpen ? (
        <AddItems
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          Id={selectedItemId}
        />
      ) : (
        <></>
      )}

      <DeleteInventoryItem
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        Id={selectedItemId}
      />
    </>
  );
};

export default InventoryItemsTable;
