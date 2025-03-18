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
import DeleteProduct from "./DeleteProduct";
import useProductStore from "@/store/useProductStore";
import AddProduct from "./AddProduct";

const Products = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { fetchProducts, products, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const rowsPerPage = 13;
  const pages = Math.ceil(products!.length / rowsPerPage);

  const openAddModal = () => setIsAddModalOpen(true);

  const handleOpenDeleteModal = (productId: number) => {
    setSelectedProductId(productId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (productId: number) => {
    setSelectedProductId(productId);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products?.slice(start, end);
  }, [page, products]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
      <h6 className="font-sans text-lg font-semibold">Products</h6>
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
          <TableColumn key="Name" className="text-medium font-bold">
          Name
          </TableColumn>
          <TableColumn key="ProductCategoryName" className="text-medium font-bold">
          Product Category
          </TableColumn>
          <TableColumn key="FabricName" className="text-medium font-bold">
          Fabric
          </TableColumn>
          <TableColumn key="FabricType" className="text-medium font-bold">
          Fabric Type
          </TableColumn>
          <TableColumn key="GSM" className="text-medium font-bold">
          GSM
          </TableColumn>
          <TableColumn key="Description" className="text-medium font-bold">
          Description
          </TableColumn>
          <TableColumn key="action" className="text-medium font-bold">
            Action
          </TableColumn>
        </TableHeader>
        <TableBody isLoading={loading} items={items}>
          {(item) => (
            <TableRow key={item.Id}>
              {(columnKey) => (
                <TableCell>
                  {
                  columnKey === "Name" ? (
                    `${item.FabricName} ${item.ProductCategoryName}`
                  ) :
                  columnKey !== "action" ? (
                    getKeyValue(item, columnKey)
                  ): (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item.Id)}
                      >
                        <MdEditSquare
                          className="hover:text-green-800 cursor-pointer"
                          size={18}
                        />
                      </button>
                      <button
                        type="button"
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => handleOpenDeleteModal(item.Id)}
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
       <AddProduct
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        productId={selectedProductId}
      />
      <DeleteProduct
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        productId={selectedProductId}
      />
    </div>
  );
};

export default Products;
