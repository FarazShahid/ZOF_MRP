import React from "react";

type PinConfig = {
  fieldName: string; // matches Formik’s values key
  label: string;     // tooltip text
  top: string;       // e.g. "28%"
  left: string;      // e.g. "50%"
  colorClass: string;// Tailwind class like "bg-blue-500"
};

type Props = {
  config: PinConfig;
  value: string | number;
};

const MeasurementPin: React.FC<Props> = ({ config, value }) => {
   if (value === undefined || value === null || Number(value) === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: config.top,
        left: config.left,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* “group” allows us to use “group-hover” on the tooltip */}
      <div className="relative group cursor-pointer">
        {/* The colored bubble showing the measurement */}
        <div className={`${config.colorClass} text-white px-2 py-1 rounded-full text-sm`}>
          {Number(value) % 1 === 0 ? Number(value) : Number(value).toFixed(2)}
        </div>

        {/* Tooltip: hidden by default, shown when parent (.group) is hovered */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white dark:text-black text-xs rounded px-2 py-1 whitespace-nowrap z-99999">
          {config.label}
        </div>
      </div>
    </div>
  );
};

export default MeasurementPin;
