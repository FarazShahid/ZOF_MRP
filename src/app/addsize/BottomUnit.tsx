import React from "react";
import Label from "../components/common/Label";
import { ErrorMessage, Field } from "formik";

const BottomUnit = () => {
  const BottomUnitInputs = [
    { id: 1, name: "Hip", label: "Hip" },
    { id: 2, name: "Waist", label: "Waist" },
    { id: 3, name: "Outseam", label: "Outseam" },
    { id: 4, name: "Inseam", label: "Inseam" },
    { id: 5, name: "HemBottom", label: "Hem Bottom" },
    {id: 6, name: "KneeWidth", label: "Knee Width"},
     {id: 7, name: "bFrontRise", label: "Front Rise"},
    {id: 8, name: "LegOpening", label: "Leg Opening"},
    
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
