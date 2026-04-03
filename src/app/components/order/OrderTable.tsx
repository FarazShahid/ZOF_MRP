import React from "react";
import Link from "next/link";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import { formatDate } from "@/src/types/admin";
import { OrderItemShipmentEnum } from "@/interface";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

interface OrderTableProps {
  orders: GetOrdersType[];
  onViewOrder: (orderId: number) => void;
  onEditOrder: (orderId: number) => void;
  onDeleteOrder: (orderId: number) => void;
  onReorderOrder: (orderId: number) => void;
}

const getStatusColor = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s.includes("production")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (s.includes("shipped")) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  if (s.includes("packing")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (s.includes("kept") || s.includes("completed")) return "bg-green-500/20 text-green-400 border-green-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

const getStageIcon = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s.includes("production")) return "ri-tools-line text-amber-400";
  if (s.includes("shipped")) return "ri-truck-line text-purple-400";
  if (s.includes("packing")) return "ri-palette-line text-blue-400";
  if (s.includes("kept") || s.includes("completed")) return "ri-checkbox-circle-line text-green-400";
  return "ri-question-line text-slate-400";
};

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onReorderOrder,
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-700/60 bg-slate-800/40">
          <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            Order Name
          </th>
          <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            Event
          </th>
          <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            Type
          </th>
          <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            Items
          </th>
          <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            Current Stage
          </th>
          <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            Status
          </th>
          <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            Delivery Date
          </th>
          <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {(!orders || orders.length === 0) ? (
          <tr>
            <td
              colSpan={8}
              className="px-6 py-12 text-center text-slate-500"
            >
              <i className="ri-shopping-bag-line text-4xl mb-2 block w-10 h-10 mx-auto flex items-center justify-center" />
              No orders found
            </td>
          </tr>
        ) : (
          orders?.map((order) => (
            <tr
              key={order?.Id}
              className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors"
            >
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-white">
                    {order?.OrderName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {order?.OrderNumber} &middot; {order?.ClientName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`/events/${order?.OrderEventId}`}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {order?.EventName || "—"}
                </Link>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                    order?.OrderType === "Sample"
                      ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                      : order?.OrderType === "Reorder"
                      ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                      : "bg-slate-600/30 text-slate-300 border-slate-500/30"
                  }`}
                >
                  {order?.OrderType || "—"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-200">
                  {(order as any)?.ItemsCount?.toLocaleString?.() ?? "—"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i
                    className={`${getStageIcon(order?.StatusName || "")} text-sm w-4 h-4 flex items-center justify-center`}
                  />
                  <span className="text-sm text-slate-300">
                    {order?.StatusName || "—"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                    order?.StatusName || ""
                  )}`}
                >
                  <i
                    className={`${getStageIcon(order?.StatusName || "")} text-sm w-4 h-4 flex items-center justify-center shrink-0`}
                  />
                  {(order?.StatusName || "—").charAt(0).toUpperCase() +
                    (order?.StatusName || "").slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-slate-300">
                  {order?.Deadline ? formatDate(order.Deadline) : "—"}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewOrder(order.Id)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                    title="View"
                  >
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center" />
                  </button>
                  <PermissionGuard required={PERMISSIONS_ENUM.ORDER.REORDER}>
                    <button
                      onClick={() => onReorderOrder(order.Id)}
                      className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Repeat Order"
                    >
                      <i className="ri-repeat-line w-4 h-4 flex items-center justify-center" />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>
                    <button
                      onClick={() => onEditOrder(order.Id)}
                      className={`p-2 text-slate-400 hover:bg-slate-700 rounded-lg transition-colors ${
                        order.StatusName === OrderItemShipmentEnum.SHIPPED
                          ? "cursor-not-allowed opacity-50"
                          : "hover:text-white"
                      }`}
                      title="Edit"
                      disabled={order.StatusName === OrderItemShipmentEnum.SHIPPED}
                    >
                      <i className="ri-edit-line w-4 h-4 flex items-center justify-center" />
                    </button>
                  </PermissionGuard>
                  <PermissionGuard required={PERMISSIONS_ENUM.ORDER.DELETE}>
                    <button
                      onClick={() => onDeleteOrder(order.Id)}
                      className={`p-2 text-slate-400 hover:bg-red-500/10 rounded-lg transition-colors ${
                        order.StatusName === OrderItemShipmentEnum.SHIPPED
                          ? "cursor-not-allowed opacity-50"
                          : "hover:text-red-400"
                      }`}
                      title="Delete"
                      disabled={order.StatusName === OrderItemShipmentEnum.SHIPPED}
                    >
                      <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
                    </button>
                  </PermissionGuard>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default OrderTable;
