"use client";

import dynamic from "next/dynamic";
import { Link } from "@heroui/react";
import { Form, Formik, setIn } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { FaRuler } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { IoDocumentAttach, IoCaretBackSharp } from "react-icons/io5";

import useOrderStore from "@/store/useOrderStore";
import { OrderValidationSchemas } from "../../schema";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { FormValues, steps } from "@/src/types/order";
import * as Yup from "yup";
import toast from "react-hot-toast";
import useOrderDocumentTypesStore from "@/store/useOrderDocumentTypesStore";
import {
  createEmptyDocumentRow,
  type DocumentAttachmentRow,
  getOrderDocumentUploadItems,
  getOrderDocumentValidationError,
} from "./OrderDocumentUploadPicker";
import {
  type OrderDocumentFilesByType,
} from "./OrderAttachments";
import Spinner from "../../components/Spinner";

// lazy load
const Step1 = dynamic(() => import("./Step1"), {loading: () => null});
const Step2 = dynamic(() => import("./Step2"), {loading: () => null});
const OrderAttachments = dynamic(() => import("./OrderAttachments"), {loading: () => null});


const formSteps = [
  { id: 1, name: "Order Details", icon: <FaRegFileLines size={20} /> },
  { id: 2, name: "Order Items", icon: <FaRuler size={20} /> },
  { id: 3, name: "Order Attachments", icon: <IoDocumentAttach size={20} /> },
];

const defaultValues: FormValues = {
  OrderName: "",
  OrderNumber: "",
  OrderType: "",
  ClientId: "",
  OrderEventId: "",
  Description: "",
  Deadline: "",
  OrderPriority: "",
  items: [],
};

const markTouchedFromErrors = (errorValue: any): any => {
  if (Array.isArray(errorValue)) {
    return errorValue.map(markTouchedFromErrors);
  }

  if (errorValue && typeof errorValue === "object") {
    return Object.keys(errorValue).reduce((acc, key) => {
      acc[key] = markTouchedFromErrors(errorValue[key]);
      return acc;
    }, {} as Record<string, any>);
  }

  return true;
};

const getTouchedFromYupError = (error: any) => {
  const validationErrors =
    Array.isArray(error?.inner) && error.inner.length > 0
      ? error.inner
      : [error];

  return validationErrors.reduce((acc: any, validationError: any) => {
    if (!validationError?.path) return acc;
    return setIn(acc, validationError.path, true);
  }, {});
};

const normalizeOptionalNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const normalizeOptionalString = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const OrderForm = ({ orderId }: { orderId?: string }) => {
  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});
  const [orderDocumentFiles, setOrderDocumentFiles] =
    useState<OrderDocumentFilesByType>({});
  const [orderDocumentRows, setOrderDocumentRows] = useState<
    DocumentAttachmentRow[]
  >(() => [createEmptyDocumentRow()]);
  const [selectedOrderDocumentTypeIds, setSelectedOrderDocumentTypeIds] =
    useState<number[]>([]);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();
  const clientIdFromQuery = searchParams.get("clientId");

  const [initialValues, setInitialValues] = useState<FormValues>(() => {
    // Preselect client when coming from client profile
    if (clientIdFromQuery) {
      return {
        ...defaultValues,
        ClientId: clientIdFromQuery,
      };
    }
    return defaultValues;
  });

  const { addOrder, getOrderById, updateOrder, OrderById } = useOrderStore();
  const { uploadOrderDocuments, loadingDoc } = useDocumentCenterStore();
  const { orderDocumentTypes, fetchOrderDocumentTypes } =
    useOrderDocumentTypesStore();

  const router = useRouter();

  // Get validation schema based on step and edit mode
  const getValidationSchema = (step: number, isEdit: boolean) => {
    if (step === 0) {
      // Step 1 validation
      const step1Schema: any = {
        OrderName: Yup.string().required("Order Name is required"),
        ClientId: Yup.string().required("Client is required"),
        Deadline: Yup.string().required("Deadline is required"),
        OrderPriority: Yup.string().required("Order Priority is required"),
      };
      
      // Only add OrderNumber validation for edit case
      if (isEdit) {
        step1Schema.OrderNumber = Yup.string().required("Order Number is required");
      }
      
      return Yup.object(step1Schema);
    }
    
    // Return other step schemas as is
    return OrderValidationSchemas[step];
  };

  // Fetch existing order when editing
  useEffect(() => {
    if (orderId) {
      getOrderById(Number(orderId));
    }
  }, [orderId]);

  // When OrderById updates, map to formik initialValues
  useEffect(() => {
    if (orderId && OrderById) {
      const mapped: FormValues = {
        OrderName: OrderById.OrderName,
        OrderNumber: OrderById.OrderNumber,
        ClientId: String(OrderById.ClientId),
        OrderType: OrderById.OrderType,
        OrderEventId: OrderById.OrderEventId
          ? String(OrderById.OrderEventId)
          : undefined,
        Description: OrderById.Description,
        Deadline: OrderById.Deadline.split("T")[0], // YYYY-MM-DD
        OrderPriority: String(OrderById.OrderPriority),
        items: OrderById.items.map((item) => ({
          ...item,
          printingOptions: item.printingOptions.map((po) => ({
            PrintingOptionId: po.PrintingOptionId,
          })),
          orderItemDetails: item.orderItemDetails.map((detail) => ({
            ColorOptionId: detail.ColorOptionId,
            SizeOption: detail.SizeOptionId,
            MeasurementId: detail.MeasurementId,
            ProductSubCategoryId: detail.ProductSubCategoryId ?? "",
            StyleNumber: detail.StyleNumber ?? "",
            Quantity: detail.Quantity,
            Priority: detail.Priority,
          })),
        })),
      };
      setInitialValues(mapped);
    }
  }, [OrderById, orderId]);

  const renderStep = (formikProps: any) => {
    switch (currentStep) {
      case 1:
        return <Step1 formik={formikProps} isEdit={!!orderId} />;
      case 2:
        return (
          <Step2
            formik={formikProps}
            itemFiles={itemFiles}
            onFileSelect={handleFileSelect}
          />
        );
      case 3:
        return (
          <OrderAttachments
            orderId={orderId || null}
            documentFiles={orderDocumentFiles}
            onDocumentFilesChange={handleOrderDocumentFilesChange}
            onRemoveDocumentFile={handleRemoveOrderDocumentFile}
            onSelectedDocumentTypesChange={setSelectedOrderDocumentTypeIds}
            documentRows={orderDocumentRows}
            onDocumentRowsChange={setOrderDocumentRows}
          />
        );
      default:
        return null;
    }
  };

  const handleFileSelect = (file: File, index: number) => {
    setItemFiles((prev) => ({ ...prev, [index]: file }));
  };

  const handleOrderDocumentFilesChange = (
    typeId: number,
    files: OrderDocumentFilesByType[number]
  ) => {
    setOrderDocumentFiles((prev) => {
      const next = { ...prev };

      if (files.length === 0) {
        delete next[typeId];
      } else {
        next[typeId] = files;
      }

      return next;
    });
  };

  const handleRemoveOrderDocumentFile = (typeId: number, fileIndex: number) => {
    setOrderDocumentFiles((prev) => {
      const currentFiles = prev[typeId] ?? [];
      const nextFiles = currentFiles.filter((_, index) => index !== fileIndex);
      const next = { ...prev };

      if (nextFiles.length === 0) {
        delete next[typeId];
      } else {
        next[typeId] = nextFiles;
      }

      return next;
    });
  };

  const handleNext = async (
    validateForm: any,
    setTouched: any,
    currentStep: number
  ) => {
    const errors = await validateForm();

    const currentSchema = getValidationSchema(currentStep - 1, !!orderId);

    if (!currentSchema) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const stepFields = Object.keys(currentSchema.fields);
    const stepErrors = Object.keys(errors).filter((key) =>
      stepFields.includes(key)
    );

    if (stepErrors.length > 0) {
      const touchedFields = stepFields.reduce((acc, field) => {
        acc[field] = errors[field]
          ? markTouchedFromErrors(errors[field])
          : true;
        return acc;
      }, {} as Record<string, any>);

      setTouched(touchedFields, true);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBoBack = () => {
    // Always go back to the previous route (client profile, orders list, etc.)
    router.back();
  };

  const validateRequiredStepsBeforeSubmit = async (
    values: any,
    setTouched: (touched: any, shouldValidate?: boolean) => void
  ) => {
    const stepsToValidate = [
      { step: 1, schema: getValidationSchema(0, !!orderId) },
      { step: 2, schema: getValidationSchema(1, !!orderId) },
    ];

    for (const stepToValidate of stepsToValidate) {
      if (!stepToValidate.schema) continue;

      try {
        await stepToValidate.schema.validate(values, { abortEarly: false });
      } catch (error: any) {
        setTouched(getTouchedFromYupError(error), true);
        setCurrentStep(stepToValidate.step);
        toast.error(error?.errors?.[0] || "Please complete required fields.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (values: any, formikHelpers: any) => {
    const isValid = await validateRequiredStepsBeforeSubmit(
      values,
      formikHelpers.setTouched
    );

    if (!isValid) return;

    const availableDocumentTypes =
      orderDocumentTypes.length > 0
        ? orderDocumentTypes
        : await fetchOrderDocumentTypes();
    const documentTypesError = useOrderDocumentTypesStore.getState().error;

    if (documentTypesError && availableDocumentTypes.length === 0) {
      toast.error("Order document types could not be loaded. Please try again.");
      setCurrentStep(3);
      return;
    }

    const documentValidationError = getOrderDocumentValidationError(
      availableDocumentTypes,
      orderDocumentFiles,
      selectedOrderDocumentTypeIds
    );

    if (documentValidationError) {
      toast.error(documentValidationError);
      setCurrentStep(3);
      return;
    }

    const orderValues = { ...values };
    delete orderValues.typeId;

    if (!orderValues.OrderEventId) delete orderValues.OrderEventId;

    // Normalize optional measurement matching fields before submit.
    const finalPayload = {
      ...orderValues,
      items: (orderValues.items || []).map((item: any) => ({
        ...item,
        orderItemDetails: (item.orderItemDetails || []).map((d: any) => {
          return {
            ...d,
            MeasurementId: normalizeOptionalNumber(d.MeasurementId),
            ProductSubCategoryId: normalizeOptionalNumber(
              d.ProductSubCategoryId
            ),
            StyleNumber: normalizeOptionalString(d.StyleNumber),
          };
        }),
      })),
    };

    const orderIdForSubmit = orderId ? Number(orderId) : createdOrderId;
    const result = orderIdForSubmit
      ? await updateOrder(orderIdForSubmit, finalPayload, {
          showSuccessToast: false,
        })
      : await addOrder(finalPayload, { showSuccessToast: false });

    if (result) {
      const savedOrderId = orderIdForSubmit ?? Number(result.data.Id);
      if (!orderId && !createdOrderId) {
        setCreatedOrderId(savedOrderId);
      }

      const documentsToUpload = getOrderDocumentUploadItems(
        availableDocumentTypes,
        orderDocumentFiles
      );

      if (documentsToUpload.length > 0) {
        const uploaded = await uploadOrderDocuments(
          savedOrderId,
          documentsToUpload,
          { showSuccessToast: false }
        );

        if (!uploaded) {
          setCurrentStep(3);
          return;
        }
      }

      setOrderDocumentFiles({});
      setOrderDocumentRows([createEmptyDocumentRow()]);
      setSelectedOrderDocumentTypeIds([]);
      setCreatedOrderId(null);
      toast.success(
        orderIdForSubmit
          ? "Order updated successfully"
          : "Order added successfully"
      );
      handleBoBack();
    }
  };

  return (
    <>
      <div className="flex">
        <aside className="w-1/4 p-6">
          <div className="flex items-center mb-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1 dark:text-gray-400 text-gray-800"
            >
              <IoCaretBackSharp />
              <span>Back</span>
            </button>
          </div>
          <ul>
            {formSteps.map((label, index) => (
              <li
                key={index}
                onClick={() => setCurrentStep(label.id)}
                className={`flex items-center gap-4 mb-4 w-[230px] dark:bg-slate-900 bg-gray-300 p-2 rounded-lg cursor-pointer`}
              >
                <div
                  className={` ${label.id === currentStep
                      ? "dark:text-green-400 text-green-800 font-bold"
                      : "dark:text-gray-400 text-gray-800"
                    }`}
                >
                  {label.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs dark:text-gray-500 text-gray-800">
                    STEP {index + 1}
                  </span>
                  <span
                    className={` ${label.id === currentStep
                        ? "dark:text-green-400 text-green-800 font-bold"
                        : "dark:text-gray-400 text-gray-800"
                      }`}
                  >
                    {label.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex flex-col justify-center items-center w-full">
          <h1 className="text-sm font-bold text-gray-500 mb-2">
          {orderId ? "Edit Order" : "Add New Order"} 
          </h1>
          {currentStep !== 3 && (
            <h2 className="text-xl font-semibold mb-4">
              {steps[currentStep - 1]}
            </h2>
          )}
          <div className="flex flex-col dark:bg-slate-900 bg-gray-300 rounded-xl p-10">
            <Formik
              validationSchema={getValidationSchema(currentStep - 1, !!orderId)}
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, validateForm, setTouched, ...formikProps }) => (
                <Form className="flex flex-col gap-5 px-5 w-full dark:shadow-2xl shadow-lg pt-5 pb-5 rounded-lg h-fit ">
                  {renderStep(formikProps)}
                  <div className="flex items-center justify-end gap-5 mt-5">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="flex items-center justify-center text-white bg-[#dd7775] w-[80px] h-[30px] rounded-lg text-sm"
                      >
                        Back
                      </button>
                    )}

                    {currentStep < 3 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleNext(validateForm, setTouched, currentStep)
                        }
                        className="flex items-center justify-center text-white bg-[#584BDD] w-[80px] h-[30px] rounded-lg text-sm"
                      >
                        Next
                      </button>
                    )}

                    {currentStep === 3 && (
                      <button
                        type="submit"
                        disabled={isSubmitting || loadingDoc}
                        className="flex items-center justify-center gap-1 text-white bg-[#584BDD] min-w-[80px] h-[30px] rounded-lg px-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting || loadingDoc ? (
                          <Spinner size="small" />
                        ) : (
                          <></>
                        )}
                        Submit
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </main>
      </div>
    </>
  );
};

export default OrderForm;
