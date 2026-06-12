"use client";

import { useEffect, useMemo, useState } from "react";
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
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import AddButton from "../../components/common/AddButton";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { ROWS_PER_PAGE } from "@/src/types/admin";
import useProductSubCategoryStore, {
  ProductSubCategory,
} from "@/store/useProductSubCategoryStore";
import AddProductSubCategory from "./AddProductSubCategory";
import DeleteProductSubCategory from "./DeleteProductSubCategory";

const ProductSubCategoryComponent = () => {
  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [sortColumn, setSortColumn] =
    useState<keyof ProductSubCategory>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { productSubCategories, fetchProductSubCategories, loading } =
    useProductSubCategoryStore();

  useEffect(() => {
    fetchProductSubCategories({ limit: 100, sortBy: "name", sortOrder: "ASC" });
  }, [fetchProductSubCategories]);

  const pages = Math.ceil(productSubCategories.length / ROWS_PER_PAGE);

  const items = useMemo(() => {
    const sorted = [...productSubCategories].sort((first, second) => {
      const firstValue = first[sortColumn];
      const secondValue = second[sortColumn];

      if (typeof firstValue === "string" && typeof secondValue === "string") {
        return sortDirection === "asc"
          ? firstValue.localeCompare(secondValue)
          : secondValue.localeCompare(firstValue);
      }

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return sortDirection === "asc"
          ? firstValue - secondValue
          : secondValue - firstValue;
      }

      return 0;
    });

    const start = (page - 1) * ROWS_PER_PAGE;
    return sorted.slice(start, start + ROWS_PER_PAGE);
  }, [page, productSubCategories, sortColumn, sortDirection]);

  useEffect(() => {
    setPage(1);
  }, [sortColumn, sortDirection]);

  const handleSort = (column: keyof ProductSubCategory) => {
    if (column === sortColumn) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column);
    setSortDirection("asc");
  };

  const openAddModal = () => setIsAddModalOpen(true);

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
    setSelectedSubCategoryId(0);
  };

  const openEditModal = (id: number) => {
    setSelectedSubCategoryId(id);
    setIsEdit(true);
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedSubCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h6 className="font-sans text-lg font-semibold">
          Product Sub Categories
        </h6>
        <PermissionGuard required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.ADD}>
          <AddButton title="Add New" onClick={openAddModal} />
        </PermissionGuard>
      </div>

      <Table
        isStriped
        isHeaderSticky
        aria-label="Product sub categories table"
        classNames={{
          wrapper: "min-h-[222px]",
          th: "tableHeaderWrapper",
        }}
        bottomContent={
          <div className="flex items-center justify-between gap-2">
            <span className="text-small text-gray-500">
              Items per Page: {items.length || 0}
            </span>
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages || 1}
              onChange={(nextPage) => setPage(nextPage)}
            />
            <span className="text-small text-gray-500">
              Total Items : {productSubCategories.length || 0}
            </span>
          </div>
        }
      >
        <TableHeader>
          <TableColumn key="Sr" className="text-medium font-bold">
            Sr
          </TableColumn>
          <TableColumn
            key="name"
            className="cursor-pointer text-medium font-bold"
            onClick={() => handleSort("name")}
          >
            <div className="flex items-center gap-1">
              Name
              {sortColumn === "name" &&
                (sortDirection === "asc" ? (
                  <TiArrowSortedUp />
                ) : (
                  <TiArrowSortedDown />
                ))}
            </div>
          </TableColumn>
          <TableColumn
            key="productCategoryName"
            className="cursor-pointer text-medium font-bold"
            onClick={() => handleSort("productCategoryName")}
          >
            <div className="flex items-center gap-1">
              Product Category
              {sortColumn === "productCategoryName" &&
                (sortDirection === "asc" ? (
                  <TiArrowSortedUp />
                ) : (
                  <TiArrowSortedDown />
                ))}
            </div>
          </TableColumn>
          <TableColumn key="action" className="text-medium font-bold">
            Action
          </TableColumn>
        </TableHeader>

        <TableBody isLoading={loading} items={items}>
          {(items ?? []).map((item, index) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "Sr" ? (
                    index + 1
                  ) : columnKey !== "action" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <div className="flex gap-2">
                      <PermissionGuard
                        required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.UPDATE}
                      >
                        <button
                          type="button"
                          className="inline-flex rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => openEditModal(item.id)}
                        >
                          <GoPencil color="green" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard
                        required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.DELETE}
                      >
                        <button
                          type="button"
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => openDeleteModal(item.id)}
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

      <AddProductSubCategory
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        productSubCategoryId={selectedSubCategoryId}
      />
      <DeleteProductSubCategory
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        productSubCategoryId={selectedSubCategoryId}
      />
    </div>
  );
};

export default ProductSubCategoryComponent;
