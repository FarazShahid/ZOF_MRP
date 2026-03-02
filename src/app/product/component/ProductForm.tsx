"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Form, Formik } from "formik";
import { IoCaretBackSharp } from "react-icons/io5";
import { FaRegFileLines } from "react-icons/fa6";
import { FaRuler } from "react-icons/fa";
import { GrDocumentImage } from "react-icons/gr";
import { Check, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { ProductValidationSchemas } from "../../schema";
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
  { id: 3, name: "Description & QA Checklist", icon: <GrDocumentImage size={20} /> },
];

const ProductForm = ({
  productId,
  clientIdFromQuery,
}: {
  productId?: string;
  clientIdFromQuery?: string | null;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});
  const [qaItems, setQaItems] = useState<QAItem[]>([]);

  const { addProduct, updateProduct, getProductById, productById } =
    useProductStore();
  const { uploadDocument, loadingDoc } = useDocumentCenterStore();
  const { uploadedFilesByIndex, resetAllFiles } = useFileUploadStore();

  const router = useRouter();
  const clientId = clientIdFromQuery ?? null;
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
    ClientId: clientId ?? "",
    ProjectId: "",
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
        ProjectId: productById.ProjectId ? String(productById.ProjectId) : "",
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
          <>
            <Step3
              formik={formikProps}
              handleFileSelect={handleFileSelect}
              productId={productId}
            />
            <QAChecklistClickUp
              heading="QA Checklist"
              initialItems={initialQAItems}
              onChange={handleCheckList}
            />
          </>
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
    if (clientId) {
      router.push(`/client/${clientId}`);
    } else {
      router.push("/product");
    }
  };

  const handleSubmit = async (values: any) => {
    const files = uploadedFilesByIndex[1] || [];
    const payload = { ...values };

    // Remove ProjectId from payload if it is not selected
    if (!payload.ProjectId) {
      delete payload.ProjectId;
    }

    // Attach qaChecklist if user added anything
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
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link
            href={clientId ? `/client/${clientId}` : "/product"}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <IoCaretBackSharp className="w-4 h-4" />
            {clientId ? "Back to client" : "Products"}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white">
            {productId ? "Edit Product" : "Create Product"}
          </span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {productId ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-slate-400 text-sm">
              Complete the wizard to add a new product
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto flex-wrap gap-4">
            {formSteps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-3 cursor-pointer transition-all ${
                      step.id < currentStep
                        ? "opacity-100"
                        : step.id === currentStep
                        ? "opacity-100"
                        : "opacity-40"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all shrink-0 ${
                        step.id < currentStep
                          ? "bg-green-600 text-white"
                          : step.id === currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="text-left">
                      <div
                        className={`text-sm font-semibold ${
                          step.id <= currentStep ? "text-white" : "text-slate-500"
                        }`}
                      >
                        Step {step.id}
                      </div>
                      <div
                        className={`text-xs ${
                          step.id <= currentStep
                            ? "text-slate-400"
                            : "text-slate-600"
                        }`}
                      >
                        {step.name}
                      </div>
                    </div>
                  </button>
                </div>
                {idx < formSteps.length - 1 && (
                  <div className="w-12 lg:w-16 mx-2 shrink-0">
                    <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          step.id < currentStep
                            ? "bg-green-500"
                            : "bg-slate-700"
                        }`}
                        style={{
                          width: step.id < currentStep ? "100%" : "0%",
                        }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <Formik
              key={isEdit ? `edit-${productId}` : "create"}
              validationSchema={ProductValidationSchemas[currentStep - 1]}
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, validateForm, setTouched, ...formikProps }) => (
                <>
                  <Form
                    id="product-form"
                    className="flex flex-col gap-5 p-6 lg:p-10"
                  >
                    {renderStep(formikProps)}
                  </Form>

                  {/* Bottom Action Bar */}
                  <div className="border-t border-slate-800 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        {currentStep > 1 ? (
                          <button
                            type="button"
                            onClick={() => setCurrentStep((prev) => prev - 1)}
                            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap border border-slate-700 inline-flex items-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                          </button>
                        ) : (
                          <Link
                            href={clientId ? `/client/${clientId}` : "/product"}
                            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap border border-slate-700 inline-flex items-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Cancel
                          </Link>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {currentStep < 3 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleNext(validateForm, setTouched, currentStep)
                            }
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap inline-flex items-center gap-2"
                          >
                            Next Step
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}

                        {currentStep === 3 && (
                          <button
                            type="submit"
                            form="product-form"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap inline-flex items-center gap-2 disabled:opacity-70"
                          >
                            {isSubmitting ? (
                              <Spinner size="sm" className="text-white" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            Submit Product
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
  );
};

export default ProductForm;
