import React from "react";
import { FiExternalLink } from "react-icons/fi";
import ClientInfoCard from "./ClientInfoCard";
import { GetOrderByIdType } from "@/src/app/interfaces/OrderStoreInterface";
import { formatDate } from "@/src/app/interfaces";
import useOrderStore from "@/store/useOrderStore";
import OrderStatusTimeline from "@/src/app/orders/components/OrderStatusTimeline";
import { getOrderTypeLabelColor, ORDER_TYPE } from "@/interface/GetFileType";
import Link from "next/link";

interface OrderInfoProp {
  OrderById: GetOrderByIdType;
}

const OrderInfo: React.FC<OrderInfoProp> = ({ OrderById }) => {
  const { OrderStatusLogs } = useOrderStore();

  return (
    <div className="space-y-6">
      {/* Order Timeline - status logs with reference UI */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ri-route-line text-white w-4 h-4 flex items-center justify-center" />
          </div>
          <h2 className="text-lg font-bold text-white">Order Timeline</h2>
        </div>
        <OrderStatusTimeline OrderStatusLogs={OrderStatusLogs} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details - reference style */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
              <i className="ri-file-info-line text-white w-4 h-4 flex items-center justify-center" />
            </div>
            <h2 className="text-lg font-bold text-white">Order Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Order Number</div>
              <div className="text-sm text-white font-medium">
                {OrderById?.OrderNumber ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Order Type</div>
              <div className="text-sm">
                {OrderById?.OrderType ? (
                  <span
                    className={`font-medium ${getOrderTypeLabelColor(OrderById.OrderType)}`}
                  >
                    {OrderById.OrderType}
                  </span>
                ) : (
                  <span className="text-white">—</span>
                )}
              </div>
              {OrderById?.OrderType === ORDER_TYPE.RE_ORDER &&
                !!OrderById.ParentOrderId && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-500">Parent Order</span>
                    <Link
                      href={`/orders/vieworder/${OrderById.ParentOrderId}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      #{OrderById.ParentOrderId}
                      <FiExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Shipment Status</div>
              <div className="text-sm text-white font-medium">
                {OrderById?.OrderShipmentStatus ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Event</div>
              <div className="text-sm text-blue-400 font-medium">
                {OrderById?.EventName ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Target Delivery</div>
              <div className="text-sm text-white font-medium">
                {OrderById?.Deadline ? formatDate(OrderById.Deadline) : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <ClientInfoCard clientId={OrderById.ClientId} />
      </div>

      {/* Order Description - reference style */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <i className="ri-file-text-line text-white w-4 h-4 flex items-center justify-center" />
          </div>
          <h2 className="text-lg font-bold text-white">Order Description</h2>
        </div>
        <div className="text-sm text-slate-300">
          {OrderById?.Description || "—"}
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
