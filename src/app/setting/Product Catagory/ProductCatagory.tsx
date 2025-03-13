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
import DeleteProductCatagory from "./DeleteProductCatagory";
import { formatDate } from "../../interfaces";
import AddProductCatagory from "./AddProductCatagory";
import useCategoryStore from "@/store/useCategoryStore";

const ProductCatagory = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductCatId, setSelectedProductCatId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { productCategories, fetchCategories, loading, error } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const rowsPerPage = 13;
  const pages = Math.ceil(productCategories!.length / rowsPerPage);

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

    return productCategories?.slice(start, end);
  }, [page, productCategories]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h6 className="font-sans text-lg font-semibold">Product Category</h6>
        <button
          type="button"
          className="flex items-center font-semibold gap-2 hover:bg-green-900 hover:text-white bg-gray-300 px-3 py-1 rounded-lg"
          onClick={openAddModal}
        >
          <IoAddCircleSharp size={25} />
          Add
        </button>
      </div>
      <Table
        isStriped
        isHeaderSticky
        aria-label="Product Table with pagination"
        classNames={{
          wrapper: "min-h-[222px]",
           th:"tableHeaderWrapper"
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
          <TableColumn key="type" className="text-medium font-bold">
            Name
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
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "createdOn" || columnKey === "updatedOn" ? (
                    formatDate(item[columnKey])
                  ) : columnKey !== "action" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item.id)}
                      >
                        <MdEditSquare
                          className="hover:text-green-800 cursor-pointer"
                          size={18}
                        />
                      </button>
                      <button
                        type="button"
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => handleOpenDeleteModal(item.id)}
                      >
                        <MdDelete className="hover:text-red-500" size={18} />
                      </button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddProductCatagory
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        productIdCatagory={selectedProductCatId}
      />

      <DeleteProductCatagory
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        productIdCatagory={selectedProductCatId}
      />
    </div>
  );
};

export default ProductCatagory;
