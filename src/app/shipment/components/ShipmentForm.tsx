"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "@heroui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Label from "../../components/common/Label";
import useOrderStore from "@/store/useOrderStore";
import { ShipmentSchema } from "../../schema/InventoryItemSchema";

const ShipmentForm = ({ shipmentId }: { shipmentId?: string }) => {
  const { fetchOrders, getOrderItemsByOrderId, Orders, OrderItemById } =
    useOrderStore();

  const initialValues = {
    orderId: "",
    OrderItemId: "",
  };
  const handleAdd = async () => {};

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-bold">Add New Shipment</h4>
        <div className="flex items-center gap-1 text-xs">
          <Link href={"/shipment"}>
            <span className="">Shipment</span>
          </Link>
          <MdKeyboardArrowRight />
          <span className="">Add New Shipment</span>
        </div>
      </div>

      <div className="m-10 p-5 bg-white dark:bg-slate-900 rounded">
        <Formik
          validationSchema={ShipmentSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleAdd}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <Label isRequired={true} label="Order" />
                  <Field
                    as="select"
                    name="OrderId"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const value = Number(e.target.value);
                      setFieldValue("orderId", value);
                      getOrderItemsByOrderId(value);
                    }}
                    className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                  >
                    <option value={""}>Select an order</option>
                    {Orders?.map((Order, index) => {
                      return (
                        <option value={Order?.Id} key={index}>
                          {Order.OrderName}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="OrderId"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label isRequired={true} label="Order Item" />
                  <Field
                    as="select"
                    name="OrderItemId"
                    className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                  >
                    <option value={""}>Select an Order Item</option>
                    {OrderItemById?.map((OrderItem, index) => {
                      return (
                        <option value={OrderItem?.Id} key={index}>
                          {OrderItem?.ProductName} _ {OrderItem?.Description}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="OrderItemId"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label isRequired={true} label="Quantity" />
                  <Field
                    type="number"
                    name="Quantity"
                    className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                  />
                  <ErrorMessage
                    name="Quantity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label isRequired={true} label="Size" />
                  <Field
                    type="text"
                    name="Size"
                    placeholder="Enter size"
                    className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                  />
                  <ErrorMessage
                    name="Size"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* ------ Box Info ------ */}

                <div className="flex flex-col gap-1">
                  <Label isRequired={true} label="Box Number" />
                  <Field
                    type="number"
                    name="BoxNumber"
                    className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                  />
                  <ErrorMessage
                    name="BoxNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label isRequired={true} label="Weight" />
                  <Field
                    type="number"
                    name="Weight"
                    className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                  />
                  <ErrorMessage
                    name="Weight"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-5">
                <Button color="danger" type="button" variant="flat">
                  Cancel
                </Button>
                <Button color="primary" type="submit" spinner={isSubmitting}>
                  Add
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ShipmentForm;
