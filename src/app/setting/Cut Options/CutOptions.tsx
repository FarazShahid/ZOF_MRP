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

import useCutOptionsStore from "@/store/useCutOptionsStore";
import { formatDate } from "../../interfaces";
import AddCutOptions from "./AddCutOptions";
import DeleteCutOptions from "./DeleteCutOptions";

const CutOptions = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedCutOptionId, setSelectedCutOptionId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { fetchcutOptions, cutOptions, loading } = useCutOptionsStore();

  useEffect(() => {
    fetchcutOptions();
  }, []);

  const rowsPerPage = 13;
  const pages = Math.ceil(cutOptions!.length / rowsPerPage);

  const openAddModal = () => setIsAddModalOpen(true);

  const handleOpenDeleteModal = (productCatagoryId: number) => {
    setSelectedCutOptionId(productCatagoryId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (clientId: number) => {
    setSelectedCutOptionId(clientId);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return cutOptions?.slice(start, end);
  }, [page, cutOptions]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h6 className="font-sans text-lg font-semibold">Product Cut Options</h6>
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
          <TableColumn
            key="OptionProductCutOptions"
            className="text-medium font-bold"
          >
            Cut Option
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
                  ) : columnKey !== "action" ? (
                    getKeyValue(item, columnKey)
                  ) : (
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
          ))}
        </TableBody>
      </Table>

      <AddCutOptions
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        cutOptionId={selectedCutOptionId}
      />
      <DeleteCutOptions
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        cutOptionId={selectedCutOptionId}
      />
    </div>
  );
};

export default CutOptions;
