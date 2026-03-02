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
  if (s.includes("production")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{order?.OrderName}</h3>
                  <p className="text-sm text-slate-500">{order?.OrderNumber}</p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                    order?.StatusName || ""
                  )}`}
                >
                  {order?.StatusName || "—"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-300 font-medium">{order?.ClientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-400">{order?.EventName || "—"}</span>
                </div>
              </div>

              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${
                  order.StatusName === OrderItemShipmentEnum.SHIPPED
                    ? "text-slate-400 border-slate-600"
                    : getDeadlineColor(order.Deadline)
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span>Due: {formatDate(order.Deadline)}</span>
                {getDeadlineStatus(order.Deadline) === "overdue" && (
                  <AlertTriangle className="w-4 h-4 ml-1" />
                )}
              </div>

              {order?.OrderType && (
                <div className="flex items-center gap-2">
                  <span
                    className={`${getOrderTypeLabelColor(order?.OrderType)} rounded px-2 py-0.5 text-xs`}
                  >
                    {order?.OrderType}
                  </span>
                </div>
              )}
              {order.Description && (
                <p className="text-sm text-slate-400 line-clamp-1">{order.Description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-slate-700">
              <div className="flex items-center justify-end gap-1">
                <PermissionGuard required={PERMISSIONS_ENUM.ORDER.REORDER}>
                  <button
                    onClick={() => onReorderOrder(order.Id)}
                    className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Re-order"
                  >
                    <i className="ri-repeat-line w-4 h-4 flex items-center justify-center" />
                  </button>
                </PermissionGuard>
                <button
                  onClick={() => onViewOrder(order.Id)}
                  className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="View"
                >
                  <i className="ri-eye-line w-4 h-4 flex items-center justify-center" />
                </button>
                <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>
                  <button
                    onClick={() => onEditOrder(order.Id)}
                    className={`p-2 text-slate-400 rounded-lg transition-colors ${
                      order.StatusName === OrderItemShipmentEnum.SHIPPED
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-slate-700 hover:text-white"
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
                    className={`p-2 text-slate-400 rounded-lg transition-colors ${
                      order.StatusName === OrderItemShipmentEnum.SHIPPED
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-red-500/10 hover:text-red-400"
                    }`}
                    title="Delete"
                    disabled={order.StatusName === OrderItemShipmentEnum.SHIPPED}
                  >
                    <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center" />
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
