import React from "react";
import Label from "../components/common/Label";
import { ErrorMessage, Field } from "formik";

const TopUnit = () => {
  const TopUnitInput = [
    { id: 1, name: "BackNeckDrop", label: "Back Neck Drop" },
    { id: 2, name: "FrontNeckDrop", label: "Front Neck Drop" },
    { id: 3, name: "ShoulderSeam", label: "Shoulder Seam" },
    { id: 4, name: "ShoulderSlope", label: "Shoulder Slope" },
    { id: 5, name: "AcrossShoulders", label: "Across Shoulders" },
    { id: 6, name: "NeckSize", label: " Neck Size" },
    { id: 7, name: "Neckwidth", label: " Neck width" }, // new field
    { id: 8, name: "CollarHeight", label: " Collar Height" },
    { id: 9, name: "CollarPointHeight", label: "Collar Point Height" },
    { id: 10, name: "CollarStandLength", label: "Collar Stand Length" },
    {
      id: 11,
      name: "ColllarHeightCenterBack",
      label: "Collar Height at Center Back",
    }, // new field 
    { id: 12, name: "CollarOpening", label: "Collar Opening" }, //new field
    { id: 13, name: "UpperChest", label: "Upper Chest" },
    { id: 14, name: "LowerChest", label: "Lower Chest" },
    { id: 15, name: "SleeveLength", label: "Sleeve Length" },
    { id: 16, name: "SleeveOpening", label: "Sleeve Opening" },
    { id: 17, name: "ArmHole", label: "Arm Hole" },
    { id: 18, name: "ArmHoleStraight", label: "Arm Hole Straight" }, // new field
    { id: 19, name: "CuffHeight", label: "Cuff Height" }, // new field
    { id: 20, name: "FrontLengthHPS", label: "Front Length HPS" },
    { id: 21, name: "BackLengthHPS", label: "Back Length HPS" },
    { id: 22, name: "FrontRise", label: "Front Rise" },
    { id: 23, name: "Hem", label: "Hem" },
    { id: 24, name: "BottomHem", label: "Bottom Hem" },
    { id: 25, name: "BottomWidth", label: "Bottom Width" },
    { id: 25, name: "BottomRib", label: "Bottom Rib" }, // new field
    { id: 26, name: "StandHeightBack", label: "Stand Height Back" },
    { id: 27, name: "SideVentFront", label: "Side Vent Front" },
    { id: 28, name: "SideVentBack", label: "Side Vent Back" },
    { id: 29, name: "PlacketLength", label: "Placket Length" },
    { id: 30, name: "TwoButtonDistance", label: "Two Button Distance" },
    { id: 31, name: "PlacketWidth", label: "Placket Width" },
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
