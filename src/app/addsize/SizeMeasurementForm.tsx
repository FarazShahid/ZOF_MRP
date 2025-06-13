"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoCaretBackOutline } from "react-icons/io5";
import HumanBody from "../../../public/humanBody.png";
import ModalImage from "../../../public/modal.svg";
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
import MeasurementPin from "./MeasurementPin";
import { pinConfigs } from "@/lib/pinConfigs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopUnit from "./TopUnit";
import BottomUnit from "./BottomUnit";
import useCategoryStore from "@/store/useCategoryStore";
import ShirtAndShortsModal from "@/public/svgs/ShirtAndShortsModal";

const PRODUCTCATERGORYENUM = [
  { id: 1, name: "Jersey", unitType: "Top" },
  { id: 2, name: "Hoodies", unitType: "Top" },
  { id: 3, name: "Sweatshirts", unitType: "Top" },
  { id: 4, name: "Tracksuits", unitType: "Both" },
  { id: 5, name: "Shorts", unitType: "Bottom" },
  { id: 6, name: "Trousers", unitType: "Bottom" },
  { id: 7, name: "Puffer Jackets", unitType: "Top" },
  { id: 9, name: "Polos", unitType: "Top" },
  { id: 10, name: "Scrubs", unitType: "Both" },
  { id: 11, name: "Doctor Long Coats", unitType: "Top" },
];

const SizeMeasurementForm = ({
  isEdit,
  sizeId,
}: {
  isEdit: boolean;
  sizeId?: number;
}) => {
  const router = useRouter();
  const [unitType, setUnitType] = useState<"Top" | "Bottom" | "Both" | null>(
    null
  );
  const [selectedUnitType, setSelectedUnitType] = useState(1);
  const [showMeasurementPin, setShowMeasurementPin] = useState(false);

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
    const matchedCategory = PRODUCTCATERGORYENUM.find(
      (cat) => cat.id === sizeMeasurementById?.ProductCategoryId
    );
    if (matchedCategory) {
      setShowMeasurementPin(true);
      const matchedUnitType = matchedCategory.unitType as
        | "Top"
        | "Bottom"
        | "Both";
      setUnitType(matchedUnitType);
      if (matchedUnitType === "Top" || matchedUnitType === "Both") {
        setSelectedUnitType(1);
      } else if (matchedUnitType === "Bottom") {
        setSelectedUnitType(2);
      }
    } else {
      setUnitType(null);
    }
  }, [sizeMeasurementById, sizeId]);

  const closeAddModal = () => {
    router.push("/product/productdefination");
  };

  const InitialValues = {
    SizeOptionId:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SizeOptionId : 0,
    ClientId: isEdit && sizeMeasurementById ? sizeMeasurementById.ClientId : 0,
    Measurement1:
      isEdit && sizeMeasurementById ? sizeMeasurementById.Measurement1 : "",
    ProductCategoryId:
      isEdit && sizeMeasurementById
        ? sizeMeasurementById.ProductCategoryId
        : "",
    FrontLengthHPS:
      isEdit && sizeMeasurementById ? sizeMeasurementById.FrontLengthHPS : "",
    BackLengthHPS:
      isEdit && sizeMeasurementById ? sizeMeasurementById.BackLengthHPS : "",
    AcrossShoulders:
      isEdit && sizeMeasurementById ? sizeMeasurementById.AcrossShoulders : "",
    ArmHole: isEdit && sizeMeasurementById ? sizeMeasurementById.ArmHole : "",
    UpperChest:
      isEdit && sizeMeasurementById ? sizeMeasurementById.UpperChest : "",
    LowerChest:
      isEdit && sizeMeasurementById ? sizeMeasurementById.LowerChest : "",
    Waist: isEdit && sizeMeasurementById ? sizeMeasurementById.Waist : "",
    BottomWidth:
      isEdit && sizeMeasurementById ? sizeMeasurementById.BottomWidth : "",
    SleeveLength:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SleeveLength : "",
    SleeveOpening:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SleeveOpening : "",
    NeckSize: isEdit && sizeMeasurementById ? sizeMeasurementById.NeckSize : "",
    CollarHeight:
      isEdit && sizeMeasurementById ? sizeMeasurementById.CollarHeight : "",
    CollarPointHeight:
      isEdit && sizeMeasurementById
        ? sizeMeasurementById.CollarPointHeight
        : "",
    StandHeightBack:
      isEdit && sizeMeasurementById ? sizeMeasurementById.StandHeightBack : "",
    CollarStandLength:
      isEdit && sizeMeasurementById
        ? sizeMeasurementById.CollarStandLength
        : "",
    SideVentFront:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SideVentFront : "",
    SideVentBack:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SideVentBack : "",
    PlacketLength:
      isEdit && sizeMeasurementById ? sizeMeasurementById.PlacketLength : "",
    TwoButtonDistance:
      isEdit && sizeMeasurementById
        ? sizeMeasurementById.TwoButtonDistance
        : "",
    PlacketWidth:
      isEdit && sizeMeasurementById ? sizeMeasurementById.PlacketWidth : "",
    BottomHem:
      isEdit && sizeMeasurementById ? sizeMeasurementById.BottomHem : "",

    Hip: "",
    Hem:"",
    FrontRise: "",
    Inseam:"",
    HemBottom:""
  };

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
                <Link
                  href={"/product/productdefination"}
                  className="flex items-center gap-2 w-fit"
                >
                  <IoCaretBackOutline />
                  <h6 className="text-2xl font-semibold">
                    {isEdit ? "Update Measurement" : "Add Measurement"}
                  </h6>
                </Link>

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

                            const matchedCategory = PRODUCTCATERGORYENUM.find(
                              (cat) => cat.id === selectedId
                            );

                            if (matchedCategory) {
                              setShowMeasurementPin(true);
                              const matchedUnitType =
                                matchedCategory.unitType as
                                  | "Top"
                                  | "Bottom"
                                  | "Both";
                              setUnitType(matchedUnitType);
                              if (
                                matchedUnitType === "Top" ||
                                matchedUnitType === "Both"
                              ) {
                                setSelectedUnitType(1);
                              } else if (matchedUnitType === "Bottom") {
                                setSelectedUnitType(2);
                              }
                            } else {
                              setUnitType(null);
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

                <div className="flex items-center gap-2">
                  {(unitType === "Top" || unitType === "Both") && (
                    <button
                      type="button"
                      onClick={() => setSelectedUnitType(1)}
                      className={`${
                        selectedUnitType === 1
                          ? "bg-green-800 text-white"
                          : "bg-gray-300 text-gray-800"
                      } px-2 py-1 rounded`}
                    >
                      Top Unit
                    </button>
                  )}

                  {(unitType === "Bottom" || unitType === "Both") && (
                    <button
                      type="button"
                      onClick={() => setSelectedUnitType(2)}
                      className={`${
                        selectedUnitType === 2
                          ? "bg-green-800 text-white"
                          : "bg-gray-300 text-gray-800"
                      } px-2 py-1 rounded`}
                    >
                      Bottom Unit
                    </button>
                  )}
                </div>

                {selectedUnitType === 1 &&
                  (unitType === "Top" || unitType === "Both") && <TopUnit />}
                {selectedUnitType === 2 &&
                  (unitType === "Bottom" || unitType === "Both") && (
                    <BottomUnit />
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

          {showMeasurementPin ? (
            <div className="col-span-4 relative h-[calc(100vh-115px)]">
              <h3 className="">Measurements (inches)</h3>
              {/* <Image
                alt="human"
                src={ModalImage}
                fill
                style={{ objectFit: "contain" }}
                className="pointer-events-none"
              /> */}
              <div className="w-full h-full dark:text-gray-100 text-gray-800">
                <ShirtAndShortsModal />
              </div>
              <div className="absolute inset-0">
                {pinConfigs.map((cfg) => (
                  <MeasurementPin
                    key={cfg.fieldName}
                    config={cfg}
                    value={values[cfg.fieldName as keyof typeof values]}
                  />
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </Formik>
  );
};

export default SizeMeasurementForm;
