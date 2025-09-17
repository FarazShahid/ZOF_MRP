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
import { ArrowLeft, Package, Plus } from "lucide-react";

const ShipmentForm = ({ shipmentId }: { shipmentId?: string }) => {
  const router = useRouter();
  const formikRef = useRef<FormikProps<any>>(null);

  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const { fetchCarriors, Carriors } = useCarriorStore();
  const { fetchOrders, getOrderItemsByOrderId, Orders, OrderItemById } =
    useOrderStore();
  const { uploadDocument, loadingDoc } = useDocumentCenterStore();
  const { uploadedFilesByIndex, resetAllFiles } = useFileUploadStore();
  const {
    addShipment,
    updateShipment,
    getShipmentById,
    ShipmentById,
    loading,
  } = useShipmentStore();

  const ship = ShipmentById ?? null;

  const readBoxes = (src: any) => {
    const raw = src?.boxes ?? src?.Boxes ?? [];
    return Array.isArray(raw) ? raw : [];
  };

  // helper to normalize both legacy and new box shapes
  const normalizeBoxes = (src: any) => {
    const raw = readBoxes(src);
    return (Array.isArray(raw) ? raw : []).map((b: any) => ({
      BoxNumber: b?.BoxNumber ?? "",
      Weight: Number(b?.Weight) || 0,
      OrderItemName: b?.OrderItemName ?? "",
      OrderBoxDescription: b?.OrderBoxDescription ?? "",

      // if new shape is present, use it; otherwise adapt legacy fields to a single item row
      items:
        Array.isArray(b?.items) && b.items.length
          ? b.items.map((it: any) => ({
              OrderItemId:
                it?.OrderItemId != null ? String(it.OrderItemId) : "",
              OrderItemDescription: it?.OrderItemDescription ?? "",
              Quantity: Number(it?.Quantity) || 0,
            }))
          : [
              {
                OrderItemId:
                  b?.OrderItemId != null ? String(b.OrderItemId) : "",
                OrderItemDescription: b?.OrderItemDescription ?? "",
                Quantity: Number(b?.Quantity) || 0,
              },
            ],
    }));
  };

  const initialValues = useMemo(() => {
    if (shipmentId && ship) {
      const boxes = normalizeBoxes(ship);

      return {
        ShipmentCode: ship.ShipmentCode || "",
        TrackingId: ship.TrackingId || "",
        OrderNumber: ship.OrderNumber || "",
        ShipmentCarrierId: ship.ShipmentCarrierId || "",
        ShipmentDate: ship.ShipmentDate
          ? ship.ShipmentDate.substring(0, 10)
          : "",
        ReceivedTime: ship.ReceivedTime
          ? ship.ReceivedTime.substring(0, 16)
          : "",
        WeightUnit: ship.WeightUnit || "",
        TotalWeight: ship.TotalWeight || 0,
        NumberOfBoxes: ship.NumberOfBoxes || 0,
        ShipmentCost: parseFloat(String(ship.ShipmentCost)) || 0,
        Status: ship.Status || "",
        orderIds: ship.OrderIds?.map((id: number) => ({ orderId: id })) || [],
        boxes: boxes.length
          ? boxes
          : [
              {
                BoxNumber: "",
                Weight: 0,
                OrderBoxDescription: "",
                items: [
                  { OrderItemId: "", OrderItemDescription: "", Quantity: 0 },
                ],
              },
            ],
      };
    }

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
      boxes: [
        {
          BoxNumber: "",
          Weight: 0,
          OrderBoxDescription: "",
          items: [{ OrderItemId: "", OrderItemDescription: "", Quantity: 0 }],
        },
      ],
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
      OrderIds: selectedOrderIds.map((x) => Number(x)),
      ShipmentCarrierId: values.ShipmentCarrierId,
      ShipmentDate: values.ShipmentDate,
      ShipmentCost: Number(values.ShipmentCost) || 0,
      TotalWeight: Number(values.TotalWeight) || 0,
      NumberOfBoxes: Number(values.NumberOfBoxes) || 0,
      WeightUnit: values.WeightUnit,
      ReceivedTime: values.ReceivedTime,
      Status: values.Status,

      // boxes: (values.boxes || []).map((b: any) => ({
      //   BoxNumber: String(b.BoxNumber ?? ""),
      //   Quantity: Number(b.Quantity) || 0,
      //   Weight: Number(b.Weight) || 0,
      //   OrderItemName: b.OrderItemName ?? "",
      //   OrderItemId: b.OrderItemId ? Number(b.OrderItemId) : undefined,
      //   OrderItemDescription: b.OrderItemDescription ?? "",
      // })),
      boxes: (values.boxes || []).map((b: any) => ({
        BoxNumber: String(b.BoxNumber ?? ""),
        Weight: Number(b.Weight) || 0,
        OrderItemName: String(b.OrderItemName ?? ""),
        OrderBoxDescription: b.OrderBoxDescription ?? "",
        items: (b.items || []).map((it: any) => ({
          OrderItemId: it.OrderItemId ? Number(it.OrderItemId) : undefined,
          OrderItemDescription: String(it.OrderItemDescription ?? ""),
          Quantity: Number(it.Quantity) || 0,
        })),
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
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/shipment"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {!shipmentId ? "Add New " : "Edit "} Shipment
              </h1>
              <p className="text-gray-600 mt-1">
                {!shipmentId ? "Create a new " : "Edit "}
                shipment record
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Formik
          innerRef={formikRef}
          validationSchema={ShipmentSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleAdd}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="space-y-8">
                {/* Section 1: Basic Shipment Info */}
                <div className="bg-white  dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-500 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Basic Shipment Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          <SelectItem key={Order?.Id}>
                            {Order?.OrderName}
                          </SelectItem>
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
                      <ErrorMessage
                        name="ShipmentCode"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label isRequired={true} label="Tracking ID" />
                      <Field
                        type="text"
                        name="TrackingId"
                        placeholder="Enter Tracking Id"
                        className="defaultInputField"
                      />
                      <ErrorMessage
                        name="TrackingId"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label isRequired={true} label="Shipment Carrier" />
                      <Field
                        as="select"
                        name="ShipmentCarrierId"
                        className="defaultInputField"
                      >
                        <option value={""}>Select Carrier</option>
                        {Carriors?.map((Carrior, index) => (
                          <option value={Carrior?.Id} key={index}>
                            {Carrior?.Name}
                          </option>
                        ))}
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
                        className="defaultInputField"
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
                        className="defaultInputField"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label isRequired={true} label="Weight Unit" />
                      <Field
                        as="select"
                        name="WeightUnit"
                        className="defaultInputField"
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
                        className="defaultInputField"
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
                        className="defaultInputField"
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
                        className="defaultInputField"
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
                        className="defaultInputField"
                      >
                        <option value={""}>Select a status</option>
                        {ShipmentStatus?.map((status, index) => (
                          <option value={status?.label} key={index}>
                            {status?.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="Status"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                {/* Section 2: Boxes Information */}
                <div className="bg-white  dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-500 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Boxes Information
                      </h2>
                    </div>
                  </div>

                  <FieldArray name="boxes">
                    {({ push, remove, form }) => (
                      <>
                        {(form.values.boxes ?? []).map(
                          (box: any, index: number) => (
                            <div
                              key={index}
                              className="grid grid-cols-2 gap-2 border border-gray-200 rounded-xl p-3 mb-2"
                            >
                              {/* Box header fields */}
                              <div className="flex flex-col gap-1">
                                <Label isRequired={true} label="Box Number" />
                                <Field
                                  type="text"
                                  name={`boxes[${index}].BoxNumber`}
                                  placeholder="Enter Box No."
                                  className="defaultInputField"
                                />
                                <ErrorMessage
                                  name={`boxes[${index}].BoxNumber`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <Label isRequired={true} label="Weight" />
                                <Field
                                  type="number"
                                  name={`boxes[${index}].Weight`}
                                  className="defaultInputField"
                                />
                                <ErrorMessage
                                  name={`boxes[${index}].Weight`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              {/* ------- Items inside this box ------- */}
                              <div className="col-span-2">
                                {/* <div className="text-sm font-semibold mb-1">
                                  Items
                                </div> */}
                                <FieldArray name={`boxes[${index}].items`}>
                                  {({ push: pushItem, remove: removeItem }) => (
                                    <div className="space-y-2 w-full">
                                      {(box.items ?? []).map(
                                        (_: any, j: number) => (
                                          <div
                                            key={j}
                                            className="grid grid-cols-2 md:grid-cols-4 gap-2 items-start"
                                          >
                                            <div className="flex flex-col gap-1">
                                              <Label
                                                isRequired={true}
                                                label="Order Item"
                                              />
                                              <Field
                                                as="select"
                                                name={`boxes[${index}].items[${j}].OrderItemId`}
                                                className="defaultInputField"
                                              >
                                                <option value={""}>
                                                  Select an order item
                                                </option>
                                                {OrderItemById?.map(
                                                  (item, i) => (
                                                    <option
                                                      value={String(item.Id)}
                                                      key={i}
                                                    >
                                                      {item.Name}
                                                    </option>
                                                  )
                                                )}
                                              </Field>
                                              <ErrorMessage
                                                name={`boxes[${index}].items[${j}].OrderItemId`}
                                                component="div"
                                                className="text-red-500 text-sm"
                                              />
                                            </div>

                                            <div className="flex flex-col gap-1">
                                              <Label
                                                isRequired={true}
                                                label="Quantity"
                                              />
                                              <Field
                                                type="number"
                                                name={`boxes[${index}].items[${j}].Quantity`}
                                                className="defaultInputField"
                                              />
                                              <ErrorMessage
                                                name={`boxes[${index}].items[${j}].Quantity`}
                                                component="div"
                                                className="text-red-500 text-sm"
                                              />
                                            </div>
                                            <div className="flex items-center justify-end md:col-span-4 col-span-2 gap-3">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  pushItem({
                                                    OrderItemId: "",
                                                    OrderItemDescription: "",
                                                    Quantity: 0,
                                                  })
                                                }
                                                className="text-green-500"
                                                title="Add item row"
                                              >
                                                <FaCirclePlus size={20} />
                                              </button>
                                              {j > 0 && (
                                                <button
                                                  type="button"
                                                  onClick={() => removeItem(j)}
                                                  className="text-red-500"
                                                  title="Remove item row"
                                                >
                                                  <MdDelete size={20} />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </FieldArray>
                              </div>

                              <div className="flex flex-col gap-1 col-span-2">
                                <Label isRequired={false} label="Description" />
                                <Field
                                  as="textarea"
                                  placeholder="Enter Description"
                                  name={`boxes[${index}].OrderBoxDescription`}
                                  className="defaultInputField"
                                />
                                <ErrorMessage
                                  name={`boxes[${index}].OrderBoxDescription`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </div>

                              {/* Box-level actions */}
                              <div className="flex justify-end col-span-2 gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    push({
                                      BoxNumber: "",
                                      Weight: 0,
                                      OrderItemName: "",
                                      items: [
                                        {
                                          OrderItemId: "",
                                          OrderItemDescription: "",
                                          Quantity: 0,
                                        },
                                      ],
                                    })
                                  }
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                  title="Add box"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Add Box</span>
                                </button>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="bg-red-500 px-2 py-1 rounded-lg text-sm text-white"
                                    title="Remove box"
                                  >
                                    Remove Box
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </>
                    )}
                  </FieldArray>
                </div>
              </div>

              <DropZoneMultiple index={1} onFileSelect={handleFileSelect} />
              {shipmentId && (
                <RecentAttachmentsView
                  referenceId={Number(shipmentId)}
                  referenceType={DOCUMENT_REFERENCE_TYPE.SHIPMENT}
                />
              )}

              <div className="flex items-center justify-end gap-2 mt-5">
                <Button
                  color="danger"
                  type="button"
                  variant="flat"
                  onPress={onClose}
                >
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
