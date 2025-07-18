import React from "react";
import Label from "../components/common/Label";
import { ErrorMessage, Field } from "formik";

const BottomUnit = () => {
  const BottomUnitInputs = [
    { id: 1, name: "Hip", label: "Hip" },
    { id: 2, name: "Waist", label: "Waist" },
    { id: 3, name: "WasitStretch", label: "Wasit Stretch" }, // new field
    { id: 4, name: "WasitRelax", label: "Wasit Relax" }, // new field
    { id: 5, name: "Thigh", label: "Thigh" }, // new field
    { id: 6, name: "KneeWidth", label: "Knee Width" },
    { id: 7, name: "BackRise", label: "Back Rise" }, // new field
    { id: 8, name: "bFrontRise", label: "Front Rise" },
    { id: 9, name: "TotalLength", label: "Total Length" }, // new field
    { id: 10, name: "WBHeight", label: "WB-Height" }, // new field
    { id: 11, name: "bBottomWidth", label: "Bottom Width" }, // new field
    { id: 12, name: "HemBottom", label: "Hem Bottom" },
    { id: 13, name: "BottomOriginal", label: "Bottom Original" }, // new field
    { id: 14, name: "BottomElastic", label: "Bottom Elastic" }, // new field
    { id: 15, name: "Outseam", label: "Outseam" },
    { id: 16, name: "Inseam", label: "Inseam" },
    { id: 17, name: "LegOpening", label: "Leg Opening" },
    { id: 18, name: "BottomCuffZipped", label: "Bottom Cuff Zipped" }, // new field
    { id: 19, name: "BottomStraightZipped", label: "Bottom Straight Zipped" }, // new field
  ];
  return (
    <div className="grid grid-cols-4 gap-2 border-1 dark:border-gray-300 shadow-lg rounded-lg p-3">
      {BottomUnitInputs.map((unitInput) => {
        return (
          <div className="flex flex-col gap-1 w-full" key={unitInput.id}>
            <Label
              isRequired={false}
              label={unitInput.label}
              labelForm={unitInput.label}
            />
            <Field
              name={unitInput.name}
              type="number"
              placeholder={`Enter ${unitInput.label}`}
              className="formInputdefault border-1"
            />
            <ErrorMessage
              name={unitInput.name}
              component="div"
              className="text-red-400 text-sm"
            />
          </div>
        );
      })}
    </div>
  );
};

export default BottomUnit;
