import React, { useState } from "react";

import Spinner from "./Spinner";
import OrderItemsTable from "./OrderItemsTable";
import { useClientOrders } from "../services/useClientOrders";
import { formatDate } from "../interfaces";

const OrderTable = ({ clientId }: { clientId: string }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleOrderItemsTable = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const { isLoading, error, result } = useClientOrders(clientId);


  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#364254]">
              <tr>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Order ID
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Event
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Deadline
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Discription
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {result?.map((order) => (
                <>
                  <tr
                    key={order.Id}
                    className="border-t even:bg-[#BFE8E1] hover:bg-[#7bdbcb]"
                  >
                    <td className="px-4 py-2 border text-center">
                      {order.Id}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {order.EventName}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {order.StatusName}
                    </td>
                    <td className="px-4 py-2 border text-center">
                        {formatDate(order.Deadline)}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {order.Description}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => toggleOrderItemsTable(order.Id)}
                        >
                          <img src="/arrowDown.svg" className="w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrderId === order.Id && (
                    <OrderItemsTable orderId={order.Id} />
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderTable;
