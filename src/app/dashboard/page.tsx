"use client";

import React, { Fragment } from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import ModalLayout, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "../components/ModalLayout/ModalLayout";

const page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openDeleteModal = () => setIsOpenDeleteModal(true);
  const closeDeleteModal = () => setIsOpenDeleteModal(false);

  const orders = [
    {
      id: "001",
      name: "Order 1",
      product: "T-shirt",
      fabric: "Cotton",
      color: "Blue",
      size: "M",
      image: "/tshirtMockUp.jpg",
    },
    {
      id: "002",
      name: "Order 2",
      product: "Jacket",
      fabric: "Leather",
      color: "Black",
      size: "L",
      image: "/tshirtMockUp.jpg",
    },
    {
      id: "003",
      name: "Order 3",
      product: "Pants",
      fabric: "Denim",
      color: "Gray",
      size: "XL",
      image: "/tshirtMockUp.jpg",
    },
    {
      id: "004",
      name: "Order 4",
      product: "Pants",
      fabric: "Denim",
      color: "Gray",
      size: "XXL",
      image: "/tshirtMockUp.jpg",
    },
  ];

  return (
    <Layout>
      <div className="w-full flex flex-col gap-3">
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
                  Order Name
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Product
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Fabric
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Color
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Size
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Product Design
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-50 border">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t even:bg-[#BFE8E1] hover:bg-[#7bdbcb]"
                >
                  <td className="px-4 py-2 border text-center">{order.id}</td>
                  <td className="px-4 py-2 border text-center">{order.name}</td>
                  <td className="px-4 py-2 border text-center">
                    {order.product}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {order.fabric}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {order.color}
                  </td>
                  <td className="px-4 py-2 border text-center">{order.size}</td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex items-center justify-center">
                      <img
                        src={order.image}
                        alt="prodcut Design"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button">
                        <img src="/EditIcon.svg" className="w-4" />
                      </button>
                      <button type="button" onClick={openDeleteModal}>
                        <img src="/DeleteIcon.svg" className="w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ---------- Add Modal ---------- */}
      <ModalLayout isOpen={isOpen} onClose={closeModal}>
        <ModalHeader title="Add Order" onClose={closeModal} />
        <ModalBody>
          <Fragment>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-gray-600 text-lg">Fabric</label>
                <select className="inputDefault p-[7px] rounded-md">
                  <option value="">Select Fabric</option>
                  <option value="type1">Fabric Type 1</option>
                  <option value="type2">Fabric Type 2</option>
                  <option value="type3">SFabric Type 3</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-lg">Color</label>
                <div className="w-full flex items-center gap-2">
                  <select className="inputDefault p-[7px] rounded-md w-[85%]">
                    <option value="">Select Color</option>
                    <option value="type1">#000000</option>
                    <option value="type2">#ffffff</option>
                    <option value="type3">#ababab</option>
                  </select>
                  <div className="w-[15%] inputDefault rounded-lg h-[40px]"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-lg">Prodcut</label>
                <input
                  className="inputDefault p-[7px] rounded-md"
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-lg">Size</label>
                <select className="inputDefault p-[7px] rounded-md">
                  <option value="">Select Size</option>
                  <option value="s">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-lg">Product Desgin</label>
              <input className="inputDefault p-[7px] rounded-md" type="file" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-lg">Order Details</label>
              <textarea rows={5} className="inputDefault p-[7px] rounded-md" />
            </div>
          </Fragment>
        </ModalBody>
        <ModalFooter>
          <Fragment>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 hover:text-white rounded-lg text-black hover:bg-green-400 focus:outline-none"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 hover:text-white text-black rounded-lg hover:bg-red-400 focus:outline-none"
            >
              Cancel
            </button>
          </Fragment>
        </ModalFooter>
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
