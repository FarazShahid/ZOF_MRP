import React from "react";
import { ErrorMessage, Field } from "formik";
import Label from "../components/common/Label";

interface LogoProp {
  IsTopUnit: boolean;
  IsBottomUnit: boolean;
}

const LogoMeasurement: React.FC<LogoProp> = ({ IsTopUnit, IsBottomUnit }) => {
  const LogoInputs = [
    { id: 1, name: "t_TopRight", label: "Top Right" },
    { id: 2, name: "t_TopLeft", label: "Top Left" },
    { id: 3, name: "t_BottomRight", label: "Bottom Right" },
    { id: 4, name: "t_BottomLeft", label: "Bottom Left" },
    { id: 5, name: "t_Center", label: "Center" },
    { id: 6, name: "t_Back", label: "Back" },
    { id: 7, name: "t_left_sleeve", label: "Left Sleeve" },
    { id: 8, name: "t_right_sleeve", label: "Right Sleeve" },
  ];

  const LogInputBottom = [
    { id: 7, name: "b_TopRight", label: "Top Right" },
    { id: 8, name: "b_TopLeft", label: "Top Left" },
    { id: 9, name: "b_BottomRight", label: "Bottom Right" },
    { id: 10, name: "b_BottomLeft", label: "Bottom Left" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {IsTopUnit && IsBottomUnit ? (
        <span className="font-bold">Logo Measurement for Top Unit</span>
      ) : (
        <></>
      )}
      {IsTopUnit && (
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
      )}

      {IsTopUnit && IsBottomUnit ? (
        <span className="font-bold">Logo Measurement for Bottom Unit</span>
      ) : (
        <></>
      )}

      {IsBottomUnit && (
        <div className="grid grid-cols-4 gap-2 border-1 dark:border-gray-300 shadow-lg rounded-lg p-3">
          {LogInputBottom.map((unitInput) => {
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
                  min={0}
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
      )}
    </div>
  );
};

export default LogoMeasurement;
