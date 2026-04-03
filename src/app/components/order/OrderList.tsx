"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import DeleteModal from "../DeleteModal";
import { useRouter } from "next/navigation";
import Pagination from "../common/Pagination";
import { OrderStatus } from "@/src/types/admin";
import React, { useState, useMemo } from "react";
import { TableSkel } from "../ui/Skeleton/TableSkel";
import PermissionGuard from "../auth/PermissionGaurd";
import { ViewToggle } from "../admin/common/ViewToggle";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import SearchSkeleton from "../ui/Skeleton/SearchSkeleton";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import ReorderConfirmation from "../../orders/components/ReorderConfirmation";

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
  projectFilter?: number | "all";
  onProjectFilterChange?: (projectId: number | "all") => void;
  projects?: Array<{ Id: number; Name: string; ClientId: number }>;
}

const OrderList: React.FC<OrderListProps> = ({ orders, projectFilter: externalProjectFilter, onProjectFilterChange, projects = [] }) => {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [clientFilter, setClientFilter] = useState<number[]>([]);
  const [projectFilter, setProjectFilter] = useState<number | "all">(externalProjectFilter || "all");
  
  const handleProjectChange = (projectId: number | "all") => {
    setProjectFilter(projectId);
    if (onProjectFilterChange) {
      onProjectFilterChange(projectId);
    }
  };
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
  }, [searchTerm, statusFilter, clientFilter, projectFilter, dateRange]);

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

  const hasActiveFilters = Boolean(
    searchTerm ||
    statusFilter !== "all" ||
    clientFilter.length > 0 ||
    projectFilter !== "all" ||
    dateRange.start ||
    dateRange.end
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setClientFilter([]);
    handleProjectChange("all");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      {/* Header - same as reference */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
          <p className="text-slate-400 text-sm">Track and manage all production orders</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <PermissionGuard required={PERMISSIONS_ENUM.ORDER.ADD}>
            <Link
              href="/orders/addorder"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
              Create Order
            </Link>
          </PermissionGuard>
        </div>
      </div>

      {/* KPI Tiles */}
      <OrderDashboard
        orders={orders}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Filters - same structure as reference */}
      <OrderSearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        clientFilter={clientFilter}
        onClientChange={setClientFilter}
        projectFilter={projectFilter}
        onProjectChange={handleProjectChange}
        projects={projects}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        orders={orders}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Table - wrapped in reference card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          {viewMode === "table" ? (
            <OrderTable
              orders={paginatedOrders}
              onViewOrder={handleViewOrder}
              onEditOrder={handleEditOrder}
              onDeleteOrder={handleDeleteOrder}
              onReorderOrder={handleReorderOrder}
            />
          ) : (
            <div className="p-6">
              <OrderGrid
                orders={paginatedOrders}
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder}
                onDeleteOrder={handleDeleteOrder}
                onReorderOrder={handleReorderOrder}
              />
            </div>
          )}
        </div>

        {/* Pagination - inside table card, same as reference */}
        {totalPages > 1 && filteredOrders.length > 0 && (
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
            totalItems={filteredOrders.length}
            startIndex={startIndex}
            itemLabel="orders"
          />
        )}
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
