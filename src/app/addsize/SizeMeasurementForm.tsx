"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoCaretBackOutline } from "react-icons/io5";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FieldInputProps,
  FormikProps,
} from "formik";
import { SizeMeasurementSchema } from "../schema/SizeMeasurementSchema";
import useSizeMeasurementsStore, {
  AddSizeMeasurementType,
} from "@/store/useSizeMeasurementsStore";
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import useClientStore from "@/store/useClientStore";
import Label from "../components/common/Label";
import TopUnit from "./TopUnit";
import BottomUnit from "./BottomUnit";
import useCategoryStore from "@/store/useCategoryStore";
import LogoMeasurement from "./LogoMeasurement";
import {
  defaultMeasurementValues,
  UnitType,
} from "@/interface/MeasurementInitialvalues";
import RenderPinComponent from "../components/RenderPinComponent";
import UnitTypeToggle from "./UnitTypeToggle";

const SizeMeasurementForm = ({
  isEdit,
  sizeId,
}: {
  isEdit: boolean;
  sizeId?: number;
}) => {
  const [selectedUnitType, setSelectedUnitType] = useState<number>(0);
  const [showMeasurementPin, setShowMeasurementPin] = useState<boolean>(false);
  const [measurementManagement, setMeasurementManagement] = useState<{
    IsTopUnit: boolean;
    IsBottomUnit: boolean;
    SupportsLogo: boolean;
  }>({
    IsTopUnit: false,
    IsBottomUnit: false,
    SupportsLogo: false,
  });

  const router = useRouter();

  const { fetchsizeOptions, sizeOptions } = useSizeOptionsStore();
  const { fetchClients, clients } = useClientStore();
  const {
    addSizeMeasurement,
    updateMeasurement,
    getSizeMeasurementById,
    sizeMeasurementById,
  } = useSizeMeasurementsStore();
  const { fetchCategories, productCategories } = useCategoryStore();

  useEffect(() => {
    if (sizeId && isEdit) {
      getSizeMeasurementById(sizeId);
    }
  }, [sizeId, isEdit]);

  useEffect(() => {
    fetchsizeOptions();
    fetchClients();
    fetchCategories();
  }, []);

  useEffect(() => {

    if (isEdit) {
      const matchedCategory = productCategories.find(
        (cat) => cat.id === sizeMeasurementById?.ProductCategoryId
      );

      if (matchedCategory) {
        setMeasurementManagement({
          IsTopUnit: matchedCategory.IsTopUnit,
          IsBottomUnit: matchedCategory.IsBottomUnit,
          SupportsLogo: matchedCategory.SupportsLogo,
        });

        setShowMeasurementPin(true);

        if (matchedCategory.IsTopUnit) {
          setSelectedUnitType(UnitType.Top);
        } else if (matchedCategory.IsBottomUnit) {
          setSelectedUnitType(UnitType.Bottom);
        } else if (matchedCategory.SupportsLogo) {
          setSelectedUnitType(UnitType.Logo);
        }
      }
    }
  }, [sizeMeasurementById]);

  const closeAddModal = () => {
    router.replace("/product/productdefination");
  };

  const getInitialValues = () => {
    if (isEdit && sizeMeasurementById) {
      return {
        ...defaultMeasurementValues,
        ...sizeMeasurementById,
      };
    }
    return defaultMeasurementValues;
  };

  const InitialValues = getInitialValues();

  const handleAddSizeOption = async (values: AddSizeMeasurementType) => {
    if (sizeId && isEdit) {
      updateMeasurement(sizeId, values, () => closeAddModal());
    } else {
      addSizeMeasurement(values, () => closeAddModal());
    }
  };

  return (
    <Formik
      initialValues={InitialValues}
      validationSchema={SizeMeasurementSchema}
      enableReinitialize
      onSubmit={handleAddSizeOption}
    >
      {({ values, isSubmitting }) => (
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-8">
            <Form>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => closeAddModal()}
                  className="flex items-center gap-2 w-fit text-2xl font-semibold"
                >
                  <IoCaretBackOutline />
                  {isEdit ? "Update Measurement" : "Add Measurement"}
                </button>

                <div className="grid grid-cols-4 gap-3">
                  {/* Measurement1 (Name) */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label isRequired label="Name" labelForm="Name" />
                    <Field
                      name="Measurement1"
                      type="text"
                      placeholder="Enter Name"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="Measurement1"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Product Category */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Product Category"
                      labelForm="Product Category"
                    />
                    <Field name="ProductCategoryId">
                      {({
                        field,
                        form,
                      }: {
                        field: FieldInputProps<any>;
                        form: FormikProps<any>;
                      }) => (
                        <select
                          {...field}
                          className="formInputdefault border-1"
                          onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            form.setFieldValue("ProductCategoryId", selectedId);

                            const matchedCategory = productCategories.find(
                              (cat) => cat.id === selectedId
                            );

                            if (matchedCategory) {
                              setMeasurementManagement({
                                IsTopUnit: matchedCategory.IsTopUnit,
                                IsBottomUnit: matchedCategory.IsBottomUnit,
                                SupportsLogo: matchedCategory.SupportsLogo,
                              });

                              setShowMeasurementPin(true);

                              if (matchedCategory.IsTopUnit) {
                                setSelectedUnitType(UnitType.Top);
                              } else if (matchedCategory.IsBottomUnit) {
                                setSelectedUnitType(UnitType.Bottom);
                              } else if (matchedCategory.SupportsLogo) {
                                setSelectedUnitType(UnitType.Logo);
                              }
                            } else {
                              setShowMeasurementPin(false);
                              setMeasurementManagement(measurementManagement);
                              setSelectedUnitType(UnitType.None);
                            }
                          }}
                        >
                          <option value="">Select a Product Category</option>
                          {productCategories?.map((category, idx) => (
                            <option value={category.id} key={idx}>
                              {category.type}
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>

                    <ErrorMessage
                      name="ProductCategoryId"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Client Select */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label isRequired label="Client" labelForm="Client" />
                    <Field
                      name="ClientId"
                      as="select"
                      className="formInputdefault border-1"
                    >
                      <option value="">Select a Client</option>
                      {clients?.map((client, idx) => (
                        <option value={client.Id} key={idx}>
                          {client.Name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="ClientId"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Size Option */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Size Option"
                      labelForm="Size Option"
                    />
                    <Field
                      name="SizeOptionId"
                      as="select"
                      className="formInputdefault border-1"
                    >
                      <option value="">Select an option</option>
                      {sizeOptions.map((size) => (
                        <option value={size.Id} key={size.Id}>
                          {size.OptionSizeOptions}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="SizeOptionId"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>
                </div>

                <UnitTypeToggle
                  selectedUnitType={selectedUnitType}
                  setSelectedUnitType={setSelectedUnitType}
                  measurementManagement={measurementManagement}
                />

                {selectedUnitType === 1 && <TopUnit />}
                {selectedUnitType === 2 && <BottomUnit />}
                {selectedUnitType === 3 && (
                  <LogoMeasurement
                    IsTopUnit={measurementManagement.IsTopUnit}
                    IsBottomUnit={measurementManagement.IsBottomUnit}
                  />
                )}

                {/* Submit Button */}
                <div className="flex justify-end w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {isEdit ? "Update Measurement" : "Add Measurement"}
                  </button>
                </div>
              </div>
            </Form>
          </div>

          {showMeasurementPin && (
            <RenderPinComponent
              categoryId={
                sizeMeasurementById?.ProductCategoryId ??
                values.ProductCategoryId
              }
              values={values}
            />
          )}
        </div>
      )}
    </Formik>
  );
};

export default SizeMeasurementForm;
