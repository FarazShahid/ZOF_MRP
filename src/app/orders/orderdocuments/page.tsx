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
import Link from "next/link";
import { GoPencil } from "react-icons/go";
import { IoCaretBackSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import AddButton from "../../components/common/AddButton";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import NoData from "../../components/common/NoData";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { ROWS_PER_PAGE, formatDate } from "@/src/types/admin";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import useOrderDocumentTypesStore, {
  OrderDocumentType,
} from "@/store/useOrderDocumentTypesStore";
import AddOrderDocumentType from "./components/AddOrderDocumentType";
import DeleteOrderDocumentType from "./components/DeleteOrderDocumentType";

type SortColumn = "Name" | "IsRequired" | "CreatedOn";

const sortValue = (item: OrderDocumentType, column: SortColumn) => {
  if (column === "CreatedOn") return new Date(item.CreatedOn).getTime();
  if (column === "IsRequired") return item.IsRequired ? 1 : 0;
  return item.Name?.toLowerCase() ?? "";
};

const OrderDocumentsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] =
    useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { fetchOrderDocumentTypes, orderDocumentTypes, loading } =
    useOrderDocumentTypesStore();

  useEffect(() => {
    fetchOrderDocumentTypes();
  }, [fetchOrderDocumentTypes]);

  const pages = Math.max(
    1,
    Math.ceil(orderDocumentTypes.length / ROWS_PER_PAGE)
  );

  const selectedDocumentType = useMemo(
    () =>
      orderDocumentTypes.find(
        (documentType) => documentType.Id === selectedDocumentTypeId
      ),
    [orderDocumentTypes, selectedDocumentTypeId]
  );

  const openAddModal = () => {
    setSelectedDocumentTypeId(0);
    setIsEdit(false);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
    setSelectedDocumentTypeId(0);
  };

  const openEditModal = (id: number) => {
    setSelectedDocumentTypeId(id);
    setIsEdit(true);
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedDocumentTypeId(id);
    setIsOpenDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
    setSelectedDocumentTypeId(0);
  };

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column);
    setSortDirection("asc");
  };

  const items = useMemo(() => {
    const sorted = [...orderDocumentTypes].sort((a, b) => {
      const aValue = sortValue(a, sortColumn);
      const bValue = sortValue(b, sortColumn);

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    const start = (page - 1) * ROWS_PER_PAGE;
    return sorted.slice(start, start + ROWS_PER_PAGE);
  }, [orderDocumentTypes, page, sortColumn, sortDirection]);

  useEffect(() => {
    setPage(1);
  }, [sortColumn, sortDirection]);

  useEffect(() => {
    if (page > pages) {
      setPage(pages);
    }
  }, [page, pages]);

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? <TiArrowSortedUp /> : <TiArrowSortedDown />;
  };

  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.ORDER.VIEW}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/orders"
              className="flex items-center gap-1 dark:text-gray-400 text-gray-900 hover:text-gray-900 dark:hover:text-white"
            >
              <IoCaretBackSharp />
              <h6 className="font-sans text-lg font-semibold">
                Document Types
              </h6>
            </Link>

            <PermissionGuard required={PERMISSIONS_ENUM.ORDER.ADD}>
              <AddButton title="Add New" onClick={openAddModal} />
            </PermissionGuard>
          </div>

          <Table
            isStriped
            isHeaderSticky
            aria-label="Document types table with pagination"
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
                  total={pages}
                  onChange={(currentPage) => setPage(currentPage)}
                />
                <span className="text-small text-gray-500">
                  Total Items: {orderDocumentTypes.length || 0}
                </span>
              </div>
            }
          >
            <TableHeader>
              <TableColumn key="Sr" className="text-medium font-bold">
                Sr
              </TableColumn>
              <TableColumn
                key="Name"
                className="text-medium font-bold cursor-pointer"
                onClick={() => handleSort("Name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {renderSortIcon("Name")}
                </div>
              </TableColumn>
              <TableColumn
                key="IsRequired"
                className="text-medium font-bold cursor-pointer"
                onClick={() => handleSort("IsRequired")}
              >
                <div className="flex items-center gap-1">
                  Required
                  {renderSortIcon("IsRequired")}
                </div>
              </TableColumn>
              <TableColumn
                key="SupportedExtensions"
                className="text-medium font-bold"
              >
                Supported Extensions
              </TableColumn>
              <TableColumn
                key="CreatedOn"
                className="text-medium font-bold cursor-pointer"
                onClick={() => handleSort("CreatedOn")}
              >
                <div className="flex items-center gap-1">
                  Created On
                  {renderSortIcon("CreatedOn")}
                </div>
              </TableColumn>
              <TableColumn key="action" className="text-medium font-bold">
                Action
              </TableColumn>
            </TableHeader>
            <TableBody
              isLoading={loading}
              items={items}
              emptyContent={
                <NoData
                  title="No document types found"
                  message="Create a document type to start tracking order attachments."
                />
              }
            >
              {(items ?? []).map((item, index) => (
                <TableRow key={item.Id}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "Sr" ? (
                        (page - 1) * ROWS_PER_PAGE + index + 1
                      ) : columnKey === "IsRequired" ? (
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            item.IsRequired
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.IsRequired ? "Required" : "Optional"}
                        </span>
                      ) : columnKey === "SupportedExtensions" ? (
                        item.SupportedExtensions?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {item.SupportedExtensions.map((extension) => (
                              <span
                                key={extension}
                                className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                              >
                                .{extension}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Any supported file
                          </span>
                        )
                      ) : columnKey === "CreatedOn" ? (
                        formatDate(item.CreatedOn)
                      ) : columnKey !== "action" ? (
                        getKeyValue(item, columnKey)
                      ) : (
                        <div className="flex gap-2">
                          <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>
                            <button
                              type="button"
                              onClick={() => openEditModal(item.Id)}
                              aria-label={`Edit ${item.Name}`}
                            >
                              <GoPencil color="green" />
                            </button>
                          </PermissionGuard>
                          <PermissionGuard required={PERMISSIONS_ENUM.ORDER.DELETE}>
                            <button
                              type="button"
                              className="hover:text-red-500 cursor-pointer"
                              onClick={() => openDeleteModal(item.Id)}
                              aria-label={`Delete ${item.Name}`}
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

          <AddOrderDocumentType
            isOpen={isAddModalOpen}
            closeAddModal={closeAddModal}
            isEdit={isEdit}
            orderDocumentTypeId={selectedDocumentTypeId}
          />

          <DeleteOrderDocumentType
            isOpen={isOpenDeleteModal}
            onClose={closeDeleteModal}
            orderDocumentTypeId={selectedDocumentTypeId}
            documentTypeName={selectedDocumentType?.Name}
          />
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default OrderDocumentsPage;
