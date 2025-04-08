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

import AddOrderComponent from "../components/AddOrderComponent";
import { formatDate } from "../interfaces";
import ViewOrderComponent from "../components/ViewOrderComponent";
import DeleteModal from "../components/DeleteModal";
import StatusChip from "../components/StatusChip";
import useOrderStore from "@/store/useOrderStore";
import { FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import useClientStore from "@/store/useClientStore";
import AdminLayout from "../adminDashboard/lauout";

const page = () => {
  const [clientId, setClientId] = useState<number>(0);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isEditOrder, setIsisEditOrder] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const { fetchOrders, loading, Orders } = useOrderStore();
  const { fetchClients, clients } = useClientStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(Orders!.length / rowsPerPage);
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
    setSelectedOrderId(orderId);
    setIsOpenViewModal(true);
  };
  const closeViewModal = () => {
    setSelectedOrderId(0);
    setIsOpenViewModal(false);
  };
  const openAddOrderModal = () => {
    setIsisEditOrder(false);
    setSelectedOrderId(0);
    setIsAddOrderModalOpen(true);
  };
  const closeAddOrderModal = () => {
    setIsAddOrderModalOpen(false);
  };

  const openEditOrderModal = (OrderId: number) => {
    setIsisEditOrder(true);
    setRefreshKey((prev) => prev + 1);
    setSelectedOrderId(OrderId);
    setIsAddOrderModalOpen(true);
  };

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    fetchOrders(clientId);
  }, [clientId]);

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <select
            className="p-1 rounded-lg border-1"
            onChange={(e) => handleClinetFilter(e.target.value)}
          >
            <option value={0}>View All</option>
            {clients.map((client) => {
              return <option value={client.Id}>{client.Name}</option>;
            })}
          </select>
          <button
            type="button"
            className="flex items-center gap-2 text-white bg-[#584BDD] px-2 py-1 rounded-lg text-sm"
            onClick={openAddOrderModal}
          >
            <FiPlus />
            Add New
          </button>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="grid grid-cols-2">
              <span className="w-[30%] text-small text-gray-500">
                Total: {items.length || 0}
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
            <TableColumn key="UpdatedOn" className="text-medium font-bold">
            Updated On
            </TableColumn>
            <TableColumn key="Action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(item) => (
              <TableRow key={item.Id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "UpdatedOn" || columnKey === "Deadline" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "StatusName" ? (
                      <StatusChip OrderStatus={item.StatusName} />
                    ) : columnKey !== "Action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => OpenViewModal(item.Id)}
                        >
                          <FaRegEye color="blue" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditOrderModal(item.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(item.Id)}
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

      {isAddOrderModalOpen ? (
        <AddOrderComponent
          isOpen={isAddOrderModalOpen}
          clientId={clientId}
          onClose={closeAddOrderModal}
          onOrderAdded={refreshData}
          isEditOrder={isEditOrder}
          refreshKey={refreshKey}
          orderId={selectedOrderId}
        />
      ) : (
        <></>
      )}

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

      {isOpenViewModal ? (
        <ViewOrderComponent
          isOpen={isOpenViewModal}
          onClose={closeViewModal}
          selectedOrderId={selectedOrderId}
        />
      ) : (
        <></>
      )}
    </AdminLayout>
  );
};

export default page;
