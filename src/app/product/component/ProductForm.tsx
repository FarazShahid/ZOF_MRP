"use client";

import React, { useState } from "react";
import { IoCaretBackSharp } from "react-icons/io5";
import { FaRegFileLines } from "react-icons/fa6";
import { FaRuler } from "react-icons/fa";
import { GrDocumentImage } from "react-icons/gr";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import Step1 from "./Step1";
import { Form, Formik } from "formik";
import { ProductValidationSchemas } from "../../schema";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Link from "next/link";

const steps = [
  "General Information",
  "Product Details",
  "Documents",
];

const formSteps = [
  { id: 1, name: "General Information", icon: <FaRegFileLines size={20} /> },
  { id: 2, name: "Product Details", icon: <FaRuler size={20} /> },
  { id: 3, name: "Documents", icon: <GrDocumentImage size={20} /> },
];

const ProductForm = () => {
  const [step, setStep] = useState(0);

  const initialValues = {
    ProductCategoryId: 0,
    FabricTypeId: 0,
    Description:"",

    productColors: [
      {
        Id: 0,
        colorId: 0,
        ImageId: "1"
      }
    ],
    productDetails: [
      {
        ProductCutOptionId: 0,
        ProductSizeMeasurementId: 0,
        SleeveTypeId: 1,
      }
    ]
  };

  const renderStep = (formik: any) => {
    switch (step) {
      case 0:
        return <Step1 formik={formik} />;
      case 1:
        return <Step2 formik={formik} />;
      case 2:
            return <Step3 formik={formik} />;
      default:
        return null;
    }
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
                onClick={() => setStep(index)}
                className={`flex items-center gap-4 mb-4 w-[230px] bg-gray-900 p-2 rounded-lg cursor-pointer`}
              >
                <div
                  className={` ${
                    index === step
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
                      index === step
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
            <h1 className="text-sm font-bold text-gray-500 mb-2">Add New Product</h1>
            <h2 className="text-xl font-semibold mb-4">{steps[step]}</h2>
          <div className="flex flex-col bg-gray-900 rounded-xl p-10">
            <Formik
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
              {(formik) => (
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
            </Formik>
          </div>
        </main>
      </div>
    </AdminDashboardLayout>
  );
};

export default ProductForm;
