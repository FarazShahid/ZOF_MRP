"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";

import { Plus } from "lucide-react";
import { OrderStatus } from "@/src/types/admin";

import DeleteModal from "../DeleteModal";
import Pagination from "../common/Pagination";
import { TableSkel } from "../ui/Skeleton/TableSkel";
import { ViewToggle } from "../admin/common/ViewToggle";
import SearchSkeleton from "../ui/Skeleton/SearchSkeleton";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import ReorderConfirmation from "../../orders/components/ReorderConfirmation";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

// Lazy load
const OrderDashboard = dynamic(() => import("./OrderDashboard"), {
  loading: () => null,
});
const OrderSearchAndFilters = dynamic(() => import("./OrderSearchAndFilters"), {
  ssr: false,
  loading: () => <SearchSkeleton />,
});
const OrderTable = dynamic(() => import("./OrderTable"), {
  ssr: false,
  loading: () => <TableSkel />,
});
const OrderGrid = dynamic(() => import("./OrderGrid"), {
  ssr: false,
  loading: () => <TableSkel />,
});

interface OrderListProps {
  orders: GetOrdersType[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [clientFilter, setClientFilter] = useState<number[]>([]);
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
        clientFilter.length === 0 || clientFilter.includes(order.ClientId);

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
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset current page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clientFilter, dateRange]);

  // Clamp current page when page size or filtered length changes
  React.useEffect(() => {
    const newTotalPages = Math.max(
      1,
      Math.ceil(filteredOrders.length / Math.max(1, itemsPerPage))
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [itemsPerPage, filteredOrders.length]);

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

          <PermissionGuard required={PERMISSIONS_ENUM.ORDER.ADD}>
            <Link
              href={"/orders/addorder"}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Order
            </Link>
          </PermissionGuard>
        </div>
      </div>

      {/* Dashboard Stats */}
      <OrderDashboard
        orders={orders}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <OrderSearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        clientFilter={clientFilter}
        onClientChange={setClientFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        orders={orders}
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={itemsPerPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
        />


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
