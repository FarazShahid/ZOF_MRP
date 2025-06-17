import React from "react";


type ViewMeasurementPinProps = {
  fieldName: string;
  label: string;
  value: string | number | undefined;
  top: string;
  left: string;
  colorClass: string;
};

const ViewMeasurementPin: React.FC<ViewMeasurementPinProps> = ({
  fieldName,
  label,
  value,
  top,
  left,
  colorClass,
}) => {
  if (value === undefined || value === null) return null;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative group cursor-pointer">
        <div
          className={`${colorClass} text-white px-2 py-1 rounded-full text-sm`}
        >
          {Number(value) % 1 === 0 ? Number(value) : Number(value).toFixed(2)}
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-99999">
          {label}
        </div>
      </div>
    </div>
  );
};

export default ViewMeasurementPin;
