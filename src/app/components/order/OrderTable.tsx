import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import { formatDate } from "@/src/types/admin";
import { getDeadlineColor, getDeadlineStatus } from "@/src/types/order";

interface OrderTableProps {
  orders: GetOrdersType[];
  onViewOrder: (orderId: number) => void;
  onEditOrder: (orderId: number) => void;
  onDeleteOrder: (orderId: number) => void;
  onReorderOrder: (orderId: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onReorderOrder,
}) => {
  return (
    <div className=" rounded-lg border border-slate-200 dark:border-gray-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
            <tbody className=" divide-y divide-slate-200">
            {orders?.map((order) => (
              <tr
                key={order?.Id}
                className={"hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {order?.OrderName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order?.OrderNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order?.ClientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order?.EventName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.StatusName} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm flex items-center ${getDeadlineColor(
                      order.Deadline
                    )}`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(order.Deadline)}
                    {getDeadlineStatus(order.Deadline) === "overdue" && (
                      <AlertTriangle className="w-4 h-4 ml-1 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onReorderOrder(order.Id)}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Re-order"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewOrder(order.Id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditOrder(order.Id)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteOrder(order.Id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
