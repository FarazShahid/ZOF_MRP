"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Button, Select, SelectItem, Spinner } from "@heroui/react";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikProps,
} from "formik";
import Label from "../../components/common/Label";
import { ShipmentSchema } from "../../schema/InventoryItemSchema";
import useCarriorStore from "@/store/useCarriorStore";
import { MdDelete } from "react-icons/md";
import { DOCUMENT_REFERENCE_TYPE, ShipmentStatus } from "@/interface";
import { FaCirclePlus } from "react-icons/fa6";
import useShipmentStore from "@/store/useShipmentStore";
import { useRouter } from "next/navigation";
import DropZoneMultiple from "../../components/DropZone/DropZoneMultiple";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { useFileUploadStore } from "@/store/useFileUploadStore";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import useOrderStore from "@/store/useOrderStore";

const ShipmentForm = ({ shipmentId }: { shipmentId?: string }) => {
  const router = useRouter();
  const formikRef = useRef<FormikProps<any>>(null);

  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const { fetchCarriors, Carriors } = useCarriorStore();
  const { fetchOrders, getOrderItemsByOrderId, Orders, OrderItemById } = useOrderStore();
  const { uploadDocument, loadingDoc } = useDocumentCenterStore();
  const { uploadedFilesByIndex, resetAllFiles } = useFileUploadStore();
  const {
    addShipment,
    updateShipment,
    getShipmentById,
    ShipmentById,
    loading,
  } = useShipmentStore();

  // ---- normalize shipment object from store (your store sets ShipmentById = data.data) ----
  const ship = ShipmentById ?? null;

  // safely read boxes from either `boxes` (api) or `Boxes` (type/interface)
  const readBoxes = (src: any) => {
    const raw = src?.boxes ?? src?.Boxes ?? [];
    return Array.isArray(raw) ? raw : [];
  };

  // ---------- initial values (memoized to avoid formik glitches) ----------
  const initialValues = useMemo(() => {
    if (shipmentId && ship) {
      const boxes = readBoxes(ship).map((b: any) => ({
        // API shows "Test Box-1" => keep string
        BoxNumber: b?.BoxNumber ?? "",
        Quantity: b?.Quantity ?? 0,
        Weight: b?.Weight ?? 0,
        OrderItemName: b?.OrderItemName ?? "",
        // keep string for <select> value
        OrderItemId: b?.OrderItemId != null ? String(b.OrderItemId) : "",
        OrderItemDescription: b?.OrderItemDescription ?? "",
      }));

      return {
        ShipmentCode: ship.ShipmentCode || "",
        TrackingId: ship.TrackingId || "",
        OrderNumber: ship.OrderNumber || "",
        ShipmentCarrierId: ship.ShipmentCarrierId || "",
        ShipmentDate: ship.ShipmentDate ? ship.ShipmentDate.substring(0, 10) : "",
        ReceivedTime: ship.ReceivedTime ? ship.ReceivedTime.substring(0, 16) : "",
        WeightUnit: ship.WeightUnit || "",
        TotalWeight: ship.TotalWeight || 0,
        NumberOfBoxes: ship.NumberOfBoxes || 0,
        ShipmentCost: parseFloat(String(ship.ShipmentCost)) || 0,
        Status: ship.Status || "",
        // for submit consistency
        orderIds: ship.OrderIds?.map((id: number) => ({ orderId: id })) || [],
        boxes: boxes.length
          ? boxes
          : [{ BoxNumber: "", Quantity: 0, Weight: 0, OrderItemDescription: "", OrderItemId: "" }],
      };
    }

    // new
    return {
      ShipmentCode: "",
      TrackingId: "",
      OrderNumber: "",
      ShipmentCarrierId: "",
      ShipmentDate: "",
      ReceivedTime: "",
      WeightUnit: "",
      TotalWeight: 0,
      NumberOfBoxes: 0,
      ShipmentCost: 0,
      Status: "",
      orderIds: [],
      boxes: [{ BoxNumber: "", Quantity: 0, Weight: 0, OrderItemDescription: "", OrderItemId: "" }],
    };
  }, [shipmentId, ship]);

  const onClose = () => router.push("/shipment");

  const handleOrderOptionChange = (
    keys: Set<React.Key> | "all",
    setFieldValue: (field: string, value: any) => void
  ) => {
    let OrderId: string[] = [];

    if (keys === "all") {
      OrderId = Orders.map((po) => String(po.Id));
    } else {
      OrderId = Array.from(keys).map(String);
    }

    setSelectedOrderIds(OrderId);

    setFieldValue(
      "orderIds",
      OrderId.map((id) => ({
        orderId: Number(id),
      }))
    );
  };

  const handleAdd = async (values: any) => {
    const files = uploadedFilesByIndex[1] || [];

    const payload = {
      ShipmentCode: values.ShipmentCode,
      TrackingId: values.TrackingId,
      OrderNumber: values.OrderNumber,
      // API expects number[]; convert from UI strings
      OrderIds: selectedOrderIds.map((x) => Number(x)),
      ShipmentCarrierId: values.ShipmentCarrierId,
      ShipmentDate: values.ShipmentDate,
      ShipmentCost: Number(values.ShipmentCost) || 0,
      TotalWeight: Number(values.TotalWeight) || 0,
      NumberOfBoxes: Number(values.NumberOfBoxes) || 0,
      WeightUnit: values.WeightUnit,
      ReceivedTime: values.ReceivedTime,
      Status: values.Status,

      boxes: (values.boxes || []).map((b: any) => ({
        BoxNumber: String(b.BoxNumber ?? ""),
        Quantity: Number(b.Quantity) || 0,
        Weight: Number(b.Weight) || 0,
        // keep both names—some backends accept either
        OrderItemName: b.OrderItemName ?? "",
        // convert back to number for API
        OrderItemId: b.OrderItemId ? Number(b.OrderItemId) : undefined,
        OrderItemDescription: b.OrderItemDescription ?? "",
      })),
    };

    if (shipmentId) {
      const updatedItem = await updateShipment(Number(shipmentId), payload);

      if (updatedItem && files.length > 0) {
        const refernceId = updatedItem.data.id;
        for (const fileObj of files) {
          await uploadDocument(
            fileObj.file,
            DOCUMENT_REFERENCE_TYPE.SHIPMENT,
            refernceId
          );
        }
      }

      resetAllFiles();
      if (updatedItem) onClose();
    } else {
      const result = await addShipment(payload);
      if (result && files.length > 0) {
        const refernceId = result.data.id;
        for (const fileObj of files) {
          await uploadDocument(
            fileObj.file,
            DOCUMENT_REFERENCE_TYPE.SHIPMENT,
            refernceId
          );
        }
      }
      resetAllFiles();
      if (result) onClose();
    }
  };

  const handleFileSelect = (file: File, index: number) => {
    setItemFiles((prev) => ({ ...prev, [index]: file }));
  };

  // -------- effects --------
  useEffect(() => {
    fetchCarriors();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (shipmentId) getShipmentById(Number(shipmentId));
  }, [shipmentId]);

  // hydrate UI-selected orders in edit mode
  useEffect(() => {
    if (shipmentId && ship?.OrderIds?.length) {
      const idsAsStrings = ship.OrderIds.map((id: number) => String(id));
      setSelectedOrderIds(idsAsStrings);

      // keep Formik hidden field in sync
      formikRef.current?.setFieldValue(
        "orderIds",
        ship.OrderIds.map((id: number) => ({ orderId: id }))
      );
    }
  }, [shipmentId, ship]);

  // fetch order items whenever selected orders change
  useEffect(() => {
    if (selectedOrderIds.length > 0) {
      getOrderItemsByOrderId(selectedOrderIds.map(Number));
    }
  }, [selectedOrderIds, getOrderItemsByOrderId]);

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
          <span className="">{!shipmentId ? "Add New Shipment" : "Edit Shipment"}</span>
        </div>
      </div>

      <div className="m-10 p-5 bg-white dark:bg-slate-900 rounded">
        <Formik
          innerRef={formikRef}
          validationSchema={ShipmentSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleAdd}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label isRequired={false} label="Order" />
                    <Select
                      className="rounded-xl text-gray-400 text-sm w-full outline-none dark:bg-slate-800 bg-gray-100"
                      name="orderId"
                      placeholder="Select Order"
                      variant="bordered"
                      selectionMode="multiple"
                      aria-label="Printing Options"
                      selectedKeys={new Set(selectedOrderIds)}
                      onSelectionChange={(keys) =>
                        handleOrderOptionChange(keys, setFieldValue)
                      }
                    >
                      {Orders?.map((Order) => (
                        <SelectItem key={Order?.Id}>{Order?.OrderName}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Shipment Code" />
                    <Field
                      type="text"
                      name="ShipmentCode"
                      placeholder="Enter shipment code"
                      className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                    />
                    <ErrorMessage name="ShipmentCode" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Tracking ID" />
                    <Field
                      type="text"
                      name="TrackingId"
                      placeholder="Enter Tracking Id"
                      className="defaultInputField"
                    />
                    <ErrorMessage name="TrackingId" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Shipment Carrier" />
                    <Field as="select" name="ShipmentCarrierId" className="defaultInputField">
                      <option value={""}>Select Carrier</option>
                      {Carriors?.map((Carrior, index) => (
                        <option value={Carrior?.Id} key={index}>
                          {Carrior?.Name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="ShipmentCarrierId" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Shipment Date" />
                    <Field type="date" name="ShipmentDate" className="defaultInputField" />
                    <ErrorMessage name="ShipmentDate" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={false} label="Received Time" />
                    <Field type="datetime-local" name="ReceivedTime" className="defaultInputField" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Weight Unit" />
                    <Field as="select" name="WeightUnit" className="defaultInputField">
                      <option value={""}>Select a Weight Unit</option>
                      <option value={"kg"}>KG</option>
                      <option value={"pound"}>Pound</option>
                    </Field>
                    <ErrorMessage name="WeightUnit" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Total Weight" />
                    <Field type="number" name="TotalWeight" className="defaultInputField" />
                    <ErrorMessage name="TotalWeight" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Number Of Boxes" />
                    <Field type="number" name="NumberOfBoxes" className="defaultInputField" />
                    <ErrorMessage name="NumberOfBoxes" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Shipment Cost" />
                    <Field type="number" name="ShipmentCost" className="defaultInputField" />
                    <ErrorMessage name="ShipmentCost" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label isRequired={true} label="Status" />
                    <Field as="select" name="Status" className="defaultInputField">
                      <option value={""}>Select a status</option>
                      {ShipmentStatus?.map((status, index) => (
                        <option value={status?.label} key={index}>
                          {status?.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="Status" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                {/* ------ boxes Info ------ */}
                <FieldArray name="boxes">
                  {({ push, remove, form }) => (
                    <>
                      {(form.values.boxes ?? []).map((_: any, index: number) => (
                        <div key={index} className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <Label isRequired={true} label="Box Number" />
                            <Field
                              type="text"
                              name={`boxes[${index}].BoxNumber`}
                              required
                              placeholder="Enter Box No."
                              className="defaultInputField"
                            />
                            <ErrorMessage name={`boxes[${index}].BoxNumber`} component="div" className="text-red-500 text-sm" />
                          </div>

                          <div className="flex flex-col gap-1">
                            <Label isRequired={true} label="Quantity" />
                            <Field type="number" required name={`boxes[${index}].Quantity`} className="defaultInputField" />
                            <ErrorMessage name={`boxes[${index}].Quantity`} component="div" className="text-red-500 text-sm" />
                          </div>

                          <div className="flex flex-col gap-1">
                            <Label isRequired={true} label="Weight" />
                            <Field type="number" required name={`boxes[${index}].Weight`} className="defaultInputField" />
                            <ErrorMessage name={`boxes[${index}].Weight`} component="div" className="text-red-500 text-sm" />
                          </div>

                          <div className="flex flex-col gap-1">
                            <Label isRequired={true} label="Order Item" />
                            <Field as="select" required name={`boxes[${index}].OrderItemId`} className="defaultInputField">
                              <option value={""}>Select an order item</option>
                              {OrderItemById?.map((item, i) => (
                                <option value={String(item.Id)} key={i}>
                                  {item.Name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name={`boxes[${index}].OrderItemId`} component="div" className="text-red-500 text-sm" />
                          </div>

                          <div className="flex flex-col gap-1 col-span-2">
                            <Label isRequired={false} label="Description" />
                            <Field
                              as="textarea"
                              placeholder="Enter Description"
                              name={`boxes[${index}].OrderItemDescription`}
                              className="defaultInputField"
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
                              onClick={() =>
                                push({
                                  BoxNumber: "",
                                  Quantity: 0,
                                  Weight: 0,
                                  OrderItemId: "",
                                  OrderItemDescription: "",
                                })
                              }
                              className="text-green-500"
                            >
                              <FaCirclePlus />
                            </button>
                            {index > 0 && (
                              <button type="button" onClick={() => remove(index)} className="text-red-500">
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
              {shipmentId && (
                <RecentAttachmentsView
                  referenceId={Number(shipmentId)}
                  referenceType={DOCUMENT_REFERENCE_TYPE.SHIPMENT}
                />
              )}

              <div className="flex items-center justify-end gap-2 mt-5">
                <Button color="danger" type="button" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {loadingDoc || loading ? <Spinner color="white" /> : <></>}
                  {shipmentId ? "Update" : "Save"}
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
