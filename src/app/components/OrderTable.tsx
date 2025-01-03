import React, { useState } from "react";

import Spinner from "./Spinner";
import OrderItemsTable from "./OrderItemsTable";
import { useClientOrders } from "../services/useClientOrders";
import { formatDate } from "../interfaces";
import HeaderWidgets from "./HeaderWidgets";
import StatusChip from "./StatusChip";
import DeleteModal from "./DeleteModal";

const OrderTable = ({ clientId }: { clientId: string }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const { isLoading, result } = useClientOrders(clientId, refreshKey);

  const openDeleteModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const toggleOrderItemsTable = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <HeaderWidgets orders={result} />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-separate [border-spacing:0_0.5em]">
            <thead className="bg-[#656565] text-white">
              <tr>
                <th className="px-4 py-2 text-center text-medium font-semibold rounded-tl-lg rounded-bl-lg">
                  Order ID
                </th>
                <th className="px-4 py-2 text-center text-medium font-semibold">
                  Event
                </th>
                <th className="px-4 py-2 text-center text-medium font-semibold">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-medium font-semibold">
                  Deadline
                </th>
                <th className="px-4 py-2 text-center text-medium font-semibold">
                  Discription
                </th>
                <th className="px-4 py-2 text-center text-medium font-semibold rounded-tr-lg rounded-br-lg">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {result?.map((order) => (
                <>
                  <tr key={order.Id} className="border-t bg-gray-100">
                    <td className="px-4 py-2 text-center rounded-tl-lg rounded-bl-lg">
                      {order.Id}
                    </td>
                    <td className="px-4 py-2 text-center">{order.EventName}</td>
                    <td className="px-4 py-2 text-center">
                      <StatusChip OrderStatus={order.StatusName} />
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formatDate(order.Deadline)}
                    </td>
                    <td className="px-4 py-2 text-center truncate max-w-24">
                      {order.Description}
                    </td>
                    <td className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => toggleOrderItemsTable(order.Id)}
                        >
                          <img src="/eyeIcon.svg" />
                        </button>
                        <button type="button">
                          <img src="/EditIcon.svg" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(order.Id)}
                        >
                          <img src="/DeleteIcon.svg" />
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
      <DeleteModal
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        orderId={selectedOrderId}
        onDeleteSuccess={refreshData}
      />
    </div>
  );
};

export default OrderTable;
