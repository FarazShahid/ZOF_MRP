"use client";

import { useMemo, useState } from "react";
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

const ShipmentTable = () => {
  const [page, setPage] = useState<number>(1);

  const loading = false;
  const ShipmentDetail = [
    {
      id: 1,
      trackingId: "LWA218392-212",
      orderNumber: "CR-434-TR",
      curiorPartner: "DHL",
      Date: "02-07-2025",
      weight: "35kg",
      status: "Shipped",
    },
  ];

  const rowsPerPage = 15;
  const pages = Math.ceil(ShipmentDetail?.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return ShipmentDetail?.slice(start, end);
  }, [page, ShipmentDetail]);

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
                Total: {ShipmentDetail?.length || 0}
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
            <TableColumn key="trackingId" className="text-medium font-bold">
              Tracking ID
            </TableColumn>
            <TableColumn key="orderNumber" className="text-medium font-bold">
              Order Number
            </TableColumn>
            <TableColumn key="curiorPartner" className="text-medium font-bold">
              Curior Partner
            </TableColumn>
            <TableColumn key="Date" className="text-medium font-bold">
              Date
            </TableColumn>
            <TableColumn key="weight" className="text-medium font-bold">
              Weight
            </TableColumn>
            <TableColumn key="status" className="text-medium font-bold">
              Status
            </TableColumn>
            <TableColumn key="Action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(item) => (
              <TableRow key={`${item?.id}`}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey !== "Action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button type="button">
                          <FaRegEye color="blue" />
                        </button>
                        <button type="button">
                          <GoPencil color="green" />
                        </button>
                        <button type="button">
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
    </div>
  );
};

export default ShipmentTable;
