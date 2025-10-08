"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getKeyValue,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import useSizeMeasurementsStore, {
  SizeMeasurements,
} from "@/store/useSizeMeasurementsStore";
import DeleteSizeOptions from "./DeleteSizeOptions";
import AddSizeOptions from "./AddSizeOptions";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import AddButton from "../../components/common/AddButton";
import { useRouter } from "next/navigation";
import { ViewMeasurementChart } from "../../orders/components/ViewMeasurementChart";
import { useSearch } from "@/src/hooks/useSearch";
import { CiSearch } from "react-icons/ci";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const ProductSizeMeasurements = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedSizeOptionId, setSelectedSizeOptionId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isViewModal, setIsViewModal] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const router = useRouter();

  const { fetchSizeMeasurements, sizeMeasurement, loading } =
    useSizeMeasurementsStore();

  // Search on 4 fields
  const filtered = useSearch(sizeMeasurement, query, [
    "Measurement1",
    "ProductCategoryType",
    "SizeOptionName",
    "ClientName",
  ]);
  const rowsPerPage = 10;
  const total = filtered?.length ?? 0;
  const rawPages = Math.ceil(total / rowsPerPage);
  const pages = Math.max(1, rawPages);

  const items = useMemo(() => {
    const safePage = Math.min(page, pages);
    const start = (safePage - 1) * rowsPerPage;
    return filtered?.slice(start, start + rowsPerPage) ?? [];
  }, [filtered, page, pages]);

  // reset page on new search
  useEffect(() => setPage(1), [query]);

  // also clamp page whenever filtered changes (e.g., after search)
  useEffect(() => {
    if (page > pages) setPage(pages);
    if (page < 1) setPage(1);
  }, [pages, page]);

  useEffect(() => {
    fetchSizeMeasurements();
  }, []);

  const openAddModal = () => {
    router.push("/product/addsizeOptions");
  };

  const handleOpenDeleteModal = (sizeOptionId: number) => {
    setSelectedSizeOptionId(sizeOptionId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (sizeId: number) => {
    router.push(`/product/editsizeoptions/${sizeId}`);
  };
  const openViewModal = (sizeId: number) => {
    setSelectedSizeOptionId(sizeId);
    setIsViewModal(true);
  };
  const handleCloseModal = () => {
    setIsViewModal(false);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">Size Measurements</h6>
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
            <PermissionGuard required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.ADD}>
              <AddButton title="Add New" onClick={openAddModal} />
            </PermissionGuard>
          </div>
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
                Total: {sizeMeasurement?.length || 0}
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
              key="Measurement1"
              className="text-medium font-bold cursor-pointer"
            >
              Name
            </TableColumn>
            <TableColumn
              key="ProductCategoryType"
              className="text-medium font-bold"
            >
              Product Category
            </TableColumn>
            <TableColumn key="SizeOptionName" className="text-medium font-bold">
              Size Option
            </TableColumn>
            <TableColumn key="ClientName" className="text-medium font-bold">
              Client Name
            </TableColumn>
            <TableColumn key="action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(items ?? []).map((item: any, index: number) => (
              <TableRow
                key={item.Id}
                onClick={() => openViewModal(item?.Id)}
                className="cursor-pointer"
              >
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
                            onClick={() => openEditModal(item?.Id)}
                          >
                            <GoPencil color="green" />
                          </button>
                        </PermissionGuard>

                        <PermissionGuard
                          required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.DELETE}
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

        {isViewModal ? (
          <ViewMeasurementChart
            isOpen={isViewModal}
            measurementId={selectedSizeOptionId}
            sizeOptionName={""}
            onCloseViewModal={handleCloseModal}
          />
        ) : (
          <></>
        )}

        {isAddModalOpen ? (
          <AddSizeOptions
            isOpen={isAddModalOpen}
            closeAddModal={closeAddModal}
            isEdit={isEdit}
            sizeId={selectedSizeOptionId}
          />
        ) : (
          <></>
        )}

        <DeleteSizeOptions
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          sizeOptionId={selectedSizeOptionId}
        />
      </div>
    </>
  );
};

export default ProductSizeMeasurements;
