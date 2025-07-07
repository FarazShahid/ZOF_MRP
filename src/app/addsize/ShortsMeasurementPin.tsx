import ShortsModal from "@/public/svgs/ShortsModal";
import React from "react";
import MeasurementPin from "./MeasurementPin";
import { AddSizeMeasurementType } from "@/store/useSizeMeasurementsStore";
import { shortsPinConfigs } from "@/lib/shortsPinConfigs";
import FrontViewTop from "../../../public/mockUps/TopUnitFront.png"

const ShortsMeasurementPin = ({
  values,
}: {
  values: AddSizeMeasurementType;
}) => {
  return (
    <div className="col-span-4 relative h-[calc(100vh-115px)]">
      <div className="flex items-center justify-between">
        <h3 className="">Measurements (inches)</h3>
      </div>

      <div className="w-full h-full dark:text-gray-100 text-gray-800">
        <ShortsModal />
      </div>
      <div className="absolute inset-0 top-[30px]">
        {shortsPinConfigs.map((cfg) => (
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

export default ShortsMeasurementPin;
