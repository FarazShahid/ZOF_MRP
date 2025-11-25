import React from "react";
import { Card, Button } from "@heroui/react";
import { FaFileLines } from "react-icons/fa6";
import { PiFileDuotone } from "react-icons/pi";
import { FiExternalLink } from "react-icons/fi";
import ClientInfoCard from "./ClientInfoCard";
import { GetOrderByIdType } from "@/src/app/interfaces/OrderStoreInterface";
import { formatDate } from "@/src/app/interfaces";
import useOrderStore from "@/store/useOrderStore";
import OrderStatusTimeline from "@/src/app/orders/components/OrderStatusTimeline";
import OrderStatusBadge from "../OrderStatusBadge";
import { getOrderTypeLabelColor, ORDER_TYPE } from "@/interface/GetFileType";
import Link from "next/link";

interface OrderInfoProp {
  OrderById: GetOrderByIdType
}

const OrderInfo: React.FC<OrderInfoProp> = ({
  OrderById
}) => {

  const { OrderStatusLogs } = useOrderStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FaFileLines />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Order Details <OrderStatusBadge status={OrderById.StatusName} /></h2>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
                Order Number
              </span>
              <p className="font-semibold text-gray-900 mt-1">{OrderById?.OrderNumber}</p>
            </div>
            {
              OrderById?.OrderType && (
                <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
                  <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
                    Order Type
                  </span>
                  <p className={`font-semibold text-gray-900 mt-1 w-fit ${getOrderTypeLabelColor(OrderById?.OrderType)}`}>{ OrderById?.OrderType}</p>
                  {OrderById.OrderType === ORDER_TYPE.RE_ORDER && !!OrderById.ParentOrderId ? (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-900">Parent Order</span>
                        <span className="text-[11px] text-gray-600">#{OrderById.ParentOrderId}</span>
                      </div>
                      <Button
                        as={Link}
                        href={`/orders/vieworder/${OrderById.ParentOrderId}`}
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="h-7 px-2 text-xs"
                        startContent={<FiExternalLink className="w-3.5 h-3.5" />}
                      >
                        Open
                      </Button>
                    </div>
                  ) : null}
                </div>
              )
            }
            <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
              Shipment Status
              </span>
              <p className="font-semibold text-gray-900 mt-1">{OrderById?.OrderShipmentStatus}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
              Event
              </span>
              <p className="font-semibold text-gray-900 mt-1"> {OrderById?.EventName}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
              Due Date
              </span>
              <p className="font-semibold text-gray-900 mt-1"> {formatDate(OrderById?.Deadline)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Client Information */}
      <ClientInfoCard clientId={OrderById.ClientId} />

      {/* Order Notes */}
      <Card className=" border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <PiFileDuotone />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Order Description
            </h2>
          </div>
          <div className="OrderStatusTimeLineWrapper p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-l-4 border-orange-500">
            <p className="text-sm text-gray-900 leading-relaxed">{OrderById?.Description}</p>
          </div>
        </div>
      </Card>


      {/* Order Status Logs */}

      <Card className=" border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 text-gray-900 rounded-lg flex items-center justify-center">
              <PiFileDuotone />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Status Logs
            </h2>
          </div>
          <OrderStatusTimeline OrderStatusLogs={OrderStatusLogs} />
        </div>
      </Card>
    </div>
  );
};

export default OrderInfo;
