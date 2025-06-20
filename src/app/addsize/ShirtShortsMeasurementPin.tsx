import React, { useState } from "react";
import ShirtShortsView from "./ShirtShortsView";
import { pinConfigs } from "@/lib/pinConfigs";
import MeasurementPin from "./MeasurementPin";
import { AddSizeMeasurementType } from "@/store/useSizeMeasurementsStore";

export const ShirtShortsMeasurementPin = ({
  values,
}: {
  values: AddSizeMeasurementType;
}) => {
  const [shirtFrontView, setShirtFrontView] = useState(true);
  const handleToggleShirtView = () => {
    setShirtFrontView((prev) => !prev);
  };

  return (
    <div className="col-span-4 relative h-[calc(100vh-115px)]">
      <div className="flex items-center justify-between">
        <h3 className="">Measurements (inches)</h3>
        <button
          className="bg-blue-600 text-white px-1 text-sm py-1 rounded"
          type="button"
          onClick={handleToggleShirtView}
        >
          {shirtFrontView === true ? "Back View" : "Front View"}
        </button>
      </div>

      <div className="w-full h-full dark:text-gray-100 text-gray-800">
          <ShirtShortsView shirtFrontView={shirtFrontView} />
        </div>
      <div className="absolute inset-0 top-[30px]">
        {pinConfigs.map((cfg) => (
          <MeasurementPin
            key={cfg.fieldName}
            config={cfg}
            value={values[cfg.fieldName as keyof typeof values]}
          />
        ))}
      </div>
    </div>
  );
};
