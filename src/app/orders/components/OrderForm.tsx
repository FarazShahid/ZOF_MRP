"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Form, Formik } from "formik";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import useOrderStore from "@/store/useOrderStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { OrderValidationSchemas } from "../../schema";
import { useFileUploadStore } from "@/store/useFileUploadStore";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { FormValues, steps } from "@/src/types/order";
import * as Yup from "yup";

// lazy load
const Step1 = dynamic(() => import("./Step1"), { loading: () => null });
const Step2 = dynamic(() => import("./Step2"), { loading: () => null });
const OrderAttachments = dynamic(() => import("./OrderAttachments"), { loading: () => null });

const formSteps = [
  { num: 1, label: "Order Details", icon: "ri-file-list-3-line" },
  { num: 2, label: "Order Items", icon: "ri-shopping-cart-2-line" },
  { num: 3, label: "Order Attachments", icon: "ri-checkbox-circle-line" },
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
  typeId: "",
  
};

const OrderForm = ({ orderId }: { orderId?: string }) => {
  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();
  const clientIdFromQuery = searchParams.get("clientId");
  const eventIdFromQuery = searchParams.get("eventId");

  const [initialValues, setInitialValues] = useState<FormValues>(() => {
    const base = { ...defaultValues };
    if (clientIdFromQuery) base.ClientId = clientIdFromQuery;
    if (eventIdFromQuery) base.OrderEventId = eventIdFromQuery;
    return base;
  });

  const { addOrder, getOrderById, updateOrder, OrderById } = useOrderStore();
  const { uploadDocument } = useDocumentCenterStore();
  const { uploadedFilesByIndex, resetAllFiles } = useFileUploadStore();

  const router = useRouter();

  // Get validation schema based on step and edit mode
  const getValidationSchema = (step: number, isEdit: boolean) => {
    if (step === 0) {
      // Step 1 validation
      const step1Schema: any = {
        OrderName: Yup.string().required("Order Name is required"),
        ClientId: Yup.string().required("Client is required"),
        Deadline: Yup.string().required("Deadline is required"),
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
            onFileSelect={handleFileSelect}
          />
        );
      default:
        return null;
    }
  };

  const handleFileSelect = (file: File, index: number) => {
    setItemFiles((prev) => ({ ...prev, [index]: file }));
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
        acc[field] = true;
        return acc;
      }, {} as Record<string, boolean>);

      setTouched(touchedFields, true);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBoBack = () => {
    // Always go back to the previous route (client profile, orders list, etc.)
    router.back();
  };

  const handleSubmit = async (values: any) => {
  
    if (!values.OrderEventId) delete values.OrderEventId;

    // Normalize payload and remove MeasurementId
    const finalPayload = {
      ...values,
      items: (values.items || []).map((item: any) => ({
        ...item,
        orderItemDetails: (item.orderItemDetails || []).map((d: any) => {
          const normalized: any = {
            ...d,
          };
          // Remove MeasurementId from payload
          delete normalized.MeasurementId;
          return normalized;
        }),
      })),
    };

    const result = orderId
      ? await updateOrder(Number(orderId), finalPayload)
      : await addOrder(finalPayload);

    // handle attachments
    const files = uploadedFilesByIndex[1] || [];
    if (result && files.length > 0) {
      const refernceId = Number(result.data.Id);

      for (const fileObj of files) {
        await uploadDocument(
          fileObj.file,
          DOCUMENT_REFERENCE_TYPE.ORDER,
          refernceId,
          undefined,
          values?.typeId ? Number(values.typeId) : undefined
        );
      }
    }
    resetAllFiles();
    if (result) {
      handleBoBack();
    }
  };

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <button
          type="button"
          onClick={() => router.push("/orders")}
          className="text-slate-400 hover:text-green-400 transition-colors cursor-pointer"
        >
          Orders
        </button>
        <i className="ri-arrow-right-s-line text-slate-600 w-4 h-4 flex items-center justify-center" />
        <span className="text-white font-medium">{orderId ? "Edit Order" : "Create Order"}</span>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-6 py-4 rounded-lg mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/orders"
              className="group p-2 hover:px-4 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-lg transition-all duration-300 ease-in-out"
            >
              <ArrowLeft className="w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all duration-300 ease-in-out" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {orderId ? "Edit Order" : "Create New Order"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                {orderId ? "Update the order details below" : "Complete the wizard to submit a new production order"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800/60 p-5 mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {formSteps.map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num);
                }}
                className={`flex items-center gap-3 cursor-pointer transition-all ${
                  step.num < currentStep ? "opacity-100" : step.num === currentStep ? "opacity-100" : "opacity-40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    step.num < currentStep
                      ? "bg-green-600 text-white shadow-sm shadow-green-500/20"
                      : step.num === currentStep
                      ? "bg-green-600 text-white shadow-sm shadow-green-500/20"
                      : "bg-slate-800/70 text-slate-500 border border-slate-700/60"
                  }`}
                >
                  {step.num < currentStep ? (
                    <i className="ri-check-line w-5 h-5 flex items-center justify-center" />
                  ) : (
                    step.num
                  )}
                </div>
                <div className="text-left">
                  <div
                    className={`text-sm font-semibold ${
                      step.num <= currentStep ? "text-white" : "text-slate-500"
                    }`}
                  >
                    Step {step.num}
                  </div>
                  <div
                    className={`text-xs ${
                      step.num <= currentStep ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              </button>

              {idx < formSteps.length - 1 && (
                <div className="w-24 mx-4">
                  <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        step.num < currentStep ? "bg-green-500" : "bg-slate-700"
                      }`}
                      style={{ width: step.num < currentStep ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content + Bottom Action Bar - single Formik */}
      <div className="max-w-4xl">
        <Formik
          validationSchema={getValidationSchema(currentStep - 1, !!orderId)}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, validateForm, setTouched, submitForm, ...formikProps }) => (
            <>
              <Form id="order-form" className="flex flex-col gap-5 w-full">
                {renderStep(formikProps)}
              </Form>

              {/* Bottom Action Bar */}
              <div className="mt-8">
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800/60 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStep((prev) => prev - 1)}
                          className="px-6 py-2.5 bg-slate-800/70 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap border border-slate-700/60 hover:border-slate-600 inline-flex items-center"
                        >
                          <i className="ri-arrow-left-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                          Back
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => router.push("/orders")}
                          className="px-6 py-2.5 bg-slate-800/70 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap border border-slate-700/60 hover:border-slate-600 inline-flex items-center"
                        >
                          <i className="ri-close-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                          Cancel
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={() => handleNext(validateForm, setTouched, currentStep)}
                          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap inline-flex items-center shadow-sm shadow-green-500/20"
                        >
                          Next Step
                          <i className="ri-arrow-right-line ml-2 w-4 h-4 inline-flex items-center justify-center" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => submitForm()}
                          disabled={isSubmitting}
                          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer whitespace-nowrap inline-flex items-center shadow-sm shadow-green-500/20"
                        >
                          <i className="ri-check-double-line mr-2 w-4 h-4 inline-flex items-center justify-center" />
                          {orderId ? "Update Order" : "Create Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default OrderForm;
