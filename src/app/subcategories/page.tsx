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
import useInventorySubCategoryStore from "@/store/useInventorySubCategoryStore";
import AddSubCategory from "./AddSubCategory";
import DeleteSubCategory from "./DeleteSubCategory";
import AddButton from "../components/common/AddButton";
import { useSearch } from "@/src/hooks/useSearch";
import { CiSearch } from "react-icons/ci";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { ROWS_PER_PAGE } from "@/src/types/admin";

const Subcategories = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { loading, fetchSubCategories, subCategories } =
    useInventorySubCategoryStore();

  // Search on 2 fields
  const filtered = useSearch(subCategories, query, ["Name", "CategoryName"]);

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
    fetchSubCategories();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">
            Inventory Sub Category
          </h6>
          <div className="flex justify-end gap-3">
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
            <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.ADD}>
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
                  Total Items: {subCategories?.length || 0}
                </span>
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
            <TableColumn key="CategoryName" className="text-medium font-bold">
              Category Name
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
                    {columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <PermissionGuard
                          required={PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.UPDATE}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item?.Id)}
                          >
                            <GoPencil color="green" />
                          </button>
                        </PermissionGuard>

                        <PermissionGuard
                          required={PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.DELETE}
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
          <AddSubCategory
            isOpen={isAddModalOpen}
            closeAddModal={closeAddModal}
            isEdit={isEdit}
            Id={selectedItemId}
          />
        ) : (
          <></>
        )}

        <DeleteSubCategory
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          Id={selectedItemId}
        />
      </div>
    </>
  );
};

export default Subcategories;
