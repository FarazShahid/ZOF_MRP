import React from "react";
import Label from "../components/common/Label";
import { ErrorMessage, Field } from "formik";

const TopUnit = () => {
  return (
    <div className="grid grid-cols-4 gap-2 border-1 dark:border-gray-300 shadow-lg rounded-lg p-3">
      {/* NeckSize */}
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Neck Size" labelForm="Neck Size" />
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
          isRequired={false}
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
          isRequired={false}
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

      {/* CollarStandLength */}
      <div className="flex flex-col gap-1 w-full">
        <Label
          isRequired={false}
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

      {/* AcrossShoulders */}
      <div className="flex flex-col gap-1 w-full">
        <Label
          isRequired={false}
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

       {/* UpperChest */}
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Upper Chest" labelForm="Upper Chest" />
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
        <Label isRequired={false} label="Lower Chest" labelForm="Lower Chest" />
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

      {/* SleeveLength */}
      <div className="flex flex-col gap-1 w-full">
        <Label
          isRequired={false}
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
          isRequired={false}
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

      {/* ArmHole */}
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Arm Hole" labelForm="Arm Hole" />
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

      {/* FrontLengthHPS */}
      <div className="flex flex-col gap-1 w-full">
        <Label
          isRequired={false}
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
          isRequired={false}
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

     

      {/* Waist */}
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Waist" labelForm="Waist" />
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
          isRequired={false}
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

      {/* StandHeightBack */}
      <div className="flex flex-col gap-1 w-full">
        <Label
          isRequired={false}
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

      {/* SideVentFront */}
      <div className="flex flex-col gap-1 w-full">
        <Label
          isRequired={false}
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
          isRequired={false}
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
          isRequired={false}
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
          isRequired={false}
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
          isRequired={false}
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
        <Label isRequired={false} label="Bottom Hem" labelForm="Bottom Hem" />
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
  );
};

export default TopUnit;
