"use client";

import { useState } from "react";
import { Field, FieldArray, Form, Formik } from "formik";

import AddIcon from "@/public/svgs/AddIcon";
import SubtractIcon from "@/public/svgs/SubtractIcon";

import OrderProductForm from "./OrderProductForm";
import EventSelect from "./EventSelect";
import OrderStatusSelect from "./OrderStatusSelect";
import { OrderSchemaValidation } from "../schema/OrderSchema";
import { OrderFormValues } from "../interfaces";
import { fetchWithAuth } from "../services/authservice";

const AddOrderForm  = ({ clientId }: { clientId: string }) => {
  const [selectedEventId, setSelectedEventId] = useState<number | null>();
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>();

  const handleEventChange = (selectedEvent: {
    id: number | null;
    name: string | null;
  }) => {
    setSelectedEventId(selectedEvent.id);
  };

  const handleStatusChange = (selectedStatus: {
    id: number | null;
    name: string | null;
  }) => {
    setSelectedStatusId(selectedStatus.id);
  };

  const OrderInitialValues: OrderFormValues = {
    ClientId: 0,
    OrderEventId: 0,
    Description: "",
    OrderStatusId: 0,
    Deadline: "",
    items: [
      {
        ProductId: 0,
        Description: "",
        ImageId: undefined,
        FileId: undefined,
        VideoId: undefined,
        printingOptions: [
          {
            PrintingOptionId: 0,
            Description: "",
          },
        ],
      },
    ],
  };

  const handleAddOrder = async (values: OrderFormValues) => {
    values.ClientId = clientId ? +clientId : 0;
    values.OrderEventId = selectedEventId ? selectedEventId : 0;
    values.OrderStatusId = selectedStatusId ? selectedStatusId : 0;

    // Add additional properties to each item in the items array
    values.items = values.items.map((item) => ({
      ...item,
      ImageId: 202,
      FileId: 302,
      VideoId: 402,
      printingOptions: [
        {
          PrintingOptionId: 3,
          Description: "Option 1 for Product 2",
        },
      ],
    }));

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      console.log("Order created successfully", result);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-auto gap-3">
      <Formik
        validationSchema={OrderSchemaValidation}
        initialValues={OrderInitialValues}
        onSubmit={handleAddOrder}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <label className="text-gray-600 text-lg">Order Name</label>
                <Field
                  type="text"
                  name="orderName"
                  className="inputDefault p-[7px] rounded-md"
                  placeholder="Type Here"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-lg">Order Event</label>
                <EventSelect onChange={handleEventChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-lg">Order Status</label>
                <OrderStatusSelect onChange={handleStatusChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-lg">Dead Line</label>
                <Field
                  name="Deadline"
                  type="date"
                  className="inputDefault p-[7px] rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-gray-600 text-lg">Description</label>
              <Field
                as="textarea"
                name="Description"
                rows={5}
                className="inputDefault p-[7px] rounded-md"
              />
            </div>
            <FieldArray name="items">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.items.map((item, index) => (
                    <OrderProductForm
                      key={index}
                      index={index}
                      remove={remove}
                    />
                  ))}
                  <div className="flex w-full justify-end gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          ProductId: 0,
                          Description: "",
                          ImageId: undefined,
                          FileId: undefined,
                          VideoId: undefined,
                          printingOptions: [
                            {
                              PrintingOptionId: 0,
                              Description: "",
                            },
                          ],
                        })
                      }
                      className="p-1 bg-gray-300 rounded-lg flex w-[28px] h-[28px] svgsize justify-center items-center hover:opacity-80 active:scale-90 transition-all"
                    >
                      <AddIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(values.items.length - 1)}
                      className="p-1 bg-gray-300 rounded-lg flex w-[28px] h-[28px] svgsize justify-center items-center hover:opacity-80 active:scale-90 transition-all"
                    >
                      <SubtractIcon />
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>
            <div className="flex w-full justify-end items-center px-4 py-4 gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-300 hover:text-white rounded-lg text-black hover:bg-green-400 focus:outline-none"
              >
                Save
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 hover:text-white text-black rounded-lg hover:bg-red-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddOrderForm;
