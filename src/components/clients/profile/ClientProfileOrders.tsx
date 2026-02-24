"use client";

import React from "react";
import Link from "next/link";
import { GetOrdersType } from "@/src/app/interfaces/OrderStoreInterface";

interface ClientProfileOrdersProps {
  orders: GetOrdersType[];
  loading?: boolean;
}

export default function ClientProfileOrders({
  orders,
  loading,
}: ClientProfileOrdersProps) {
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("shipped") || s.includes("completed"))
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s.includes("process")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (s.includes("pending")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Orders</h2>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            No orders yet
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.Id}
                  className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/orders/vieworder/${order.Id}`}
                      className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                    >
                      {order.OrderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {order.EventName || "-"}
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
