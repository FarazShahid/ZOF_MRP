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
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
// import AddSizeOptions from "./AddSizeOptions";
// import DeleteSizeOptions from "./DeleteSizeOptions";
import { formatDate } from "../../interfaces";
import useSizeMeasurementsStore from "@/store/useSizeMeasurementsStore";
import ViewModal from "./ViewModal";
import DeleteSizeOptions from "./DeleteSizeOptions";
import AddSizeOptions from "./AddSizeOptions";

const SizeMeasurements = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedSizeOptionId, setSelectedSizeOptionId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isViewModal, setIsViewModal] = useState<boolean>(false);

  const { fetchSizeMeasurements, sizeMeasurement, loading } =
    useSizeMeasurementsStore();

  useEffect(() => {
    fetchSizeMeasurements();
  }, []);

  const rowsPerPage = 13;
  const pages = Math.ceil(sizeMeasurement!.length / rowsPerPage);

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
  const openViewModal = (sizeId: number) => {
    setSelectedSizeOptionId(sizeId);
    setIsViewModal(true);
  };
  const handleCloseModal = () => {
    setIsViewModal(false);
    setSelectedSizeOptionId(0);
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sizeMeasurement?.slice(start, end);
  }, [page, sizeMeasurement]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h6 className="font-sans text-lg font-semibold">Size Options</h6>
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
          <TableColumn key="Measurement1" className="text-medium font-bold">
            Name
          </TableColumn>
          <TableColumn key="SizeOption" className="text-medium font-bold">
            Size Option
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
          {(item) => (
            <TableRow key={item.Id} onClick={() => openViewModal(item.Id)} className="cursor-pointer">
              {(columnKey) => (
                <TableCell>
                  {columnKey === "CreatedOn" || columnKey === "UpdatedOn" ? (
                    formatDate(item[columnKey])
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
          )}
        </TableBody>
      </Table>

      {isViewModal ? (
        <ViewModal
          isOpen={isViewModal}
          closeAddModal={handleCloseModal}
          sizeOptionId={selectedSizeOptionId}
        />
      ) : (
        <></>
      )}

      <AddSizeOptions
        isOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
        isEdit={isEdit}
        sizeOptionId={selectedSizeOptionId}
      />
    
      <DeleteSizeOptions
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        sizeOptionId={selectedSizeOptionId}
      />
    </div>
  );
};

export default SizeMeasurements;
