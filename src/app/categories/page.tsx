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
import useInventoryCategoryStore from "@/store/useInventoryCategoryStore";
import DeleteCategories from "./DeleteCategories";
import AddCategoires from "./AddCategoires";
import AddButton from "../components/common/AddButton";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { ROWS_PER_PAGE } from "@/src/types/admin";

const InventoryCategories = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { loading, fetchInventoryCategories, inventoryCategories } =
    useInventoryCategoryStore();

  
  const pages = Math.ceil(inventoryCategories?.length / ROWS_PER_PAGE);
  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return inventoryCategories?.slice(start, end);
  }, [page, inventoryCategories]);

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
    fetchInventoryCategories();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">
            Inventory Category
          </h6>
          <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_CATEGORY.ADD}>
            <AddButton title="Add New" onClick={openAddModal} />
          </PermissionGuard>
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
                  Total Items: {inventoryCategories?.length || 0}
                </span>
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
              allowsSorting={true}
              className="text-medium font-bold"
            >
              Name
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
                        <PermissionGuard
                          required={PERMISSIONS_ENUM.INVENTORY_CATEGORY.UPDATE}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item?.Id)}
                          >
                            <GoPencil color="green" />
                          </button>
                        </PermissionGuard>

                        <PermissionGuard
                          required={PERMISSIONS_ENUM.INVENTORY_CATEGORY.DELETE}
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

        <AddCategoires
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          Id={selectedItemId}
        />

        <DeleteCategories
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          Id={selectedItemId}
        />
      </div>
    </>
  );
};

export default InventoryCategories;
