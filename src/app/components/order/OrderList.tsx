"use client";

import React, { useState, useMemo } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import OrderDashboard from "./OrderDashboard";
import OrderSearchAndFilters from "./OrderSearchAndFilters";
import OrderTable from "./OrderTable";
import OrderGrid from "./OrderGrid";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import { OrderStatus } from "@/src/types/admin";
import { GetClientsType } from "@/store/useClientStore";
import Pagination from "../shipment/Pagination";
import { ViewToggle } from "../admin/common/ViewToggle";

interface OrderListProps {
  orders: GetOrdersType[];
  clients: GetClientsType[];
}

const OrderList: React.FC<OrderListProps> = ({ orders, clients }) => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    console.log("View order:", orderId);
  };

  const handleEditOrder = (orderId: number) => {
    console.log("Edit order:", orderId);
  };

  const handleDeleteOrder = (orderId: number) => {
    console.log("Delete order:", orderId);
  };

  const handleReorderOrder = (orderId: number) => {
    console.log("Re-order:", orderId);
  };

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
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
           Add New Order
          </button>
        </div>
      </div>
      
      {/* Dashboard Stats */}
      <OrderDashboard orders={orders} />

      {/* Header */}
      {/* <div className="p-6 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">Table</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm font-medium">Grid</span>
              </button>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Order</span>
          </button>
        </div>

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
      </div> */}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
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
      <div className="p-6 bg-white border-t border-slate-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredOrders.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default OrderList;
