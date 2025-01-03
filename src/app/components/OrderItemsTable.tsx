"use client";

import React, { useState } from "react";
import { useFetchOrderItems } from "../services/useFetchOrderItems";
import Spinner from "./Spinner";

const OrderItemsTable = ({ orderId }: { orderId: number }) => {
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState(false);
  const { isLoading, error, orderItems } = useFetchOrderItems(orderId);

  const openDeleteModal = () => setIsOpenDeleteModal(true);
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  return (
    <>
      <tr>
        <td colSpan={6} className="px-4 py-2">
          {isLoading ? (
            <Spinner />
          ) : (
            <table className="min-w-full bg-gray-100 border border-gray-200">
              <thead>
                <tr className="bg-gray-300">
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Product ID
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Product Name
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Created On
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Updated On
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Description
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((item) => {
                  return (
                    <tr>
                      <td className="px-4 py-2 border text-center">
                        {item.ProductId}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.ProductName}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.CreatedOn}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.UpdatedOn}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.Description}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button">
                            <img src="/EditIcon.svg" />
                          </button>
                          <button type="button" onClick={openDeleteModal}>
                            <img src="/DeleteIcon.svg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* <td className="px-4 py-2 border text-center">
                  <img
                    src="/exampleImage.png"
                    alt="Product"
                    className="w-10 h-10 object-cover mx-auto"
                  />
                </td>
                <td className="px-4 py-2 border text-center">1</td>
                <td className="px-4 py-2 border text-center">T-Shirt</td>
                <td className="px-4 py-2 border text-center">Custom</td>
                <td className="px-4 py-2 border text-center">M</td>
                <td className="px-4 py-2 border text-center">50</td>
                <td className="px-4 py-2 border text-center">Cotton</td>
                <td className="px-4 py-2 border text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button type="button">
                      <img src="/EditIcon.svg" />
                    </button>
                    <button type="button" onClick={openDeleteModal}>
                      <img src="/DeleteIcon.svg" />
                    </button>
                  </div>
                </td> */}
              </tbody>
            </table>
          )}
        </td>
      </tr>

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
    </>
  );
};

export default OrderItemsTable;
