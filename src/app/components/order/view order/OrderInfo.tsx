import React from "react";
import { Card } from "@heroui/react";
import { FaFileLines } from "react-icons/fa6";
import { PiFileDuotone } from "react-icons/pi";
import ClientInfoCard from "./ClientInfoCard";
import { GetOrderByIdType } from "@/src/app/interfaces/OrderStoreInterface";
import { formatDate } from "@/src/app/interfaces";
import useOrderStore from "@/store/useOrderStore";
import OrderStatusTimeline from "@/src/app/orders/components/OrderStatusTimeline";

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
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          </div>
          <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-sm font-medium text-gray-900">
                Order Number
              </span>
              {OrderById?.OrderNumber}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-sm font-medium text-gray-900">
                Order Status
              </span>
              {OrderById?.StatusName}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-sm font-medium text-gray-900">
                Shipment Status
              </span>
              {OrderById?.OrderShipmentStatus}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-sm font-medium text-gray-900">
                Event
              </span>
              {OrderById?.EventName}
            </div>
            {/* <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Created</span>
              <span className="font-semibold text-gray-900">12/05/2025</span>
            </div> */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-sm font-medium text-gray-900">
                Due Date
              </span>
              <span className="font-semibold text-gray-900">{formatDate(OrderById?.Deadline)}</span>
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
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-l-4 border-orange-500">
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
