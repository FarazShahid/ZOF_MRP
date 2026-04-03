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
import useCarriorStore from "@/store/useCarriorStore";
import CarriorForm from "./CarriorForm";
import DeleteCarrior from "./DeleteCarrior";
import { Plus } from "lucide-react";
import PermissionGuard from "@/src/app/components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const CarriorTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { fetchCarriors, loading, Carriors } = useCarriorStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(Carriors?.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return Carriors?.slice(start, end);
  }, [page, Carriors]);

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
    fetchCarriors();
  }, []);

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Carriers</h2>
            <p className="text-gray-600 mt-1">Manage shipping carriers</p>
          </div>

          <PermissionGuard required={PERMISSIONS_ENUM.CARRIERS.ADD}>
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Carrier
            </button>
          </PermissionGuard>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
          <Table
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
                  color="success"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px] !bg-transparent dark:!bg-transparent shadow-none",
              th: "tableHeaderWrapper",
              tr: "hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors",
              td: "text-gray-700 dark:text-slate-300",
            }}
          >
            <TableHeader>
              <TableColumn key="Name" className="text-medium font-bold">
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
                        <div className="flex items-center gap-2">
                          <PermissionGuard
                            required={PERMISSIONS_ENUM.CARRIERS.UPDATE}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item?.Id)}
                              className="p-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-md transition-colors"
                            >
                              <GoPencil className="w-3.5 h-3.5" />
                            </button>
                          </PermissionGuard>

                          <PermissionGuard
                            required={PERMISSIONS_ENUM.CARRIERS.DELETE}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenDeleteModal(item?.Id)}
                              className="p-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white rounded-md transition-colors"
                            >
                              <RiDeleteBin6Line className="w-3.5 h-3.5" />
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
        </div>
      </div>

      <CarriorForm
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        Id={selectedItemId}
      />

      <DeleteCarrior
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        Id={selectedItemId}
      />
    </>
  );
};

export default CarriorTable;
