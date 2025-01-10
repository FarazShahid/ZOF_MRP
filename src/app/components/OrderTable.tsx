import React, { useState } from "react";

import Spinner from "./Spinner";
import HeaderWidgets from "./HeaderWidgets";
import StatusChip from "./StatusChip";
import DeleteModal from "./DeleteModal";
import ViewOrderComponent from "./ViewOrderComponent";
import { useClientOrders } from "../services/useClientOrders";
import { formatDate, Order } from "../interfaces";

const OrderTable = ({ clientId, refreshTableData }: { clientId: string, refreshTableData: number }) => {
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<Order>()

  const { isLoading, result } = useClientOrders(clientId, refreshKey);

  const openDeleteModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  const OpenViewModal = (order:Order, orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOpenViewModal(true);
    setSelectedOrder(order);
  };
  const closeViewModal = () => setIsOpenViewModal(false);

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
                  Order Name
                </th>
                <th className="px-4 py-2 text-center text-medium font-semibold">
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
                  <tr
                    key={order.Id}
                    onClick={() => OpenViewModal(order, order.Id)}
                    className="border-t bg-gray-100 cursor-pointer"
                  >
                    <td className="px-4 py-2 text-center rounded-tl-lg rounded-bl-lg">
                      {order.Id}
                    </td>
                    <td className="px-4 py-2 text-center">{order.Id}</td>
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
                        <button type="button">
                          <img src="/EditIcon.svg" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(order.Id);
                          }}
                        >
                          <img src="/DeleteIcon.svg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}


      <ViewOrderComponent
        isOpen={isOpenViewModal}
        onClose={closeViewModal}
        selectedOrder={selectedOrder}
      />

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
