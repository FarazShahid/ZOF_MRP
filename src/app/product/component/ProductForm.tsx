"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Form, Formik } from "formik";
import { IoCaretBackSharp } from "react-icons/io5";
import { FaRegFileLines } from "react-icons/fa6";
import { FaRuler } from "react-icons/fa";
import { GrDocumentImage } from "react-icons/gr";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { ProductValidationSchemas } from "../../schema";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";

const steps = ["General Information", "Product Details", "Description"];

const formSteps = [
  { id: 1, name: "General Information", icon: <FaRegFileLines size={20} /> },
  { id: 2, name: "Product Details", icon: <FaRuler size={20} /> },
  { id: 3, name: "Description", icon: <GrDocumentImage size={20} /> },
];

const ProductForm = () => {
  
  const [currentStep, setCurrentStep] = useState(1);

  const initialValues = {
    ProductCategoryId: "",
    FabricTypeId: "",
    Description: "",

    productColors: [
      {
        Id: 0,
        colorId: 0,
        ImageId: "1",
      },
    ],
    productDetails: [
      {
        ProductCutOptionId: 0,
        ProductSizeMeasurementId: 0,
        SleeveTypeId: 1,
      },
    ],
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
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

    const currentSchema = ProductValidationSchemas[currentStep - 1];

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


  const handleSubmit = async (values: any) => {
    console.log("values", values);
   
  };

  return (
    <AdminDashboardLayout>
      <div className="flex">
        <aside className="w-1/4 p-6">
          <div className="flex items-center mb-10">
            <Link
              href={"/product"}
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
                  className={` ${
                    label.id === currentStep
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
                    className={` ${
                      label.id === currentStep
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
            Add New Product
          </h1>
          <h2 className="text-xl font-semibold mb-4">{steps[currentStep - 1]}</h2>
          <div className="flex flex-col bg-gray-900 rounded-xl p-10">
            {/* <Formik
              initialValues={initialValues}
              validationSchema={ProductValidationSchemas[step]}
              onSubmit={(values, actions) => {
                if (step === steps.length - 1) {
                  console.log("Final submit", values);
                } else {
                  setStep(step + 1);
                }
              }}
            >
              {(formik, validateForm, setTouched) => (
                <Form>
                  {renderStep(formik)}
                  <div className="mt-6 flex justify-end gap-4">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="px-4 py-2 bg-gray-600 rounded"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 rounded disabled:opacity-50"
                      disabled={!formik.isValid}
                    >
                      {step === steps.length - 1 ? "Save" : "Next"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik> */}
            <Formik
              validationSchema={ProductValidationSchemas[currentStep - 1]}
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, validateForm, setTouched }) => (
                <Form className="flex flex-col gap-5 px-5 w-full dark:border-1 dark:border-gray-800  shadow-2xl pt-5 pb-5 rounded-lg h-fit ">
                  {renderStep()}
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
    </AdminDashboardLayout>
  );
};

export default ProductForm;
