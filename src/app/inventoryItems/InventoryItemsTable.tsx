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
import useInventoryItemsStore from "@/store/useInventoryItemsStore";
import DeleteInventoryItem from "./DeleteInventoryItem";
import AddItems from "./AddItems";
import StockDataVisulizer from "./StockDataVisulizer";
import { IoEye } from "react-icons/io5";
import AddButton from "../components/common/AddButton";
import { formatDate } from "../interfaces";
import ViewItem from "./ViewItem";

const InventoryItemsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState<boolean>(false);
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

  const handleViewModal = (Id: number) => {
    setSelectedItemId(Id);
    setIsOpenViewModal(true);
  };
  const closeViewModal = () => {
    setIsOpenViewModal(false);
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
            <TableColumn key="Name" className="text-medium font-bold">
              Name
            </TableColumn>
            <TableColumn
              key="CategoryName"
              className="text-medium font-bold"
            >
              Category
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
            <TableColumn key="StockLevel" className="text-medium font-bold">
              Stock Lavel
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
            {(items ?? [])?.map((item: any, index: number) => (
              <TableRow key={index}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "CreatedOn" || columnKey === "UpdatedOn" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey === "StockLevel" ? (
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
                          onClick={() => handleViewModal(item?.Id)}
                        >
                          <IoEye color="blue" />
                        </button>
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

      {isOpenViewModal && (
        <ViewItem
          Id={selectedItemId}
          isOpen={isOpenViewModal}
          closeAddModal={closeViewModal}
        />
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
