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
import DeleteProduct from "./DeleteProduct";
import AddProduct from "./AddProduct";

const Products = () => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const users = [
    {
      key: "1",
      id: 1,
      name: "Product 1",
      ProductCategory: "T-shirt",
      FabricType: "Lecra",
      Description: "this is description",
      status: "Active",
    },
    {
      key: "2",
      id: 2,
      name: "T-Shirt",
      ProductCategory: "Hoodie",
      FabricType: "Cotton-432",
      Description: "this is description",
      status: "Paused",
    },
  ];

  const rowsPerPage = 15;
  const pages = Math.ceil(users!.length / rowsPerPage);

  const openAddModal = () => setIsAddModalOpen(true);
  const handleOpenDeleteModal = (clientId: number) => {
    setSelectedProductId(clientId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (clientId: number) => {
    setSelectedProductId(clientId);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };
  const refetchData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users?.slice(start, end);
  }, [page, users]);

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
          <TableColumn key="name" className="text-medium font-bold">
            Name
          </TableColumn>
          <TableColumn key="ProductCategory" className="text-medium font-bold">
            Product Category
          </TableColumn>
          <TableColumn key="FabricType" className="text-medium font-bold">
            Fabric Type
          </TableColumn>
          <TableColumn key="Description" className="text-medium font-bold">
            Description
          </TableColumn>
          <TableColumn key="action" className="text-medium font-bold">
            Action
          </TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading} items={items}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey !== "action" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEditModal(item.id)}>
                        <MdEditSquare
                          className="hover:text-green-800"
                          size={18}
                        />
                      </button>
                      <button
                        type="button"
                        className="hover:text-red-500"
                        onClick={() => handleOpenDeleteModal(item.id)}
                      >
                        <MdDelete size={18} />
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
        onOrderAdded={refetchData}
        isEdit={isEdit}
        clientId={selectedProductId}
      />

      <DeleteProduct
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        productId={selectedProductId}
        onDeleteSuccess={refetchData}
      />
    </div>
  );
};

export default Products;
