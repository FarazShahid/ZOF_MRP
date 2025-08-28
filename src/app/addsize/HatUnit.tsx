import React from "react";
import { Field } from "formik";
import Label from "../components/common/Label";

const HatUnit = () => {
  return (
    <div className="grid grid-cols-4 gap-2 border-1 dark:border-gray-300 shadow-lg rounded-lg p-3">
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Visor Length" />
        <Field
          name="H_VisorLength"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Visor Width" />
        <Field
          name="H_VisorWidth"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Crown Circumference" />
        <Field
          name="H_CrownCircumference"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Front Seam Length" />
        <Field
          name="H_FrontSeamLength"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Back Seam Length" />
        <Field
          name="H_BackSeamLength"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Right Center Seam Length" />
        <Field
          name="H_RightCenterSeamLength"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Left Center Seam Length" />
        <Field
          name="H_LeftCenterSeamLength"
          type="number"
          className="formInputdefault border-1"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Strap Width" />
        <Field
          name="H_StrapWidth"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Strapback Length" />
        <Field
          name="H_StrapbackLength"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Sweat Band Width" />
        <Field
          name="H_SweatBandWidth"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Fusion on inside" />
        <Field
          name="H_FusionInside"
          as="select"
          className="formInputdefault border-1"
        >
          <option value={""}>Select an option</option>
          <option value={"Yes"}>Yes</option>
          <option value={"No"}>No</option>
        </Field>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Patch Size" />
        <Field
          name="H_PatchSize"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label isRequired={false} label="Patch Placement" />
        <Field
          name="H_PatchPlacement"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
      <div className="flex flex-col gap-1 col-span-2 w-full">
        <Label
          isRequired={false}
          label="Closure Height including strap width"
        />
        <Field
          name="H_ClosureHeightIncludingStrapWidth"
          type="number"
          className="formInputdefault border-1"
        />
      </div>
    </div>
  );
};

export default HatUnit;
