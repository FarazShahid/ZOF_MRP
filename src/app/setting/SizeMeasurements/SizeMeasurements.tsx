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
import { formatDate } from "../../interfaces";
import useSizeMeasurementsStore from "@/store/useSizeMeasurementsStore";
import ViewModal from "./ViewModal";
import DeleteSizeOptions from "./DeleteSizeOptions";
import AddSizeOptions from "./AddSizeOptions";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import { FiPlus } from "react-icons/fi";

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

  const rowsPerPage = 10;
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
    debugger;
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
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sizeMeasurement?.slice(start, end);
  }, [page, sizeMeasurement]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h6 className="font-sans text-lg font-semibold">Size Measurements</h6>
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
          <TableColumn key="Measurement1" className="text-medium font-bold">
            Name
          </TableColumn>
          <TableColumn key="SizeOptionName" className="text-medium font-bold">
            Size Option
          </TableColumn>
          <TableColumn key="FrontLengthHPS" className="text-medium font-bold">
            Front Length HPS
          </TableColumn>
          <TableColumn key="BackLengthHPS" className="text-medium font-bold">
            Back Length HPS
          </TableColumn>
          <TableColumn key="AcrossShoulders" className="text-medium font-bold">
            Across Shoulders
          </TableColumn>
          <TableColumn key="ArmHole" className="text-medium font-bold">
            ArmHole
          </TableColumn>
          <TableColumn key="UpperChest" className="text-medium font-bold">
            UpperChest
          </TableColumn>
          <TableColumn key="LowerChest" className="text-medium font-bold">
            Lower Chest
          </TableColumn>
          <TableColumn key="Waist" className="text-medium font-bold">
            Waist
          </TableColumn>
          <TableColumn key="BottomWidth" className="text-medium font-bold">
            Bottom Width
          </TableColumn>
          <TableColumn key="SleeveLength" className="text-medium font-bold">
            Sleeve Length
          </TableColumn>
          <TableColumn key="SleeveOpening" className="text-medium font-bold">
            Sleeve Opening
          </TableColumn>
          <TableColumn key="NeckSize" className="text-medium font-bold">
            Neck Size
          </TableColumn>
          <TableColumn key="CollarHeight" className="text-medium font-bold">
            Collar Height
          </TableColumn>
          <TableColumn
            key="CollarPointHeight"
            className="text-medium font-bold"
          >
            Collar Point Height
          </TableColumn>
          <TableColumn key="StandHeightBack" className="text-medium font-bold">
            Stand Height Back
          </TableColumn>
          <TableColumn
            key="CollarStandLength"
            className="text-medium font-bold"
          >
            Collar Stand Length
          </TableColumn>
          <TableColumn key="SideVentFront" className="text-medium font-bold">
            Side Vent Front
          </TableColumn>
          <TableColumn key="SideVentBack" className="text-medium font-bold">
            Side Vent Back
          </TableColumn>
          <TableColumn key="PlacketLength" className="text-medium font-bold">
            Placket Length
          </TableColumn>
          <TableColumn
            key="TwoButtonDistance"
            className="text-medium font-bold"
          >
            Two Button Distance
          </TableColumn>
          <TableColumn key="PlacketWidth" className="text-medium font-bold">
            Placket Width
          </TableColumn>
          <TableColumn key="BottomHem" className="text-medium font-bold">
            Bottom Hem
          </TableColumn>
          <TableColumn key="CreatedOn" className="text-medium font-bold">
            Created On
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
            <TableRow
              key={item.Id}
              onClick={() => openViewModal(item.Id)}
              className="cursor-pointer"
            >
              {(columnKey) => (
                <TableCell>
                  {columnKey === "CreatedOn" || columnKey === "UpdatedOn" ? (
                    formatDate(item[columnKey])
                  ) : columnKey === "Sr" ? (
                    index + 1
                  ) : columnKey !== "action" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <div
                      className="flex gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
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
        sizeId={selectedSizeOptionId}
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
