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
import { formatDate } from "../interfaces";
import AdminLayout from "../adminDashboard/lauout";
import useUnitOfMeasureStore from "@/store/useUnitOfMeasureStore";
import DeleteModal from "./DeleteModal";
import AddUnitOfMeasure from "./AddUnitOfMeasure";

const page = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {loading ,fetchUnitOfMeasures, unitMeasures} = useUnitOfMeasureStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(unitMeasures!.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return unitMeasures?.slice(start, end);
  }, [page, unitMeasures]);

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
    fetchUnitOfMeasures();
  }, []);

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">Suppliers</h6>
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
            <TableColumn key="ShortForm" className="text-medium font-bold">
            Short Form
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

        
        <AddUnitOfMeasure
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          Id={selectedSupplierId}
        />

         <DeleteModal
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          supplierId={selectedSupplierId}
        />
      </div>
    </AdminLayout>
  );
};

export default page;
