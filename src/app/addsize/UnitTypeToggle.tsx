import React from "react";

interface Props {
  selectedUnitType: number;
  setSelectedUnitType: (type: number) => void;
  measurementManagement: {
    IsTopUnit: boolean;
    IsBottomUnit: boolean;
    SupportsLogo: boolean;
  };
}

const UnitTypeToggle: React.FC<Props> = ({
  selectedUnitType,
  setSelectedUnitType,
  measurementManagement,
}) => {
  return (
    <div className="flex items-center gap-2">
      {measurementManagement.IsTopUnit && (
        <button
          type="button"
          onClick={() => setSelectedUnitType(1)}
          className={`${
            selectedUnitType === 1
              ? "bg-green-800 text-white"
              : "bg-gray-300 text-gray-800"
          } px-2 py-1 rounded`}
        >
          Top Unit
        </button>
      )}

      {measurementManagement.IsBottomUnit && (
        <button
          type="button"
          onClick={() => setSelectedUnitType(2)}
          className={`${
            selectedUnitType === 2
              ? "bg-green-800 text-white"
              : "bg-gray-300 text-gray-800"
          } px-2 py-1 rounded`}
        >
          Bottom Unit
        </button>
      )}

      {measurementManagement.SupportsLogo && (
        <button
          type="button"
          onClick={() => setSelectedUnitType(3)}
          className={`${
            selectedUnitType === 3
              ? "bg-green-800 text-white"
              : "bg-gray-300 text-gray-800"
          } px-2 py-1 rounded`}
        >
          Logo
        </button>
      )}
    </div>
  );
};

export default UnitTypeToggle;
