import React from "react";

type PinConfig = {
  fieldName: string; // matches key in API response
  label: string;     // tooltip text
  top: string;       // e.g. "28%"
  left: string;      // e.g. "50%"
  colorClass: string;// Tailwind class like "bg-blue-500"
};

type Props = {
  config: PinConfig;
  value: string | number | null | undefined;
};

const ViewMeasurement: React.FC<Props> = ({ config, value }) => {
  // Normalize value from API response
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  // Don't render if value is invalid or zero
  if (!numericValue || isNaN(numericValue) || numericValue === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: config.top,
        left: config.left,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative group cursor-pointer">
        {/* Measurement Bubble */}
        <div className={`${config.colorClass} text-white px-2 py-1 rounded-full text-sm`}>
          {Number(numericValue) % 1 === 0
            ? numericValue
            : numericValue.toFixed(2)}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
          {config.label}
        </div>
      </div>
    </div>
  );
};

export default ViewMeasurement;
