import React from 'react'
import Label from '../components/common/Label';
import { ErrorMessage, Field } from 'formik';

const LogoMeasurement = () => {
    const LogoInputs = [
    { id: 1, name: "TopRight", label: "Top Right" },
    { id: 2, name: "TopLeft", label: "Top Left" },
    { id: 3, name: "BottomRight", label: "Bottom Right" },
    { id: 4, name: "BottomLeft", label: "Bottom Left" },
    { id: 5, name: "Back", label: "Back" },
  ];

  return (
     <div className="grid grid-cols-4 gap-2 border-1 dark:border-gray-300 shadow-lg rounded-lg p-3">
      {LogoInputs.map((unitInput) => {
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
  )
}

export default LogoMeasurement