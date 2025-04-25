"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import useColorOptionsStore from "@/store/useColorOptionsStore";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import DeleteColorOptions from "./DeleteColorOptions";
import AddColorOptions from "./AddColorOptions";
import AdminLayout from "../../adminDashboard/lauout";

const page = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductCatId, setSelectedProductCatId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { colorOptions, fetchColorOptions, loading, error } =
    useColorOptionsStore();

  useEffect(() => {
    fetchColorOptions();
  }, []);

  const rowsPerPage = 10;
  const pages = Math.ceil(colorOptions!.length / rowsPerPage);

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

    return colorOptions?.slice(start, end);
  }, [page, colorOptions]);

  return (
    <AdminLayout>
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h6 className="font-sans text-lg font-semibold">Color Options</h6>
        <Link
        href={"/setting/coloroptions/addColor"}
          className="flex items-center gap-2 text-white bg-[#584BDD] px-2 py-1 rounded-lg text-sm"
        >
          <FiPlus />
          Add New
        </Link>
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
          <div className="grid grid-cols-2 mt-5">
              <span className="w-[30%] text-small text-gray-500">
                Total: {colorOptions.length || 0}
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
      >
        <TableHeader>
          <TableColumn key="Sr" className="text-medium font-bold">
            Sr
          </TableColumn>
          <TableColumn key="Name" className="text-medium font-bold">
            Name
          </TableColumn>
          <TableColumn key="HexCode" className="text-medium font-bold">
            Color
          </TableColumn>
          <TableColumn key="CreatedOn" className="text-medium font-bold">
            Created On
          </TableColumn>
          <TableColumn key="CreatedBy" className="text-medium font-bold">
            Created By
          </TableColumn>
          <TableColumn key="UpdatedOn" className="text-medium font-bold">
            Updated On
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
                  ) : columnKey === "HexCode" ? (
                    <div className="flex items-center gap-1">
                      <div
                        className="rounded-lg w-[100px] h-4"
                        style={{ background: `${item.HexCode}` }}
                      ></div>
                    </div>
                  ) : columnKey !== "action" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <div className="flex gap-2">
                      {/* <button
                        type="button"
                        onClick={() => openEditModal(item.Id)}
                      >
                        <GoPencil color="green" />
                      </button> */}
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

      {/* <AddColorOptions
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        colorId={selectedProductCatId}
      /> */}

      <DeleteColorOptions
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        colorId={selectedProductCatId}
      />
    </div>
    </AdminLayout>
  );
};

export default page;
