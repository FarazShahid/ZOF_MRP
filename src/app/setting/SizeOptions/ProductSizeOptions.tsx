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
import { FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import AddSizeOptions from "./AddSizeOptions";
import DeleteSizeOptions from "./DeleteSizeOptions";
import AddButton from "../../components/common/AddButton";

const ProductSizeOptions = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedSizeOptionId, setSelectedSizeOptionId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { fetchsizeOptions, sizeOptions, loading } = useSizeOptionsStore();

  useEffect(() => {
    fetchsizeOptions();
  }, []);

  const rowsPerPage = 10;
  const pages = Math.ceil(sizeOptions?.length / rowsPerPage);

  const openAddModal = () => setIsAddModalOpen(true);

  const handleOpenDeleteModal = (sizeOptionId: number) => {
    setSelectedSizeOptionId(sizeOptionId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (sizeId: number) => {
    setSelectedSizeOptionId(sizeId);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sizeOptions?.slice(start, end);
  }, [page, sizeOptions]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">Size Options</h6>
          <AddButton title="Add New" onClick={openAddModal} />
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
                Total: {sizeOptions?.length || 0}
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
            <TableColumn
              key="OptionSizeOptions"
              className="text-medium font-bold"
            >
              Size Option
            </TableColumn>
            <TableColumn key="ProductRegionName" className="text-medium font-bold">
              Region
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
                          onClick={() => openEditModal(item?.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleOpenDeleteModal(item?.Id)}
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
          <AddSizeOptions
            isOpen={isAddModalOpen}
            closeAddModal={closeAddModal}
            isEdit={isEdit}
            sizeOptionId={selectedSizeOptionId}
          />
        ) : (
          <></>
        )}

        <DeleteSizeOptions
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          sizeOptionId={selectedSizeOptionId}
        />
      </div>
    </>
  );
};

export default ProductSizeOptions;
