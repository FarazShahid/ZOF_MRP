"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { IoCaretBackOutline } from "react-icons/io5";
import HumanBody from "../../../public/humanBody.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
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

const SizeMeasurementForm = ({
  isEdit,
  sizeId,
}: {
  isEdit: boolean;
  sizeId?: number;
}) => {
  const router = useRouter();
  const { fetchsizeOptions, sizeOptions } = useSizeOptionsStore();
  const { fetchClients, clients } = useClientStore();
  const {
    loading,
    addSizeMeasurement,
    updateMeasurement,
    getSizeMeasurementById,
    sizeMeasurementById,
  } = useSizeMeasurementsStore();

  useEffect(() => {
    if (sizeId && isEdit) {
      getSizeMeasurementById(sizeId);
    }
  }, [sizeId, isEdit]);

  useEffect(() => {
    fetchsizeOptions();
    fetchClients();
  }, []);

  const closeAddModal = () => {
    router.push("/product/productdefination");
  };

  const InitialValues = {
    SizeOptionId:
      isEdit && sizeMeasurementById ? sizeMeasurementById.SizeOptionId : 0,
    ClientId: isEdit && sizeMeasurementById ? sizeMeasurementById.ClientId : 0,
    Measurement1:
      isEdit && sizeMeasurementById ? sizeMeasurementById.Measurement1 : "",
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
              <div className="space-y-2">
                <Link
                  href={"/product/productdefination"}
                  className="flex items-center gap-2"
                >
                  <IoCaretBackOutline />
                  <h6 className="text-2xl font-semibold">
                    {isEdit ? "Update Measurement" : "Add Measurement"}
                  </h6>
                </Link>

                <div className="grid grid-cols-3 gap-3">
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

                {/* Toggle Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="bg-gray-700 px-2 py-1 rounded text-white"
                  >
                    Top Unit
                  </button>
                  <button
                    type="button"
                    className="bg-gray-700 px-2 py-1 rounded text-white"
                  >
                    Bottom Unit
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 border-1 border-gray-700 rounded-lg p-3">
                  {/* FrontLengthHPS */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Front Length HPS"
                      labelForm="Front Length HPS"
                    />
                    <Field
                      name="FrontLengthHPS"
                      type="number"
                      placeholder="Enter Front Length HPS"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="FrontLengthHPS"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* BackLengthHPS */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Back Length HPS"
                      labelForm="Back Length HPS"
                    />
                    <Field
                      name="BackLengthHPS"
                      type="number"
                      placeholder="Enter Back Length HPS"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="BackLengthHPS"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* AcrossShoulders */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Across Shoulders"
                      labelForm="Across Shoulders"
                    />
                    <Field
                      name="AcrossShoulders"
                      type="number"
                      placeholder="Enter Across Shoulders"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="AcrossShoulders"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* ArmHole */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label isRequired label="Arm Hole" labelForm="Arm Hole" />
                    <Field
                      name="ArmHole"
                      type="number"
                      placeholder="Enter Arm Hole"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="ArmHole"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* UpperChest */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Upper Chest"
                      labelForm="Upper Chest"
                    />
                    <Field
                      name="UpperChest"
                      type="number"
                      placeholder="Enter Upper Chest"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="UpperChest"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* LowerChest */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Lower Chest"
                      labelForm="Lower Chest"
                    />
                    <Field
                      name="LowerChest"
                      type="number"
                      placeholder="Enter Lower Chest"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="LowerChest"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Waist */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label isRequired label="Waist" labelForm="Waist" />
                    <Field
                      name="Waist"
                      type="number"
                      placeholder="Enter Waist"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="Waist"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* BottomWidth */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Bottom Width"
                      labelForm="Bottom Width"
                    />
                    <Field
                      name="BottomWidth"
                      type="number"
                      placeholder="Enter Bottom Width"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="BottomWidth"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* SleeveLength */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Sleeve Length"
                      labelForm="Sleeve Length"
                    />
                    <Field
                      name="SleeveLength"
                      type="number"
                      placeholder="Enter Sleeve Length"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="SleeveLength"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* SleeveOpening */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Sleeve Opening"
                      labelForm="Sleeve Opening"
                    />
                    <Field
                      name="SleeveOpening"
                      type="number"
                      placeholder="Enter Sleeve Opening"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="SleeveOpening"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* NeckSize */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label isRequired label="Neck Size" labelForm="Neck Size" />
                    <Field
                      name="NeckSize"
                      type="number"
                      placeholder="Enter Neck Size"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="NeckSize"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* CollarHeight */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Collar Height"
                      labelForm="Collar Height"
                    />
                    <Field
                      name="CollarHeight"
                      type="number"
                      placeholder="Enter Collar Height"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="CollarHeight"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* CollarPointHeight */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Collar Point Height"
                      labelForm="Collar Point Height"
                    />
                    <Field
                      name="CollarPointHeight"
                      type="number"
                      placeholder="Enter Collar Point Height"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="CollarPointHeight"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* StandHeightBack */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Stand Height Back"
                      labelForm="Stand Height Back"
                    />
                    <Field
                      name="StandHeightBack"
                      type="number"
                      placeholder="Enter Stand Height Back"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="StandHeightBack"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* CollarStandLength */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Collar Stand Length"
                      labelForm="Collar Stand Length"
                    />
                    <Field
                      name="CollarStandLength"
                      type="number"
                      placeholder="Enter Collar Stand Length"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="CollarStandLength"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* SideVentFront */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Side Vent Front"
                      labelForm="Side Vent Front"
                    />
                    <Field
                      name="SideVentFront"
                      type="number"
                      placeholder="Enter Side Vent Front"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="SideVentFront"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* SideVentBack */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Side Vent Back"
                      labelForm="Side Vent Back"
                    />
                    <Field
                      name="SideVentBack"
                      type="number"
                      placeholder="Enter Side Vent Back"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="SideVentBack"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* PlacketLength */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Placket Length"
                      labelForm="Placket Length"
                    />
                    <Field
                      name="PlacketLength"
                      type="number"
                      placeholder="Enter Placket Length"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="PlacketLength"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* TwoButtonDistance */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Two Button Distance"
                      labelForm="Two Button Distance"
                    />
                    <Field
                      name="TwoButtonDistance"
                      type="number"
                      placeholder="Enter Two Button Distance"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="TwoButtonDistance"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* PlacketWidth */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Placket Width"
                      labelForm="Placket Width"
                    />
                    <Field
                      name="PlacketWidth"
                      type="number"
                      placeholder="Enter Placket Width"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="PlacketWidth"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* BottomHem */}
                  <div className="flex flex-col gap-1 w-full">
                    <Label
                      isRequired
                      label="Bottom Hem"
                      labelForm="Bottom Hem"
                    />
                    <Field
                      name="BottomHem"
                      type="number"
                      placeholder="Enter Bottom Hem"
                      className="formInputdefault border-1"
                    />
                    <ErrorMessage
                      name="BottomHem"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>
                </div>

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

          <div className="col-span-4 relative h-[calc(100vh-115px)]">
            <Image
              alt="human"
              src={HumanBody}
              fill
              style={{ objectFit: "contain" }}
              className="pointer-events-none"
            />
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
        </div>
      )}
    </Formik>
  );
};

export default SizeMeasurementForm;
