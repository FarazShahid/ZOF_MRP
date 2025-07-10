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
import useSizeMeasurementsStore, {
  SizeMeasurements,
} from "@/store/useSizeMeasurementsStore";
import ViewModal from "./ViewModal";
import DeleteSizeOptions from "./DeleteSizeOptions";
import AddSizeOptions from "./AddSizeOptions";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import AddButton from "../../components/common/AddButton";
import { useRouter } from "next/navigation";
import { ViewMeasurementChart } from "../../orders/components/ViewMeasurementChart";

const ProductSizeMeasurements = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedSizeOptionId, setSelectedSizeOptionId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isViewModal, setIsViewModal] = useState<boolean>(false);
  const [sortColumn, setSortColumn] =
    useState<keyof SizeMeasurements>("Measurement1");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const router = useRouter();

  const { fetchSizeMeasurements, sizeMeasurement, loading } =
    useSizeMeasurementsStore();

  useEffect(() => {
    fetchSizeMeasurements();
  }, []);

  const rowsPerPage = 10;
  const pages = Math.ceil(sizeMeasurement?.length / rowsPerPage);

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

  const items = useMemo(() => {
    const sorted = [...(sizeMeasurement || [])].sort((a, b) => {
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
  }, [page, sizeMeasurement, sortColumn, sortDirection]);

  const handleSort = (column: keyof SizeMeasurements) => {
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
          <h6 className="font-sans text-lg font-semibold">Size Measurements</h6>
          <AddButton title="Add New" onClick={openAddModal} />
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
              onClick={() => handleSort("Measurement1")}
            >
              <div className="flex items-center gap-1">
                Name
                {sortColumn === "Measurement1" &&
                  (sortDirection === "asc" ? (
                    <TiArrowSortedUp />
                  ) : (
                    <TiArrowSortedDown />
                  ))}
              </div>
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
                      <div
                        className="flex gap-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => openEditModal(item?.Id)}
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
