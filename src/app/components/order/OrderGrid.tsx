import React from "react";
import { User, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import { formatDate } from "@/src/types/admin";
import { getDeadlineColor, getDeadlineStatus } from "@/src/types/order";
import { OrderItemShipmentEnum } from "@/interface";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { getOrderTypeLabelColor } from "@/interface/GetFileType";

interface OrderGridProps {
  orders: GetOrdersType[];
  onViewOrder: (orderId: number) => void;
  onEditOrder: (orderId: number) => void;
  onDeleteOrder: (orderId: number) => void;
  onReorderOrder: (orderId: number) => void;
}

const getStatusColor = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s.includes("production")) return "bg-orange-950/50 text-orange-300 border-orange-500/25";
  if (s.includes("shipped")) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  if (s.includes("packing")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (s.includes("kept") || s.includes("completed")) return "bg-green-500/20 text-green-400 border-green-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

const OrderGrid: React.FC<OrderGridProps> = ({
  orders,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onReorderOrder,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {(!orders || orders.length === 0) ? (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center">
          <i className="ri-shopping-bag-line text-5xl text-slate-500 mx-auto mb-3 block" />
          <p className="text-white font-medium">No orders found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting filters or create a new order.</p>
        </div>
      ) : (
        orders?.map((order) => (
          <div
            key={order.Id}
            className="group bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800/60 overflow-hidden hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-slate-800/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base mb-0.5 truncate">{order?.OrderName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{order?.OrderNumber} &middot; {order?.ClientName}</p>
                </div>
                <span
                  className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 ${getStatusColor(
                    order?.StatusName || ""
                  )}`}
                >
                  {order?.StatusName || "—"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pt-4 pb-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-200 font-medium truncate">{order?.ClientName}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-sm text-slate-400 truncate">{order?.EventName || "—"}</span>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <div
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs border border-slate-700/50 ${
                    order.StatusName === OrderItemShipmentEnum.SHIPPED
                      ? "text-slate-400 bg-slate-800/30"
                      : getDeadlineColor(order.Deadline)
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  <span>{formatDate(order.Deadline)}</span>
                  {getDeadlineStatus(order.Deadline) === "overdue" && (
                    <AlertTriangle className="w-3.5 h-3.5 ml-1" />
                  )}
                </div>

                {order?.OrderType && (
                  <span
                    className={`${getOrderTypeLabelColor(order?.OrderType)} rounded-lg px-2.5 py-1 text-xs`}
                  >
                    {order?.OrderType}
                  </span>
                )}
              </div>

              {order.Description && (
                <p className="text-xs text-slate-500 line-clamp-1">{order.Description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-slate-800/40">
              <div className="flex items-center justify-end gap-2">
                <PermissionGuard required={PERMISSIONS_ENUM.ORDER.REORDER}>
                  <button
                    onClick={() => onReorderOrder(order.Id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-600 hover:text-white border border-amber-500/20 hover:border-amber-600 rounded-lg transition-colors cursor-pointer"
                    title="Re-order"
                  >
                    <i className="ri-repeat-line w-3.5 h-3.5 flex items-center justify-center" />
                    Reorder
                  </button>
                </PermissionGuard>
                <button
                  onClick={() => onViewOrder(order.Id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-600 hover:text-white border border-blue-500/20 hover:border-blue-600 rounded-lg transition-colors cursor-pointer"
                  title="View"
                >
                  <i className="ri-eye-line w-3.5 h-3.5 flex items-center justify-center" />
                  View
                </button>
                <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>
                  <button
                    onClick={() => onEditOrder(order.Id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      order.StatusName === OrderItemShipmentEnum.SHIPPED
                        ? "text-slate-500 bg-slate-800/30 border-slate-700/30 cursor-not-allowed opacity-50"
                        : "text-slate-300 bg-slate-700/30 hover:bg-slate-600 hover:text-white border-slate-600/30 hover:border-slate-600 cursor-pointer"
                    }`}
                    title="Edit"
                    disabled={order.StatusName === OrderItemShipmentEnum.SHIPPED}
                  >
                    <i className="ri-edit-line w-3.5 h-3.5 flex items-center justify-center" />
                    Edit
                  </button>
                </PermissionGuard>
                <PermissionGuard required={PERMISSIONS_ENUM.ORDER.DELETE}>
                  <button
                    onClick={() => onDeleteOrder(order.Id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      order.StatusName === OrderItemShipmentEnum.SHIPPED
                        ? "text-slate-500 bg-slate-800/30 border-slate-700/30 cursor-not-allowed opacity-50"
                        : "text-red-400 bg-red-500/10 hover:bg-red-600 hover:text-white border-red-500/20 hover:border-red-600 cursor-pointer"
                    }`}
                    title="Delete"
                    disabled={order.StatusName === OrderItemShipmentEnum.SHIPPED}
                  >
                    <i className="ri-delete-bin-line w-3.5 h-3.5 flex items-center justify-center" />
                    Delete
                  </button>
                </PermissionGuard>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderGrid;
