"use client";

import React, { Fragment } from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Layout from "../components/Layout";
import ModalLayout, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "../components/ModalLayout/ModalLayout";
import { OrderTableHeader } from "../interfaces";

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
      orderType: "Winter Season",
      status: "In-progress",
      deadline: "01/04/2025",
      description: "test description"
    }
  ];

  const orderValidationSchema = {};
  const initialValues = {};
  const handleSubmit = (values: any) => {
    console.log("values", values);
  };

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
          <div className="flex flex-col gap-1 w-full">
            <div className="grid grid-flow-col w-full">
              {OrderTableHeader.map((header) => {
                return (
                  <div className="text-center bg-[#364254] px-4 py-2 text-sm w-full font-semibold text-gray-50 border">
                    {header}
                  </div>
                );
              })}
            </div>

            {orders.map((orders) => {
              return (
                <div className="grid grid-flow-col w-full">
                  <div className="bg-gray-400 text-black">{orders.id}</div>
                  <div className="bg-gray-400 text-black">{orders.orderType}</div>
                  <div className="bg-gray-400 text-black">{orders.status}</div>
                  <div className="bg-gray-400 text-black">{orders.deadline}</div>
                  <div className="flex items-center justify-center">
                    <img src="/arrowDown.svg" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Add Modal ---------- */}
      <ModalLayout isOpen={isOpen} onClose={closeModal}>
        <ModalHeader title="Add Order" onClose={closeModal} />
        <Formik
          validationSchema={orderValidationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <Fragment>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-gray-600 text-lg">
                        Order Type
                      </label>
                      <select className="inputDefault p-[7px] rounded-md">
                        <option value="">--Select--</option>
                        <option value="sample">Sample</option>
                        <option value="giveaway">Give Away</option>
                        <option value="event">Event</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-600 text-lg">Status</label>
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
                    <label className="text-gray-600 text-lg">
                      Product Desgin
                    </label>
                    <input
                      className="inputDefault p-[7px] rounded-md"
                      type="file"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-600 text-lg">
                      Order Details
                    </label>
                    <textarea
                      rows={5}
                      className="inputDefault p-[7px] rounded-md"
                    />
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
            </Form>
          )}
        </Formik>
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
