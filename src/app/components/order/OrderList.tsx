"use client";

import React, { useState, useMemo } from "react";
import {Plus } from "lucide-react";
import OrderDashboard from "./OrderDashboard";
import OrderSearchAndFilters from "./OrderSearchAndFilters";
import OrderTable from "./OrderTable";
import OrderGrid from "./OrderGrid";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import { OrderStatus } from "@/src/types/admin";
import { GetClientsType } from "@/store/useClientStore";
import Pagination from "../shipment/Pagination";
import { ViewToggle } from "../admin/common/ViewToggle";
import { useRouter } from "next/navigation";
import DeleteModal from "../DeleteModal";
import ReorderConfirmation from "../../orders/components/ReorderConfirmation";

interface OrderListProps {
  orders: GetOrdersType[];
  clients: GetClientsType[];
}

const OrderList: React.FC<OrderListProps> = ({ orders, clients }) => {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state moved here
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [openReorderModal, setOpenReorderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.Id === selectedOrderId),
    [orders, selectedOrderId]
  );

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order?.OrderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.OrderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order?.ClientName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.StatusName === statusFilter;
      const matchesClient =
        clientFilter === "all" || order.ClientId.toString() === clientFilter;

      let matchesDateRange = true;
      if (dateRange.start && dateRange.end) {
        const orderDeadline = new Date(order.Deadline);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDateRange =
          orderDeadline >= startDate && orderDeadline <= endDate;
      }

      return (
        matchesSearch && matchesStatus && matchesClient && matchesDateRange
      );
    });
  }, [orders, searchTerm, statusFilter, clientFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset current page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clientFilter, dateRange]);

  const handleViewOrder = (orderId: number) => {
    router.push(`/orders/vieworder/${orderId}`);
  };

  const handleEditOrder = (orderId: number) => {
    router.push(`/orders/editorder/${orderId}`);
  };

  const handleDeleteOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOpenDeleteModal(true);
  };

  const handleReorderOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenReorderModal(true);
  };

  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeReorderModal = () => setOpenReorderModal(false);

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all orders</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <button
            type="button"
            onClick={() => router.push("/orders/addorder")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Order
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <OrderDashboard orders={orders} />

      <OrderSearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        clientFilter={clientFilter}
        onClientChange={setClientFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        clients={clients}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto mt-4 mb-4">
        {viewMode === "table" ? (
          <OrderTable
            orders={paginatedOrders}
            onViewOrder={handleViewOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
            onReorderOrder={handleReorderOrder}
          />
        ) : (
          <OrderGrid
            orders={paginatedOrders}
            onViewOrder={handleViewOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
            onReorderOrder={handleReorderOrder}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-slate-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredOrders.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {isOpenDeleteModal && (
        <DeleteModal
          isOpen={isOpenDeleteModal}
          onClose={closeDeleteModal}
          orderId={selectedOrderId}
          clientId={selectedOrder?.ClientId ?? 0}
        />
      )}

      {openReorderModal && (
        <ReorderConfirmation
          isOpen={openReorderModal}
          onClose={closeReorderModal}
          orderId={selectedOrderId}
          clientId={selectedOrder?.ClientId ?? 0}
        />
      )}
    </div>
  );
};

export default OrderList;
