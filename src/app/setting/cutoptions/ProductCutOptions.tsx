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
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import useCutOptionsStore, { CutOptions } from "@/store/useCutOptionsStore";
import AddCutOptions from "./AddCutOptions";
import DeleteCutOptions from "./DeleteCutOptions";
import AddButton from "../../components/common/AddButton";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const ProductCutOptions = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedCutOptionId, setSelectedCutOptionId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<keyof CutOptions>(
    "OptionProductCutOptions"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { fetchcutOptions, cutOptions, loading } = useCutOptionsStore();

  useEffect(() => {
    fetchcutOptions();
  }, []);

  const rowsPerPage = 10;
  const pages = Math.ceil(cutOptions?.length / rowsPerPage);

  const openAddModal = () => setIsAddModalOpen(true);

  const handleOpenDeleteModal = (productCatagoryId: number) => {
    setSelectedCutOptionId(productCatagoryId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (clientId: number) => {
    setSelectedCutOptionId(clientId);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };

  const items = useMemo(() => {
    const sorted = [...(cutOptions || [])].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (
        sortColumn === "CreatedOn" &&
        typeof aValue === "string" &&
        typeof bValue === "string"
      ) {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }

      return 0;
    });

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sorted.slice(start, end);
  }, [page, cutOptions, sortColumn, sortDirection]);

  const handleSort = (column: keyof CutOptions) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    setPage(1);
  }, [sortColumn, sortDirection]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">
            Product Cut Options
          </h6>
          <PermissionGuard required={PERMISSIONS_ENUM.PRODUCT_DEFINATION.ADD}>
            <AddButton title="Add New" onClick={openAddModal} />
          </PermissionGuard>
        </div>
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
                Total: {cutOptions?.length || 0}
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
              key="OptionProductCutOptions"
              className="text-medium font-bold cursor-pointer"
              onClick={() => handleSort("OptionProductCutOptions")}
            >
              <div className="flex items-center gap-1">
                Cut Option
                {sortColumn === "OptionProductCutOptions" &&
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
            {(items ?? []).map((item: any, index: number) => (
              <TableRow key={index}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <PermissionGuard
                          required={PERMISSIONS_ENUM.PRODUCT_DEFINATION.UPDATE}
                        >
                          <button
                            type="button"
                            onClick={() => openEditModal(item?.Id)}
                          >
                            <GoPencil color="green" />
                          </button>
                        </PermissionGuard>

                        <PermissionGuard
                          required={PERMISSIONS_ENUM.PRODUCT_DEFINATION.DELETE}
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

        <AddCutOptions
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          cutOptionId={selectedCutOptionId}
        />
        <DeleteCutOptions
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          cutOptionId={selectedCutOptionId}
        />
      </div>
    </>
  );
};

export default ProductCutOptions;
