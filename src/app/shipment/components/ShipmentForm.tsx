"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "@heroui/react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Label from "../../components/common/Label";
import useOrderStore from "@/store/useOrderStore";
import { ShipmentSchema } from "../../schema/InventoryItemSchema";
import useCarriorStore from "@/store/useCarriorStore";
import { MdDelete } from "react-icons/md";
import { DOCUMENT_REFERENCE_TYPE, ShipmentStatus } from "@/interface";
import { FaCirclePlus } from "react-icons/fa6";
import useShipmentStore from "@/store/useShipmentStore";
import { useRouter } from "next/navigation";
import DropZoneMultiple from "../../components/DropZone/DropZoneMultiple";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";

const ShipmentForm = ({ shipmentId }: { shipmentId?: string }) => {
  const router = useRouter();
  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});


  const { fetchCarriors, Carriors } = useCarriorStore();
  const { uploadDocument } = useDocumentCenterStore();
  const { addShipment, updateShipment, getShipmentById, ShipmentById } =
    useShipmentStore();

  const getInitialValues = () => {
    if (shipmentId && ShipmentById) {
      return {
        ShipmentCode: ShipmentById.ShipmentCode || "",
        OrderNumber: ShipmentById.OrderNumber || "",
        ShipmentCarrierId: ShipmentById.ShipmentCarrierId || "",
        ShipmentDate: ShipmentById.ShipmentDate
          ? ShipmentById.ShipmentDate.substring(0, 10)
          : "",
        ReceivedTime: ShipmentById.ReceivedTime
          ? ShipmentById.ReceivedTime.substring(0, 16)
          : "",
        WeightUnit: ShipmentById.WeightUnit || "",
        TotalWeight: ShipmentById.TotalWeight || 0,
        NumberOfBoxes: ShipmentById.NumberOfBoxes || 0,
        ShipmentCost: parseFloat(ShipmentById.ShipmentCost) || 0,
        Status: ShipmentById.Status || "",
        boxes: ShipmentById.Boxes?.map((b) => ({
          BoxNumber: b.BoxNumber,
          Quantity: b.Quantity,
          Weight: b.Weight,
          OrderItem: b.OrderItem,
          OrderItemDescription: b.OrderItemDescription,
        })) || [
          {
            BoxNumber: 0,
            Quantity: 0,
            Weight: 0,
            OrderItem: "",
            OrderItemDescription: "",
          },
        ],
      };
    }

    // Default new shipment
    return {
      ShipmentCode: "",
      OrderNumber: "",
      ShipmentCarrierId: "",
      ShipmentDate: "",
      ReceivedTime: "",
      WeightUnit: "",
      TotalWeight: 0,
      NumberOfBoxes: 0,
      ShipmentCost: 0,
      Status: "",
      boxes: [
        {
          BoxNumber: 0,
          Weight: 0,
        },
      ],
    };
  };

  const onClose = () => {
    router.push("/shipment");
  };

  const handleAdd = async (values: any) => {
    if (shipmentId) {
      const updatedItem = await updateShipment(Number(shipmentId), values);
        if (updatedItem && Object.values(itemFiles).length > 0) {
        for (const file of Object.values(itemFiles)) {
          if (file) {
            await uploadDocument(
              file,
              DOCUMENT_REFERENCE_TYPE.SHIPMENT,
              updatedItem.Id
            );
          }
        }
      }
      onClose();
    } else {
      const result = await addShipment(values);
      if (result) {
        for (const file of Object.values(itemFiles)) {
          if (file) {
            await uploadDocument(
              file,
              DOCUMENT_REFERENCE_TYPE.SHIPMENT,
              result.Id
            );
          }
        }
        onClose();
      }
    }
  };

  const handleFileSelect = (file: File, index: number) => {
    setItemFiles((prev) => ({ ...prev, [index]: file }));
  };

  useEffect(() => {
    fetchCarriors();
  }, []);

  useEffect(() => {
    if (shipmentId) {
      getShipmentById(Number(shipmentId));
    }
  }, [shipmentId]);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-bold">
          {!shipmentId ? "Add New Shipment" : "Edit Shipment"}
        </h4>
        <div className="flex items-center gap-1 text-xs">
          <Link href={"/shipment"}>
            <span className="">Shipment</span>
          </Link>
          <MdKeyboardArrowRight />
          <span className="">
            {!shipmentId ? "Add New Shipment" : "Edit Shipment"}
          </span>
        </div>
      </div>

      <div className="m-10 p-5 bg-white dark:bg-slate-900 rounded">
        <Formik
          validationSchema={ShipmentSchema}
          initialValues={getInitialValues()}
          enableReinitialize
          onSubmit={handleAdd}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label isRequired={false} label="Order Number" />
                    <Field
                      type="text"
                      name="OrderNumber"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Shipment Code" />
                    <Field
                      type="text"
                      name="ShipmentCode"
                      placeholder="Enter shipment code"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    />
                    <ErrorMessage
                      name="ShipmentCode"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Shipment Carrier" />
                    <Field
                      as="select"
                      name="ShipmentCarrierId"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    >
                      <option value={""}>Select Carrier</option>
                      {Carriors?.map((Carrior, index) => {
                        return (
                          <option value={Carrior?.Id} key={index}>
                            {Carrior?.Name}
                          </option>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="ShipmentCarrierId"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Shipment Date" />
                    <Field
                      type="date"
                      name="ShipmentDate"
                      placeholder="Enter shipment code"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    />
                    <ErrorMessage
                      name="ShipmentDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={false} label="Received Time" />
                    <Field
                      type="datetime-local"
                      name="ReceivedTime"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    />
                    <ErrorMessage
                      name="ReceivedTime"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Weight Unit" />
                    <Field
                      as="select"
                      name="WeightUnit"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    >
                      <option value={""}>Select a Weight Unit</option>
                      <option value={"kg"}>KG</option>
                      <option value={"pound"}>Pound</option>
                    </Field>
                    <ErrorMessage
                      name="WeightUnit"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Total Weight" />
                    <Field
                      type="number"
                      name="TotalWeight"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    />
                    <ErrorMessage
                      name="TotalWeight"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Number Of Boxes" />
                    <Field
                      type="number"
                      name="NumberOfBoxes"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    />
                    <ErrorMessage
                      name="NumberOfBoxes"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Shipment Cost" />
                    <Field
                      type="number"
                      name="ShipmentCost"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    />
                    <ErrorMessage
                      name="ShipmentCost"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Status" />
                    <Field
                      as="select"
                      name="Status"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    >
                      <option value={""}>Select a status</option>
                      {ShipmentStatus?.map((status, index) => {
                        return (
                          <option value={status?.label} key={index}>
                            {status?.label}
                          </option>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="Status"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* ------ boxes Info ------ */}

                <FieldArray name="boxes">
                  {({ push, remove, form }) => (
                    <>
                      {form.values.boxes.map((_: any, index: number) => (
                        <div key={index} className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <Label isRequired={true} label="Box Number" />
                            <Field
                              type="number"
                              name={`boxes[${index}].BoxNumber`}
                              className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                            />
                            <ErrorMessage
                              name={`boxes[${index}].BoxNumber`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label isRequired={true} label="Quantity" />
                            <Field
                              type="number"
                              name={`boxes[${index}].Quantity`}
                              className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                            />
                            <ErrorMessage
                              name={`boxes[${index}].Quantity`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label isRequired={true} label="Weight" />
                            <Field
                              type="number"
                              name={`boxes[${index}].Weight`}
                              className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                            />
                            <ErrorMessage
                              name={`boxes[${index}].Weight`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label isRequired={true} label="Order Item" />
                            <Field
                              type="text"
                              name={`boxes[${index}].OrderItem`}
                              className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                            />
                            <ErrorMessage
                              name={`boxes[${index}].OrderItem`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label isRequired={false} label="Description" />
                            <Field
                              type="text"
                              name={`boxes[${index}].OrderItemDescription`}
                              className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                            />
                            <ErrorMessage
                              name={`boxes[${index}].OrderItemDescription`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div className="flex justify-end col-span-2 gap-3">
                            <button
                              type="button"
                              onClick={() => push({ BoxNumber: 0, Weight: 0 })}
                              className="text-green-500"
                            >
                              <FaCirclePlus />
                            </button>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500"
                              >
                                <MdDelete />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </FieldArray>
              </div>
              <DropZoneMultiple index={1} onFileSelect={handleFileSelect} />
              <div className="flex items-center justify-end gap-2 mt-5">
                <Button
                  color="danger"
                  type="button"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  spinner={isSubmitting}
                  disabled={isSubmitting}
                >
                 {shipmentId ? "Edit" :"Add"}
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
