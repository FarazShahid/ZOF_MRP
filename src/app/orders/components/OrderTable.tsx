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
  Tooltip,
  getKeyValue,
} from "@heroui/react";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlus, FiSettings } from "react-icons/fi";

import useOrderStore from "@/store/useOrderStore";
import useClientStore from "@/store/useClientStore";
import { formatDate } from "../../interfaces";
import StatusChip from "../../components/StatusChip";
import DeleteModal from "../../components/DeleteModal";
import PriorityChip from "./PriorityChip";
import { useRouter } from "next/navigation";

const OrderTable = () => {
  const [clientId, setClientId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  const { fetchOrders, loading, Orders } = useOrderStore();
  const { fetchClients, clients } = useClientStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(Orders?.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return Orders?.slice(start, end);
  }, [page, Orders]);

  const handleClinetFilter = (id: string) => {
    setClientId(Number(id));
  };

  const openDeleteModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  const OpenViewModal = (orderId: number) => {
    router.push(`/orders/vieworder/${orderId}`)
    // setSelectedOrderId(orderId);
    // setIsOpenViewModal(true);
  };
  const closeViewModal = () => {
    setSelectedOrderId(0);
    setIsOpenViewModal(false);
  };

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (clientId) {
      fetchOrders(clientId);
    } else {
      fetchOrders();
    }
  }, [fetchOrders,clientId]);

  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <div>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <select
            className="p-1 rounded-lg border-1"
            onChange={(e) => handleClinetFilter(e.target.value)}
          >
            <option value={0}>View All</option>
            {clients?.map((client, index) => {
              return (
                <option value={client?.Id} key={index}>
                  {client?.Name}
                </option>
              );
            })}
          </select>

          <div className="flex items-center gap-2">
            <Tooltip content="Order Status">
              <Link
                href={"/orders/orderstatus"}
                className="dark:bg-slate-500 bg-slate-300 dark:text-white text-gray-800 rounded-lg p-2"
              >
                <FiSettings size={20} />
              </Link>
            </Tooltip>
            <Link
              href={"/orders/addorder"}
              type="button"
              className="text-sm rounded-full dark:bg-blue-600 bg-blue-800 text-white font-semibold px-3 py-2 flex items-center gap-2"
            >
              <FiPlus />
              Add New
            </Link>
          </div>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="grid grid-cols-2">
              <span className="w-[30%] text-small text-gray-500">
                Total: {Orders?.length || 0}
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
            <TableColumn key="OrderName" className="text-medium font-bold">
              Order Name
            </TableColumn>
            <TableColumn key="OrderNumber" className="text-medium font-bold">
              Order No.
            </TableColumn>
            <TableColumn key="ClientName" className="text-medium font-bold">
              Client
            </TableColumn>
            <TableColumn key="EventName" className="text-medium font-bold">
              Event
            </TableColumn>
            <TableColumn key="StatusName" className="text-medium font-bold">
              Status
            </TableColumn>
            <TableColumn key="OrderPriority" className="text-medium font-bold">
              Priority
            </TableColumn>
            <TableColumn key="Deadline" className="text-medium font-bold">
              Deadline
            </TableColumn>
            <TableColumn key="Action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(item) => (
              <TableRow key={`${item?.Id}_${item?.OrderNumber}`}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "Deadline" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "OrderPriority" ? (
                      <PriorityChip priority={item?.OrderPriority} />
                    ) : columnKey === "StatusName" ? (
                      <StatusChip OrderStatus={item?.StatusName} />
                    ) : columnKey !== "Action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => OpenViewModal(item?.Id)}
                        >
                          <FaRegEye color="blue" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(item?.Id)}
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

      {isOpenDeletModal ? (
        <DeleteModal
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          orderId={selectedOrderId}
          clientId={clientId}
          onDeleteSuccess={refreshData}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default OrderTable;
