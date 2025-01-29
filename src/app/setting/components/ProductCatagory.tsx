"use client";

import { useMemo, useState } from "react";
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
import AddProduct from "./AddProduct";
import { useFetchProductCatagory } from "../../services/useFetchProductCatagory";
import DeleteProductCatagory from "./DeleteProductCatagory";
import { formatDate } from "../../interfaces";
import AddProductCatagory from "./AddProductCatagory";

const ProductCatagory = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductCatId, setSelectedProductCatId] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { isLoading, productCatagory } = useFetchProductCatagory({
    refreshKey,
  });

  const rowsPerPage = 15;
  const pages = Math.ceil(productCatagory!.length / rowsPerPage);

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
  const refetchData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return productCatagory?.slice(start, end);
  }, [page, productCatagory]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
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
        <TableBody isLoading={isLoading} items={items}>
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
                      <button type="button">
                        <MdEditSquare
                          className="hover:text-green-800 cursor-pointer"
                          onClick={() => openEditModal(item.id)}
                        />
                      </button>
                      <button
                        type="button"
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => handleOpenDeleteModal(item.id)}
                      >
                        <MdDelete />
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
        onOrderAdded={refetchData}
        isEdit={isEdit}
        productIdCatagory={selectedProductCatId}
      />

      <DeleteProductCatagory
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        productIdCatagory={selectedProductCatId}
        onDeleteSuccess={refetchData}
      />
    </div>
  );
};

export default ProductCatagory;
