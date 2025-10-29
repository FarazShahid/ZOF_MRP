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
import useColorOptionsStore from "@/store/useColorOptionsStore";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteColorOptions from "./DeleteColorOptions";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { ROWS_PER_PAGE } from "@/src/types/admin";

const ColorOptions = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductCatId, setSelectedProductCatId] = useState<number>(0);

  const { colorOptions, fetchColorOptions, loading } =
    useColorOptionsStore();

  useEffect(() => {
    fetchColorOptions();
  }, []);

  const pages = Math.ceil(colorOptions?.length / ROWS_PER_PAGE);

  const handleOpenDeleteModal = (productCatagoryId: number) => {
    setSelectedProductCatId(productCatagoryId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  


  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return colorOptions?.slice(start, end);
  }, [page, colorOptions]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h6 className="font-sans text-lg font-semibold">Color Options</h6>

        <PermissionGuard required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.ADD}>
          <Link
            href={"/setting/coloroptions/addColor"}
            className="text-sm rounded-full dark:bg-blue-600 bg-blue-800 text-white font-semibold px-3 py-2 flex items-center gap-2"
          >
            <FiPlus />
            Add New
          </Link>
        </PermissionGuard>
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
          <div className="flex items-center justify-between gap-2">
            <span className="text-small text-gray-500">
              Items per Page: {items?.length || 0}
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
            <span className="text-small text-gray-500">
              Total Items   : {colorOptions?.length || 0}
            </span>
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
                      <PermissionGuard
                        required={PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.DELETE}
                      >
                        <button
                          type="button"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleOpenDeleteModal(item?.Id)}
                        >
                          <RiDeleteBin6Line color="red" />
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

      <DeleteColorOptions
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        colorId={selectedProductCatId}
      />
    </div>
  );
};

export default ColorOptions;
