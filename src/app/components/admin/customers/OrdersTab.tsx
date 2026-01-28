"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Calendar,
  Hash,
  Tag,
  Flag,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Search,
  X,
  PencilLine,
  Eye,
  Trash2,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";
import { formatDate, formatDateTime, getStatusColor } from "./clientHelpers";
import Link from "next/link";
import { getOrderTypeLabelColor } from "@/interface/GetFileType";
import { getDeadlineColor, getDeadlineStatus } from "@/src/types/order";
import { OrderItemShipmentEnum } from "@/interface";
import PermissionGuard from "../../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import DeleteModal from "../../DeleteModal";
import ReorderConfirmation from "../../../orders/components/ReorderConfirmation";

const OrdersTab: React.FC<{
  orders: GetOrdersType[];
  loading: boolean;
}> = ({ orders, loading }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [openReorderModal, setOpenReorderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Extract unique values for filters
  const statuses = useMemo(() => {
    const unique = Array.from(
      new Set(orders.map((o) => o.StatusName))
    ).sort();
    return unique;
  }, [orders]);

  // Filter orders and sort by created date (newest first)
  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = orders.filter((order) => {
      // Search filter
      const matchesSearch =
        term === "" ||
        order.OrderName.toLowerCase().includes(term) ||
        order.OrderNumber.toLowerCase().includes(term) ||
        (order.Description || "").toLowerCase().includes(term) ||
        (order.ExternalOrderId || "").toLowerCase().includes(term) ||
        (order.EventName || "").toLowerCase().includes(term);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || order.StatusName === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.CreatedOn).getTime();
      const dateB = new Date(b.CreatedOn).getTime();
      return dateB - dateA; // newest first
    });
  }, [orders, searchTerm, statusFilter]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.Id === selectedOrderId),
    [orders, selectedOrderId]
  );

  // Pagination over filtered results
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handleReorderOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenReorderModal(true);
  };

  const handleDeleteOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOpenDeleteModal(true);
  };

  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeReorderModal = () => setOpenReorderModal(false);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all";

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No orders found for this client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900/60">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders by name, number, description, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredOrders.length} of {orders.length} orders
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                (filtered)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Rows per page
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-slate-900"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No orders match your filters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
        <div className="space-y-4">
          {paginatedOrders.map((order) => {
            const isExpanded = expandedOrderId === order.Id;
            const isShipped = order.StatusName === OrderItemShipmentEnum.SHIPPED;

            return (
              <div
                key={order.Id}
                className="group relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-slate-900/80 p-5 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {order.OrderName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.StatusName
                        )}`}
                      >
                        {order.StatusName}
                      </span>
                      {order.OrderType && (
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${getOrderTypeLabelColor(
                            order.OrderType
                          )}`}
                        >
                          {order.OrderType}
                        </span>
                      )}
                    </div>
                    {order.Description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {order.Description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? "Collapse details" : "Expand details"}
                      onClick={() =>
                        setExpandedOrderId(isExpanded ? null : order.Id)
                      }
                      className="p-2 rounded-full border border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Summary row */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 dark:text-gray-400">
                      Order #
                    </span>
                    <span className="ml-1 font-mono text-gray-900 dark:text-white">
                      {order.OrderNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 dark:text-gray-400">
                      Event
                    </span>
                    <span className="ml-1 text-gray-900 dark:text-white truncate">
                      {order.EventName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 dark:text-gray-400">
                      Deadline
                    </span>
                    <div
                      className={`ml-1 inline-flex items-center px-2.5 py-1 rounded-full border text-xs ${getDeadlineColor(
                        order.Deadline
                      )}`}
                    >
                      <span>Due {formatDate(order.Deadline)}</span>
                      {getDeadlineStatus(order.Deadline) === "overdue" && (
                        <AlertTriangle className="w-3.5 h-3.5 ml-1" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Flag className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 dark:text-gray-400">
                      Priority
                    </span>
                    <span className="ml-1 text-gray-900 dark:text-white">
                      Level {order.OrderPriority}
                    </span>
                  </div>
                </div>

                {/* Action row */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Last updated {formatDateTime(order.UpdatedOn)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <PermissionGuard required={PERMISSIONS_ENUM.ORDER.REORDER}>
                      <button
                        type="button"
                        onClick={() => handleReorderOrder(order.Id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                        title="Re-order"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </PermissionGuard>

                    <button
                      type="button"
                      onClick={() => (window.location.href = `/orders/vieworder/${order.Id}`)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isShipped) {
                            window.location.href = `/orders/editorder/${order.Id}`;
                          }
                        }}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors ${
                          isShipped
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                        }`}
                        title="Edit"
                        disabled={isShipped}
                      >
                        <PencilLine className="w-4 h-4" />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard required={PERMISSIONS_ENUM.ORDER.DELETE}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isShipped) {
                            handleDeleteOrder(order.Id);
                          }
                        }}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors ${
                          isShipped
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                        }`}
                        title="Delete"
                        disabled={isShipped}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </PermissionGuard>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Created
                        </span>
                        <div className="text-gray-900 dark:text-white">
                          {formatDateTime(order.CreatedOn)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Last Updated
                        </span>
                        <div className="text-gray-900 dark:text-white">
                          {formatDateTime(order.UpdatedOn)}
                        </div>
                      </div>
                      {order.ExternalOrderId && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            External ID
                          </span>
                          <div className="font-mono text-gray-900 dark:text-white">
                            {order.ExternalOrderId}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 text-xs text-gray-600 dark:text-gray-400">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
        </>
      )}
      {/* Modals */}
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

export default OrdersTab;


