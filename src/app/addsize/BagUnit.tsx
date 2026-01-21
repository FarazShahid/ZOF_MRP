import React from "react";
import { Field } from "formik";
import Label from "../components/common/Label";

const BagUnit = () => {
  return (
    <div className="grid grid-cols-4 gap-2 border-1 dark:border-gray-300 shadow-lg rounded-lg p-3">
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Height" />
        <Field
          name="Bag_Height"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Length" />
        <Field
          name="Bag_Length"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Depth" />
        <Field
          name="Bag_Depth"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Handle Grip" />
        <Field
          name="Bag_HandleGrip"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Shoulder Strap Full Length" />
        <Field
          name="Bag_ShoulderStrap_Full_Length"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Front Pocket Length" />
        <Field
          name="Bag_FrontPocketLength"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Front Pocket Height" />
        <Field
          name="Bag_FrontPocketHeight"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Side Pocket Length" />
        <Field
          name="Bag_SidePocketLength"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Side Pocket Height" />
        <Field
          name="Bag_SidePocketHeight"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
    </div>
  );
};

export default BagUnit;
