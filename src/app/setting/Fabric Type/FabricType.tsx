"use client";

import { useEffect, useMemo, useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdDelete, MdEditSquare } from "react-icons/md";
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
import useFabricStore from "@/store/useFabricStore";
import DeleteFabricType from "./DeleteFabricType";
import AddFabricType from "./AddFabricType";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";

const FabricType = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductCatId, setSelectedProductCatId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

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

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return fabricTypeData?.slice(start, end);
  }, [page, fabricTypeData]);

  return (
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
          <div className="flex w-full justify-center">
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
          <TableColumn key="type" className="text-medium font-bold">
            Type
          </TableColumn>
          <TableColumn key="name" className="text-medium font-bold">
            Name
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
  );
};

export default FabricType;
