"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";
import EventDetailTablePagination from "./EventDetailTablePagination";

interface EventDetailOrdersTabProps {
  orders: GetOrdersType[];
  loading?: boolean;
}

const ITEMS_PER_PAGE = 10;

function getStatusColor(status: string) {
  const s = status?.toLowerCase() || "";
  if (s.includes("shipped") || s.includes("completed"))
    return "bg-green-500/20 text-green-400 border-green-500/30";
  if (s.includes("process")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (s.includes("pending")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export default function EventDetailOrdersTab({
  orders,
  loading,
}: EventDetailOrdersTabProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      {loading ? (
        <div className="px-6 py-12 text-center text-slate-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-400">
          No orders linked to this event
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order.Id}
                  className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/orders/vieworder/${order.Id}`}
                      className="text-sm font-medium text-blue-400 hover:underline"
                    >
                      {order.OrderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">-</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                        order.StatusName
                      )}`}
                    >
                      {order.StatusName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {order.Deadline
                      ? new Date(order.Deadline).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/orders/vieworder/${order.Id}`}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer inline-block"
                      title="View Order"
                    >
                      <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && orders.length > 0 && (
        <EventDetailTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={orders.length}
          startIndex={startIndex}
          itemLabel="orders"
        />
      )}
    </div>
  );
}
