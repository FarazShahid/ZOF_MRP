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
import { formatDate } from "../../interfaces";
import useFabricStore, { FabricType } from "@/store/useFabricStore";
import DeleteFabricType from "./DeleteFabricType";
import AddFabricType from "./AddFabricType";
import { FiPlus } from "react-icons/fi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import AdminLayout from "../../adminDashboard/lauout";

const page = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductCatId, setSelectedProductCatId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<keyof FabricType>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { fabricTypeData, fetchFabricType, loading } = useFabricStore();

  useEffect(() => {
    fetchFabricType();
  }, []);

  const rowsPerPage = 10;
  const pages = Math.ceil(fabricTypeData!.length / rowsPerPage);

  const openAddModal = () => setIsAddModalOpen(true);

  const handleOpenDeleteModal = (productCatagoryId: number) => {
    setSelectedProductCatId(productCatagoryId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (clientId: number) => {
    setSelectedProductCatId(clientId);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };

  // const items = useMemo(() => {
  //   const start = (page - 1) * rowsPerPage;
  //   const end = start + rowsPerPage;

  //   return fabricTypeData?.slice(start, end);
  // }, [page, fabricTypeData]);

  const items = useMemo(() => {
    const sorted = [...(fabricTypeData || [])].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // String sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Date sorting (for fields like CreatedOn)
      if (
        sortColumn === "createdOn" &&
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
  }, [page, fabricTypeData, sortColumn, sortDirection]);

  const handleSort = (column: keyof FabricType) => {
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
    <AdminLayout>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">Fabric Type</h6>
          <button
            type="button"
            className="flex items-center gap-2 text-white bg-[#584BDD] px-2 py-1 rounded-lg text-sm"
            onClick={openAddModal}
          >
            <FiPlus />
            Add New
          </button>
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
                Total: {fabricTypeData.length || 0}
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
              key="type"
              className="text-medium font-bold cursor-pointer"
              onClick={() => handleSort("type")}
            >
              <div className="flex items-center gap-1">
                Type
                {sortColumn === "type" &&
                  (sortDirection === "asc" ? (
                    <TiArrowSortedUp />
                  ) : (
                    <TiArrowSortedDown />
                  ))}
              </div>
            </TableColumn>
            <TableColumn
              key="name"
              className="text-medium font-bold cursor-pointer"
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
            <TableColumn key="gsm" className="text-medium font-bold">
              GSM
            </TableColumn>
            <TableColumn key="createdOn" className="text-medium font-bold">
              Created On
            </TableColumn>
            <TableColumn key="createdBy" className="text-medium font-bold">
              Created By
            </TableColumn>
            <TableColumn key="updatedOn" className="text-medium font-bold">
              Updated On
            </TableColumn>
            <TableColumn key="action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(items ?? []).map((item: any, index: number) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "createdOn" || columnKey === "updatedOn" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item.id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleOpenDeleteModal(item.id)}
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

        <AddFabricType
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          fabricTypeId={selectedProductCatId}
        />
        <DeleteFabricType
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          productIdCatagory={selectedProductCatId}
        />
      </div>
    </AdminLayout>
  );
};

export default page;
