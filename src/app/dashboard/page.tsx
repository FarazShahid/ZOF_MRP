"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import ModalLayout, {
  ModalBody,
  ModalHeader,
} from "../components/ModalLayout/ModalLayout";
import SideNavigation from "../components/SideNavigation";
import OrderProductForm from "../components/OrderProductForm";
import { useClientOrders } from "../services/useClientOrders";

const page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [showOrderItemTable, setShowOrderItemTable] = useState(false);
  const [orderType, setOrderType] = useState("1");


  // pass the client id to get the client orders
  const { isLoading, error, result } = useClientOrders("1");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openDeleteModal = () => setIsOpenDeleteModal(true);
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  const orders = [
    {
      orderId: "001",
      orderType: "Seasonal",
      status: "in-progress",
      deadline: "06/01/2024",
      description: "Description",
    },
  ];

  const HandleOrderItems = (showTable: boolean, orderId: string) => {
    setShowOrderItemTable(showTable);
    setSelectedOrderId(orderId);
  };

  return (
    <Layout>
      <SideNavigation />
      <div className="w-full flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <button
            type="button"
            onClick={openModal}
            className="bg-gray-500 hover:bg-gray-600 hover:font-semibold text-white px-3 py-1 rounded-lg"
          >
            + Add
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#364254]">
              <tr>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Order ID
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Order Type
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Dead Line
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
              {orders.map((order) => (
                <>
                  <tr
                    key={order.orderId}
                    className="border-t even:bg-[#BFE8E1] hover:bg-[#7bdbcb]"
                  >
                    <td className="px-4 py-2 border text-center">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {order.orderType}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {order.status}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {order.deadline}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {order.description}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            HandleOrderItems(!showOrderItemTable, order.orderId)
                          }
                        >
                          <img src="/arrowDown.svg" className="w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {showOrderItemTable && (
                    <tr>
                      <td colSpan={6} className="px-4 py-2">
                        <table className="min-w-full bg-gray-100 border border-gray-200">
                          <thead>
                            <tr className="bg-gray-300">
                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                                Image
                              </th>
                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                                Product ID
                              </th>
                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                                Product Name
                              </th>
                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                                Product Type
                              </th>
                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                                Size
                              </th>
                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                                Quantity
                              </th>
                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                                Fabric
                              </th>
                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-2 border text-center">
                                <img
                                  src="/exampleImage.png"
                                  alt="Product"
                                  className="w-10 h-10 object-cover mx-auto"
                                />
                              </td>
                              <td className="px-4 py-2 border text-center">
                                1
                              </td>
                              <td className="px-4 py-2 border text-center">
                                T-Shirt
                              </td>
                              <td className="px-4 py-2 border text-center">
                                Custom
                              </td>
                              <td className="px-4 py-2 border text-center">
                                M
                              </td>
                              <td className="px-4 py-2 border text-center">
                                50
                              </td>
                              <td className="px-4 py-2 border text-center">
                                Cotton
                              </td>
                              <td className="px-4 py-2 border text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button type="button">
                                    <img src="/EditIcon.svg" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={openDeleteModal}
                                  >
                                    <img src="/DeleteIcon.svg" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {/* ---------- Add Modal ---------- */}
      <ModalLayout
        isOpen={isOpen}
        onClose={closeModal}
        classNames="sm:w-[90%] md:w-[90%] lg:w-[45%]"
      >
        <ModalHeader title="Add Order" onClose={closeModal} />
        <ModalBody>
          <div className="flex w-full gap-6">
            <label className="flex items-center gap-0.5">
              <input
                type="radio"
                name="orderType"
                value="1"
                checked={orderType === "1"}
                onChange={() => setOrderType("1")}
              />
              Services
            </label>
            <label className="flex items-center gap-0.5">
              <input
                type="radio"
                name="orderType"
                value="2"
                checked={orderType === "2"}
                onChange={() => setOrderType("2")}
              />
              Products
            </label>
          </div>
          {orderType === "2" ? <OrderProductForm /> : <></>}
        </ModalBody>
      </ModalLayout>

      {/* ---------- Delete Modal ---------- */}
      {isOpenDeletModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg">
            {/* Modal Body */}
            <p className="text-xl font-semibold text-center">
              Are you sure you want to delete this?
            </p>
            <div className="mt-6 flex justify-end items-center gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 hover:text-white rounded-lg text-black hover:bg-green-400 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 hover:text-white text-black rounded-lg hover:bg-red-400 focus:outline-none"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}


    </Layout>
  );
};

export default page;
