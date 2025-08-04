"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@heroui/react";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import useShipmentStore from "@/store/useShipmentStore";
import { formatDate } from "../../interfaces";
import DeleteShipment from "./DeleteShipment";
import { useRouter } from "next/navigation";
import ViewShipmentDetails from "./ViewShipmentDetails";

const ShipmentTable = () => {
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const { fetchShipments, loading, Shipments } = useShipmentStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(Shipments?.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return Shipments?.slice(start, end);
  }, [page, Shipments]);

  const handleOpenDeleteModal = (id: number) => {
    setSelectedItemId(id);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  const handleEditShipment = (id: number) => {
    router.push(`/shipment/editshipment/${id}`);
  };

  const handleViewModal = (id: number) => {
    setSelectedItemId(id);
    setIsOpenViewModal(true);
  };
  const closeViewModal = () => {
    setIsOpenViewModal(false);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <div className="flex justify-end">
          <Link
            href={"/shipment/addshipment"}
            type="button"
            className="text-sm rounded-full dark:bg-blue-600 bg-blue-800 text-white font-semibold px-3 py-2 flex items-center gap-2"
          >
            <FiPlus />
            Add New
          </Link>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="grid grid-cols-2">
              <span className="w-[30%] text-small text-gray-500">
                Total: {items?.length || 0}
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
          classNames={{
            wrapper: "min-h-[222px]",
            th: "tableHeaderWrapper",
          }}
        >
          <TableHeader>
            <TableColumn key="ShipmentCode" className="text-medium font-bold">
              Shipment Code
            </TableColumn>
            <TableColumn key="OrderNumber" className="text-medium font-bold">
              Order No.
            </TableColumn>
            <TableColumn
              key="ShipmentCarrierName"
              className="text-medium font-bold"
            >
              Carrier  Name
            </TableColumn>
            <TableColumn key="ShipmentDate" className="text-medium font-bold">
              Shipment Date
            </TableColumn>
            <TableColumn key="TotalWeight" className="text-medium font-bold">
              Weight
            </TableColumn>
            <TableColumn key="NumberOfBoxes" className="text-medium font-bold">
              Number Of Boxes
            </TableColumn>
            <TableColumn key="Status" className="text-medium font-bold">
              Status
            </TableColumn>
            <TableColumn key="UpdatedOn" className="text-medium font-bold">
              Updated On
            </TableColumn>
            <TableColumn key="Action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(item) => (
              <TableRow key={`${item?.Id}`}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "ShipmentDate" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "UpdatedOn" ? (
                      formatDate(item[columnKey])
                    ) : columnKey !== "Action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          id="viewBtn"
                          onClick={() => handleViewModal(item.Id)}
                        >
                          <FaRegEye color="blue" />
                        </button>
                        <button
                          type="button"
                          id="editBtn"
                          onClick={() => handleEditShipment(item.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          id="deleteBtn"
                          onClick={() => handleOpenDeleteModal(item.Id)}
                        >
                          <RiDeleteBin6Line color="red" />
                        </button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isOpenViewModal && (
        <ViewShipmentDetails
          Id={selectedItemId}
          isOpen={isOpenViewModal}
          onClose={closeViewModal}
        />
      )}

      <DeleteShipment
        Id={selectedItemId}
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
      />
    </div>
  );
};

export default ShipmentTable;
