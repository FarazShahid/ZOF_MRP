"use client";

import { useEffect, useState } from "react";
import { Button, Spinner, Tooltip } from "@heroui/react";

import Layout from "../components/Layout";
import SideNavigation from "../components/SideNavigation";
import AddOrderComponent from "../components/AddOrderComponent";
import { formatDate } from "../interfaces";
import ViewOrderComponent from "../components/ViewOrderComponent";
import DeleteModal from "../components/DeleteModal";
import StatusChip from "../components/StatusChip";
import HeaderWidgets from "../components/HeaderWidgets";
import useOrderStore from "@/store/useOrderStore";

const page = () => {
  const [clientId, setClientId] = useState<number>();
  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isEditOrder, setIsisEditOrder] = useState<boolean>(false);
  const { fetchOrders, loading, Orders } = useOrderStore();

  const openDeleteModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  const OpenViewModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOpenViewModal(true);
  };
  const closeViewModal = () => {
    setSelectedOrderId(0);
    setIsOpenViewModal(false);
  };
  const openAddOrderModal = () => {
    setIsisEditOrder(false);
    setSelectedOrderId(0);
    setIsAddOrderModalOpen(true);
  };
  const closeAddOrderModal = () => {
    setIsAddOrderModalOpen(false);
  };

  const openEditOrderModal = (isEdit: boolean, OrderId: number) => {
    setIsisEditOrder(isEdit);
    setRefreshKey((prev) => prev + 1);
    setSelectedOrderId(OrderId);
    setIsAddOrderModalOpen(true);
  };

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (clientId) {
      fetchOrders(clientId);
    }
  }, [clientId]);

  return (
    <Layout>
      <SideNavigation
        isSideNavOpen={isSideNavOpen}
        setIsSideNavOpen={setIsSideNavOpen}
        onClientSelect={(id: number) => setClientId(id)}
      />
      <div className="w-full flex flex-col gap-3 p-5 max-h-full overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex w-fit items-center">
            <button
              className="xl:hidden pt-1 mr-2.5 rounded-md focus:outline-none hover:bg-gray-700"
              onClick={() => {
                setIsSideNavOpen(true);
              }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1 className="text-2xl font-semibold headerFontFamily">Orders</h1>
          </div>
          {clientId && (
            <Button color="primary" size="sm" onPress={openAddOrderModal}>
              Create Order
            </Button>
          )}
        </div>
        {clientId && (
          <div className="flex flex-col gap-3">
            <HeaderWidgets orders={Orders} />
            {loading ? (
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
                        Order No.
                      </th>
                      <Tooltip content="External Order Id">
                        <th className="px-4 py-2 text-center text-medium font-semibold cursor-pointer truncate max-w-24">
                          External Order Id
                        </th>
                      </Tooltip>

                      <th className="px-4 py-2 text-center text-medium font-semibold">
                        Event
                      </th>
                      <th className="px-4 py-2 text-center text-medium font-semibold cursor-pointer">
                        Status
                      </th>
                      <th className="px-4 py-2 text-center text-medium font-semibold cursor-pointer">
                        Priority
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
                    {Orders?.map((order) => (
                      <>
                        <tr
                          key={`${order.Id}_${order.OrderStatusId}`}
                          onClick={() => OpenViewModal(order.Id)}
                          className="border-t bg-gray-100 cursor-pointer"
                        >
                          <Tooltip content={order.OrderName}>
                            <td className="px-4 py-2 text-center rounded-tl-lg rounded-bl-lg truncate max-w-28">
                              {order.OrderName}
                            </td>
                          </Tooltip>
                          <td className="px-4 py-2 text-center">
                            {order.OrderNumber}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {order.ExternalOrderId}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {order.EventName}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <StatusChip OrderStatus={order.StatusName} />
                          </td>
                          <td className="px-4 py-2 text-center">
                            {order.OrderPriority}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {formatDate(order.Deadline)}
                          </td>
                          <Tooltip content={order.Description}>
                            <td className="px-4 py-2 text-center truncate max-w-24">
                              {order.Description}
                            </td>
                          </Tooltip>

                          <td className="px-4 py-2 rounded-tr-lg rounded-br-lg">
                            <div className="flex items-center gap-2 justify-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditOrderModal(true, order.Id);
                                }}
                              >
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
          </div>
        )}
      </div>

      <AddOrderComponent
        isOpen={isAddOrderModalOpen}
        clientId={clientId}
        onClose={closeAddOrderModal}
        onOrderAdded={refreshData}
        isEditOrder={isEditOrder}
        refreshKey={refreshKey}
        orderId={selectedOrderId}
      />
      <DeleteModal
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        orderId={selectedOrderId}
        clientId={clientId}
        onDeleteSuccess={refreshData}
      />
      <ViewOrderComponent
        isOpen={isOpenViewModal}
        onClose={closeViewModal}
        selectedOrderId={selectedOrderId}
      />
    </Layout>
  );
};

export default page;
