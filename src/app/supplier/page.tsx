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
import { FiPlus } from "react-icons/fi";
import useSupplierStore from "@/store/useSupplierStore";
import { formatDate } from "../interfaces";
import AddSupplier from "./components/AddSupplier";
import DeleteSupplier from "./components/DeleteSupplier";
import AdminLayout from "../adminDashboard/lauout";

const Supplier = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { loading, fetchSuppliers, suppliers } = useSupplierStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(suppliers!.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return suppliers?.slice(start, end);
  }, [page, suppliers]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const handleOpenDeleteModal = (clientId: number) => {
    setSelectedSupplierId(clientId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const handleOpenEditModal = (clientId: number) => {
    setSelectedSupplierId(clientId);
    setIsEdit(true);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-end">
          <button
            type="button"
           className="text-sm rounded-full bg-green-400 text-black font-semibold px-3 py-2 flex items-center gap-1"
            onClick={openAddModal}
          >
            <FiPlus />
            Add New
          </button>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="grid grid-cols-2">
              <span className="w-[30%] text-small text-gray-500">
                Total: {items.length || 0}
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
            <TableColumn key="Sr" className="text-medium font-bold">
            Sr
            </TableColumn>
            <TableColumn key="Name" className="text-medium font-bold">
              Name
            </TableColumn>
            <TableColumn key="Phone" className="text-medium font-bold">
              Phone
            </TableColumn>
            <TableColumn key="Email" className="text-medium font-bold">
              Email
            </TableColumn>
            <TableColumn key="City" className="text-medium font-bold">
            City
            </TableColumn>
            <TableColumn key="State" className="text-medium font-bold">
            State
            </TableColumn>
            <TableColumn key="Country" className="text-medium font-bold">
            Country
            </TableColumn>
            <TableColumn key="CompleteAddress" className="text-medium font-bold">
           Address
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
                    {columnKey === "CreatedOn" || columnKey === "UpdatedOn" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleOpenDeleteModal(item.Id)}
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

        <AddSupplier
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          supplierId={selectedSupplierId}
        />

        <DeleteSupplier
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          supplierId={selectedSupplierId}
        />
      </div>
    </>
  );
};

export default Supplier;
