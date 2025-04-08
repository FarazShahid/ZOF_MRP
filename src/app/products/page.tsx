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
import useProductStore from "@/store/useProductStore";
import { FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteProduct from "./DeleteProduct";
import AddProduct from "./AddProduct";
import AdminLayout from "../adminDashboard/lauout";

const page = () => {
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
    <AdminLayout>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-end">
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
            <div className="grid grid-cols-3">
              <span className="w-[20%] text-small text-gray-500">
                Total: {products.length || 0}
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
              <div></div>
            </div>
          }
        >
          <TableHeader>
            <TableColumn key="Sr" className="text-medium font-bold">
              Sr
            </TableColumn>
            <TableColumn key="Name" className="text-medium font-bold">
              Name
            </TableColumn>
            <TableColumn
              key="ProductCategoryName"
              className="text-medium font-bold"
            >
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
            {(items ?? []).map((item: any, index: number) => (
              <TableRow key={item.Id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "Name" ? (
                      `${item.FabricName} ${item.ProductCategoryName} ${item?.GSM}`
                    ) : columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item.Id)}
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

        {isAddModalOpen ? (
          <AddProduct
            isOpen={isAddModalOpen}
            closeAddModal={closeAddModal}
            isEdit={isEdit}
            productId={selectedProductId}
          />
        ) : (
          <></>
        )}
        {isOpenDeletModal ? (
          <DeleteProduct
            isOpen={isOpenDeletModal}
            onClose={closeDeleteModal}
            productId={selectedProductId}
          />
        ) : (
          <></>
        )}
      </div>
    </AdminLayout>
  );
};

export default page;
