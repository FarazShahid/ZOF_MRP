"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ColorWheel from "../../../../../public/color-wheel.png";
import { MeasurementType } from "@/interface";

interface MeasurementFilterProps {
  onClick: (type: MeasurementType) => void;
}

const MeasurementFilter: React.FC<MeasurementFilterProps> = ({ onClick }) => {
  const filterRef = useRef<HTMLDivElement>(null);
  const [showFilter, setShowFilter] = useState(false);

  const measurementOptions: { id: number; name: MeasurementType }[] = [
    { id: 1, name: "chest" },
    { id: 2, name: "neck" },
    { id: 3, name: "sleeveLength" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="p-2 rounded-md w-20"
      >
        <Image src={ColorWheel} alt="color" />
      </button>

      {showFilter && (
        <div className="absolute z-50 mt-2 left-0 w-72 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl shadow-xl p-4 space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {measurementOptions.map((measurement) => (
              <button
                key={measurement.id}
                onClick={() => onClick(measurement.name)}
                className="w-full py-2 px-3 text-sm bg-gray-200 rounded"
              >
                {measurement.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementFilter;
