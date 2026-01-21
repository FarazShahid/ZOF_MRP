"use client";

import React, { useState, useMemo } from "react";
import { ShoppingCart, Calendar, Hash, Tag, Flag, ChevronDown, ChevronRight, ArrowRight, Search, X } from "lucide-react";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";
import { formatDate, formatDateTime, getStatusColor } from "./clientHelpers";
import Link from "next/link";

const OrdersTab: React.FC<{
  orders: GetOrdersType[];
  loading: boolean;
}> = ({ orders, loading }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Extract unique values for filters
  const statuses = useMemo(() => {
    const unique = Array.from(
      new Set(orders.map((o) => o.StatusName))
    ).sort();
    return unique;
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
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
  }, [orders, searchTerm, statusFilter]);

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
      <div className=" rounded-lg p-4 border border-gray-200 dark:border-gray-700">
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
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
          {hasActiveFilters && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              (filtered)
            </span>
          )}
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
        <div className="space-y-4">
          {filteredOrders.map((order) => {
        const isExpanded = expandedOrderId === order.Id;
        return (
          <div
            key={order.Id}
            className="group bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{order.OrderName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.StatusName)}`}>
                    {order.StatusName}
                  </span>
                </div>
                {order.Description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {order.Description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/orders/vieworder/${order.Id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.Id)}
                  className="p-2 rounded-md border border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Summary row */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">Order #</span>
                <span className="ml-1 font-mono text-gray-900 dark:text-white">{order.OrderNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">Event</span>
                <span className="ml-1 text-gray-900 dark:text-white truncate">{order.EventName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">Deadline</span>
                <span className="ml-1 text-gray-900 dark:text-white">{formatDate(order.Deadline)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Flag className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400">Priority</span>
                <span className="ml-1 text-gray-900 dark:text-white">Level {order.OrderPriority}</span>
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Created</span>
                    <div className="text-gray-900 dark:text-white">{formatDateTime(order.CreatedOn)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                    <div className="text-gray-900 dark:text-white">{formatDateTime(order.UpdatedOn)}</div>
                  </div>
                  {order.ExternalOrderId && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">External ID</span>
                      <div className="font-mono text-gray-900 dark:text-white">{order.ExternalOrderId}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;


