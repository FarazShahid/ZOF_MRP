import React from "react";
import Label from "../components/common/Label";
import { ErrorMessage, Field } from "formik";

const BottomUnit = () => {
  const BottomUnitInputs = [
    { id: 1, name: "Hem", label: "Hem", isRequired: false },
    { id: 2, name: "Hip", label: "Hip", isRequired: false },
    { id: 3, name: "FrontRise", label: "Front Rise", isRequired: false },
    { id: 4, name: "Inseam", label: "Inseam", isRequired: false },
    { id: 5, name: "HemBottom", label: "Hem Bottom", isRequired: false },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 border-1 dark:border-gray-300 shadow-lg rounded-lg p-3">
      {BottomUnitInputs.map((unitInput) => {
        return (
          <div className="flex flex-col gap-1 w-full" key={unitInput.id}>
            <Label
              isRequired={unitInput.isRequired}
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
