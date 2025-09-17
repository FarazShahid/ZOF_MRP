"use client";

import React, { useEffect, useState } from "react";
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
import useProductStore from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { useFileUploadStore } from "@/store/useFileUploadStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import QAChecklistClickUp from "../../components/product/QAChecklistClickUp";
import { QAItem } from "@/src/types/product";


const steps = ["General Information", "Product Details", "Description"];

const formSteps = [
  { id: 1, name: "General Information", icon: <FaRegFileLines size={20} /> },
  { id: 2, name: "Product Details", icon: <FaRuler size={20} /> },
  { id: 3, name: "Description", icon: <GrDocumentImage size={20} /> },
  { id: 4, name: "QA Checklist", icon: <GrDocumentImage size={20} /> },
];

const ProductForm = ({ productId }: { productId?: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});
  const [qaItems, setQaItems] = useState<QAItem[]>([]);

  const { addProduct, updateProduct, getProductById, productById } =
    useProductStore();
  const { uploadDocument, loadingDoc } = useDocumentCenterStore();
  const { uploadedFilesByIndex, resetAllFiles } = useFileUploadStore();

  const router = useRouter();
  const isEdit = !!productId;

    // Build initial QA items from productById.qaChecklist
  const initialQAItems = React.useMemo<QAItem[]>(() => {
    const src = productById?.qaChecklist ?? [];
    return src.map((q: any) => ({
      id: String(q.id),
      title: q.name ?? "",
      done: false, // default (you can change if you later store completion state)
    }));
  }, [productById?.qaChecklist]);

  const defaultDetailsRow = {
    ProductCutOptionId: "",
    ProductSizeMeasurementId: "",
    SleeveTypeId: "",
  };

  const defaultValues = {
    Name: "",
    ClientId: "",
    ProductCategoryId: "",
    FabricTypeId: "",
    Description: "",
    productColors: [{ Id: 0, colorId: 0, ImageId: "1" }],
    printingOptions: [{ PrintingOptionId: 0 }],
    productDetails: [defaultDetailsRow],
    productSizes: [{ sizeId: 0 }],
    productStatus: "",
  };

  // Only use productById when editing and it exists
  const initialValues = React.useMemo(() => {
    if (isEdit && productById) {
      const mappedDetails =
        Array.isArray(productById.productDetails) &&
        productById.productDetails.length > 0
          ? productById.productDetails.map((d: any) => ({
              ProductCutOptionId: d.ProductCutOptionId ?? "",
              ProductSizeMeasurementId: d.ProductSizeMeasurementId ?? "",
              SleeveTypeId: d.SleeveTypeId ?? "",
            }))
          : [defaultDetailsRow];
      return {
        Name: productById.Name ?? "",
        ClientId: productById.ClientId ?? "",
        ProductCategoryId: productById.ProductCategoryId ?? "",
        FabricTypeId: productById.FabricTypeId ?? "",
        Description: productById.Description ?? "",
        productColors: productById.productColors ?? [
          { Id: 0, colorId: 0, ImageId: "1" },
        ],
        printingOptions: productById.printingOptions ?? [
          { PrintingOptionId: 0 },
        ],
        productDetails: mappedDetails,
        productSizes: productById.productSizes?.map((s: any) => ({
          Id: s.Id,
          sizeId: s.sizeId,
        })) ?? [{ sizeId: 0 }],
        productStatus: productById.productStatus ?? "",
      };
    }
    // Add mode → ignore any stale productById in the store
    return defaultValues;
  }, [isEdit, productById]);

  const handleFileSelect = (file: File, index: number) => {
    setItemFiles((prev) => ({ ...prev, [index]: file }));
  };

  const handleCheckList = (items: QAItem[]) => {
    setQaItems(items);
  };

  const renderStep = (formikProps: any) => {
    switch (currentStep) {
      case 1:
        return <Step1 formik={formikProps} />;
      case 2:
        return <Step2 formik={formikProps} />;
      case 3:
        return (
          <Step3
            formik={formikProps}
            handleFileSelect={handleFileSelect}
            productId={productId}
          />
        );
      case 4:
        return (
          <QAChecklistClickUp
            heading="QA Checklist"
            initialItems={initialQAItems}  
            onChange={handleCheckList}
          />
        );
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
    router.push("/product");
  };

  const handleSubmit = async (values: any) => {
    const files = uploadedFilesByIndex[1] || [];
    const payload = { ...values };

    // + NEW: attach qaChecklist if user added anything
    const qaChecklist = qaItems.map((i) => ({ name: i.title }));
    if (qaChecklist.length > 0) {
      payload.qaChecklist = qaChecklist;
    }

    payload.productColors = payload.productColors?.filter(
      (color: { Id: number; colorId: number; ImageId: string }) =>
        !(color.Id === 0 && color.colorId === 0 && color.ImageId === "1")
    );

    payload.productSizes = payload.productSizes?.filter(
      (size: { sizeId: number }) => size.sizeId !== 0
    );

    payload.printingOptions = payload.printingOptions?.filter(
      (option: { PrintingOptionId: number }) => option.PrintingOptionId !== 0
    );

    payload.productDetails = (payload.productDetails ?? [])
      .map((pd: any) => {
        const detail: Partial<{
          ProductCutOptionId: number;
          ProductSizeMeasurementId: number;
          SleeveTypeId: number;
        }> = {};

        if (pd.ProductCutOptionId && pd.ProductCutOptionId !== "")
          detail.ProductCutOptionId = pd.ProductCutOptionId;
        if (pd.ProductSizeMeasurementId && pd.ProductSizeMeasurementId !== "")
          detail.ProductSizeMeasurementId = pd.ProductSizeMeasurementId;
        if (pd.SleeveTypeId && pd.SleeveTypeId !== "")
          detail.SleeveTypeId = pd.SleeveTypeId;
        return detail;
      })
      .filter((detail: any) => Object.keys(detail).length > 0);

    const isDefaultProductColors =
      payload.productColors?.length === 1 &&
      payload.productColors[0].Id === 0 &&
      payload.productColors[0].colorId === 0 &&
      payload.productColors[0].ImageId === "1";

    if (isDefaultProductColors) {
      delete payload.productColors;
    }

    if (productId) {
      const result = await updateProduct(Number(productId), payload, () =>
        handleBoBack()
      );
      if (result && files.length > 0) {
        const refernceId = Number(result.data.Id);

        for (const fileObj of files) {
          await uploadDocument(
            fileObj.file,
            DOCUMENT_REFERENCE_TYPE.PRODUCT,
            refernceId
          );
        }
      }
    } else {
      const result = await addProduct(payload);
      if (result && files.length > 0) {
        const refernceId = Number(result.data.Id);

        for (const fileObj of files) {
          await uploadDocument(
            fileObj.file,
            DOCUMENT_REFERENCE_TYPE.PRODUCT,
            refernceId
          );
        }
      }
    }
  
    resetAllFiles();
    handleBoBack();
  };

  useEffect(() => {
    if (productId) {
      getProductById(Number(productId));
    }
  }, [productId]);

  return (
    <AdminDashboardLayout>
      <div className="flex">
        <aside className="w-1/4 p-6">
          <div className="flex items-center mb-10">
            <Link
              href={"/product"}
              className="flex items-center gap-1 dark:text-gray-400 text-gray-800"
            >
              <IoCaretBackSharp /> <span>Back to listing</span>
            </Link>
          </div>
          <ul>
            {formSteps?.map((label, index) => (
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
            Add New Product
          </h1>
          <h2 className="text-xl font-semibold mb-4">
            {steps[currentStep - 1]}
          </h2>
          <div className="flex flex-col dark:bg-slate-900 bg-gray-300 rounded-xl p-10">
            <Formik
              key={isEdit ? `edit-${productId}` : "create"}
              validationSchema={ProductValidationSchemas[currentStep - 1]}
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

                    {currentStep < 4 && (
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

                    {currentStep === 4 && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-1 text-white bg-[#584BDD] min-w-[80px] h-[30px] rounded-lg text-sm"
                      >
                        {isSubmitting ? <Spinner size="sm" /> : <></>}
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
