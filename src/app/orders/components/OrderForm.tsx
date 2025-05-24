"use client";

import React, { useState } from "react";
import { FaRegFileLines } from "react-icons/fa6";
import { FaRuler } from "react-icons/fa";
import GoBackButton from "../../components/common/GoBackButton";
import { Form, Formik } from "formik";
import { OrderValidationSchemas } from "../../schema";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { Link, Spinner } from "@heroui/react";
import { IoCaretBackSharp } from "react-icons/io5";
import { useFileUploadStore } from "@/store/useFileUploadStore";
import { useRouter } from "next/navigation";
import useOrderStore from "@/store/useOrderStore";


const steps = ["Order Details", "Order Items",];
const formSteps = [
  { id: 1, name: "Order Details", icon: <FaRegFileLines size={20} /> },
  { id: 2, name: "Order Items", icon: <FaRuler size={20} /> },
];

const OrderForm = () => {
  const {uploadedFiles} = useFileUploadStore();
  const [currentStep, setCurrentStep] = useState(1);
  const {addOrder} = useOrderStore();

  const router = useRouter();

  const initialValues = {
    ClientId: "",
    OrderEventId: "",
    Description: "",
    Deadline: "",
    OrderPriority: "",

    items: [],
  };

const renderStep = (formikProps: any) => {
    switch (currentStep) {
      case 1:
        return <Step1 formik={formikProps} />;
      case 2:
        return <Step2 formik={formikProps} />;
      default:
        return null;
    }
  };

  const handleNext = async (
    validateForm: any,
    setTouched: any,
    currentStep: number
  ) => {
    const errors = await validateForm();

    const currentSchema = OrderValidationSchemas[currentStep - 1];

    if (!currentSchema) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    const stepFields = Object.keys(currentSchema.fields);
    const stepErrors = Object.keys(errors).filter(key =>
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
    router.push('/orders')
  }
  const handleSubmit = async (values: any) => {
    values.Description = values.ClientId + "order description";
    console.log("values", values);
    console.log("uploadedfile", uploadedFiles);
    await addOrder(values, () => handleBoBack())
  };

  return (
    <>
      <div className="flex">
        <aside className="w-1/4 p-6">
          <div className="flex items-center mb-10">
            <Link
              href={"/orders"}
              className="flex items-center gap-1 text-gray-400 hover:text-white"
            >
              <IoCaretBackSharp /> <span>Back to listing</span>
            </Link>
          </div>
          <ul>
            {formSteps.map((label, index) => (
              <li
                key={index}
                onClick={() => setCurrentStep(label.id)}
                className={`flex items-center gap-4 mb-4 w-[230px] bg-gray-900 p-2 rounded-lg cursor-pointer`}
              >
                <div
                  className={` ${label.id === currentStep
                      ? "text-green-400 font-bold"
                      : "text-gray-400"
                    }`}
                >
                  {label.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">
                    STEP {index + 1}
                  </span>
                  <span
                    className={` ${label.id === currentStep
                        ? "text-green-400 font-bold"
                        : "text-gray-400"
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
          <h2 className="text-xl font-semibold mb-4">{steps[currentStep - 1]}</h2>
          <div className="flex flex-col bg-gray-900 rounded-xl p-10">
            <Formik
              validationSchema={OrderValidationSchemas[currentStep - 1]}
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, validateForm, setTouched, ...formikProps }) => (
                <Form className="flex flex-col gap-5 px-5 w-full dark:border-1 dark:border-gray-800  shadow-2xl pt-5 pb-5 rounded-lg h-fit ">
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

                    {currentStep < 2 && (
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

                    {currentStep === 2 && (
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
