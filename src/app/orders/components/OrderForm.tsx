"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@heroui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { FaRegFileLines } from "react-icons/fa6";
import { IoDocumentAttach } from "react-icons/io5";
import { FaRuler } from "react-icons/fa";
import { IoCaretBackSharp } from "react-icons/io5";

import useOrderStore from "@/store/useOrderStore";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { OrderValidationSchemas } from "../../schema";
import OrderAttachments from "./OrderAttachments";
import { useFileUploadStore } from "@/store/useFileUploadStore";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";

interface FormValues {
  OrderName: string;
  OrderNumber: string;
  ClientId: string;
  OrderEventId?: string;
  Description: string;
  Deadline: string;
  OrderPriority: string;
  items: any[];
}
const steps = ["Order Details", "Order Items"];
const formSteps = [
  { id: 1, name: "Order Details", icon: <FaRegFileLines size={20} /> },
  { id: 2, name: "Order Items", icon: <FaRuler size={20} /> },
  { id: 3, name: "Order Attachments", icon: <IoDocumentAttach size={20} /> },
];
const defaultValues: FormValues = {
  OrderName: "",
  OrderNumber: "",
  ClientId: "",
  OrderEventId: "",
  Description: "",
  Deadline: "",
  OrderPriority: "",
  items: [],
};

const OrderForm = ({ orderId }: { orderId?: string }) => {
  
  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [initialValues, setInitialValues] = useState<FormValues>(defaultValues);

  const { addOrder, getOrderById, updateOrder, OrderById } = useOrderStore();
  const { uploadDocument, loadingDoc } = useDocumentCenterStore();
  const { uploadedFilesByIndex, resetAllFiles } = useFileUploadStore();

  const router = useRouter();

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
        OrderEventId: OrderById.OrderEventId ? String(OrderById.OrderEventId) : undefined,
        Description: OrderById.Description,
        Deadline: OrderById.Deadline.split("T")[0], // YYYY-MM-DD
        OrderPriority: String(OrderById.OrderPriority),
        items: OrderById.items.map(item => ({
          ...item,
          printingOptions: item.printingOptions.map(po => ({ PrintingOptionId: po.PrintingOptionId })),
          orderItemDetails: item.orderItemDetails.map(detail => ({
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
        return <Step1 formik={formikProps} />;
      case 2:
        return (
          <Step2
            formik={formikProps}
            itemFiles={itemFiles}
            onFileSelect={handleFileSelect}
          />
        );
      case 3:
        return <OrderAttachments onFileSelect={handleFileSelect} />;
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

    const currentSchema = OrderValidationSchemas[currentStep - 1];

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
    router.push("/orders");
  };
  const handleSubmit = async (values: any) => {
    values.Description = values.ClientId + "order description";
    if (!values.OrderEventId) delete values.OrderEventId;
    
    const finalPayload = { ...values };
    // const result = await addOrder(finalPayload);
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
          refernceId
        );
      }
    }
    resetAllFiles();
    handleBoBack();
  };

  return (
    <>
      <div className="flex">
        <aside className="w-1/4 p-6">
          <div className="flex items-center mb-10">
            <Link
              href={"/orders"}
              className="flex items-center gap-1 dark:text-gray-400 text-gray-800"
            >
              <IoCaretBackSharp /> <span>Back to listing</span>
            </Link>
          </div>
          <ul>
            {formSteps.map((label, index) => (
              <li
                key={index}
                onClick={() => setCurrentStep(label.id)}
                className={`flex items-center gap-4 mb-4 w-[230px] dark:bg-slate-900 bg-gray-300 p-2 rounded-lg cursor-pointer`}
              >
                <div
                  className={` ${
                    label.id === currentStep
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
                    className={` ${
                      label.id === currentStep
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
            Add New Order
          </h1>
          <h2 className="text-xl font-semibold mb-4">
            {steps[currentStep - 1]}
          </h2>
          <div className="flex flex-col dark:bg-slate-900 bg-gray-300 rounded-xl p-10">
            <Formik
              validationSchema={OrderValidationSchemas[currentStep - 1]}
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
                        disabled={isSubmitting}
                        className="flex items-center justify-center text-white bg-[#584BDD] w-[80px] h-[30px] rounded-lg text-sm"
                      >
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
