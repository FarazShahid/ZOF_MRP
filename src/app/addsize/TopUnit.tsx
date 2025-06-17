import React from "react";
import Label from "../components/common/Label";
import { ErrorMessage, Field } from "formik";

const TopUnit = () => {
  const TopUnitInput = [
    { id: 1, name: "BackNeckDrop", label: "Back Neck Drop" },
    { id: 2, name: "FrontNeckDrop", label: "Front Neck Drop" },
    { id: 3, name: "ShoulderSeam", label: "Shoulder Seam" },
    { id: 4, name: "ShoulderSlope", label: "Shoulder Slope" },
    { id: 5, name: "UpperChest", label: "Upper Chest" },
    { id: 6, name: "LowerChest", label: "Lower Chest" },
    { id: 7, name: "SleeveLength", label: "Sleeve Length" },
    { id: 8, name: "SleeveOpening", label: "Sleeve Opening" },
    { id: 9, name: "FrontLengthHPS", label: "Front Length HPS" },
    { id: 10, name: "FrontRise", label: "Front Rise" },
    { id: 11, name: "BottomHem", label: "Hem" },
    { id: 12, name: "NeckSize", label: " NeckSize" },
    { id: 13, name: "CollarHeight", label: " Collar Height" },
    { id: 14, name: "CollarPointHeight", label: "Collar Point Height" },
    { id: 15, name: "CollarStandLength", label: "Collar Stand Length" },
    { id: 16, name: "AcrossShoulders", label: "Across Shoulders" },
    { id: 17, name: "BackLengthHPS", label: "Back Length HPS" },
    { id: 18, name: "BottomWidth", label: "Bottom Width" },
    { id: 19, name: "StandHeightBack", label: "Stand Height Back" },
    { id: 20, name: "SideVentFront", label: "Side Vent Front" },
    { id: 21, name: "SideVentBack", label: "Side Vent Back" },
    { id: 22, name: "PlacketLength", label: "Placket Length" },
    { id: 23, name: "TwoButtonDistance", label: "Two Button Distance" },
    { id: 24, name: "PlacketWidth", label: "Placket Width" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 border-1 dark:border-gray-300 shadow-lg rounded-lg p-3">
      {TopUnitInput.map((topInput, index) => {
        return (
          <div className="flex flex-col gap-1 w-full" key={index}>
            <Label
              isRequired={false}
              label={topInput.label}
              labelForm={topInput.label}
            />
            <Field
              name={topInput.name}
              type="number"
              placeholder={`Enter ${topInput.label}`}
              className="formInputdefault border-1"
            />
            <ErrorMessage
              name="NeckSize"
              component="div"
              className="text-red-400 text-sm"
            />
          </div>
        );
      })}
    </div>
  );
};

export default TopUnit;
