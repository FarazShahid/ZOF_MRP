import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Calendar,
  AlertTriangle,
  User,
  MapPin,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import { formatDate } from "@/src/types/admin";
import { getDeadlineColor, getDeadlineStatus } from "@/src/types/order";
import { OrderItemShipmentEnum } from "@/interface";

interface OrderGridProps {
  orders: GetOrdersType[];
  onViewOrder: (orderId: number) => void;
  onEditOrder: (orderId: number) => void;
  onDeleteOrder: (orderId: number) => void;
  onReorderOrder: (orderId: number) => void;
}

const OrderGrid: React.FC<OrderGridProps> = ({
  orders,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onReorderOrder,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders?.map((order) => (
        <div
          key={order.Id}
          className="rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {order?.OrderName}
                </h3>
                <p className="text-sm text-gray-600">{order?.OrderNumber}</p>
              </div>
              <OrderStatusBadge status={order?.StatusName} />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Client & Event */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900 font-medium">
                  {order?.ClientName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {order?.EventName}
                </span>
              </div>
            </div>

            {/* Deadline */}
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getDeadlineColor(
                order.Deadline
              )}`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>Due: {formatDate(order.Deadline)}</span>
              {getDeadlineStatus(order.Deadline) === "overdue" && (
                <AlertTriangle className="w-4 h-4 ml-1" />
              )}
            </div>

            {/* Description */}
            {order.Description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {order.Description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-3 rounded-b-lg border-t border-slate-200">
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => onReorderOrder(order.Id)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Re-order"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-order</span>
              </button>
              <button
                onClick={() => onViewOrder(order.Id)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => onEditOrder(order.Id)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-sm text-slate-600  rounded-md transition-colors ${
                  order.StatusName === OrderItemShipmentEnum.SHIPPED
                    ? "cursor-not-allowed"
                    : "hover:bg-slate-100"
                }`}
                title="Edit"
                disabled={
                  order.StatusName === OrderItemShipmentEnum.SHIPPED
                    ? true
                    : false
                }
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDeleteOrder(order.Id)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600  rounded-md transition-colors ${
                  order.StatusName === OrderItemShipmentEnum.SHIPPED
                    ? "cursor-not-allowed"
                    : "hover:bg-red-50"
                }`}
                title="Delete"
                disabled={
                  order.StatusName === OrderItemShipmentEnum.SHIPPED
                    ? true
                    : false
                }
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderGrid;
