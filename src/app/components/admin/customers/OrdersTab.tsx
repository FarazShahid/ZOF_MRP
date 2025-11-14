"use client";

import React, { useState } from "react";
import { ShoppingCart, Calendar, Hash, Tag, Flag, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";
import { formatDate, formatDateTime, getStatusColor } from "./clientHelpers";
import Link from "next/link";

const OrdersTab: React.FC<{
  orders: GetOrdersType[];
  loading: boolean;
}> = ({ orders, loading }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

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
      {orders.map((order) => {
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
  );
};

export default OrdersTab;


