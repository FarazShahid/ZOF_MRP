// pages/measurements.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import HumanBody from "../../../public/humanBody.png";
import AdminLayout from "@/src/app/adminDashboard/lauout";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";

type MeasurementData = {
  chest?: number;
  waist?: number;
  inseam?: number;
  armLength?: number;
  hips?: number;
};

const bodyParts = [
  { key: "NeckSize", label: "Neck Size", top: "13%", left: "60%", borderTop: "33%", borderLeft: "-33px", borderWidth: "35px" },
  { key: "UpperChest", label: "Upper Chest", top: "20%", left: "65%", borderTop: "50%", borderLeft: "-135px", borderWidth: "135px" },
  { key: "LowerChest", label: "Lower Chest", top: "25%", left: "65%", borderTop: "50%", borderLeft: "-135px", borderWidth: "135px" },
  { key: "ArmHole", label: "Arm Hole", top: "45%", left: "5%", borderTop: "50%", borderLeft: "0px", borderWidth: "55px" },
];

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<MeasurementData>({});
  const [activePart, setActivePart] = useState<string | null>(null);

  const handleSave = (partKey: string, value: number) => {
    setMeasurements((prev) => ({ ...prev, [partKey]: value }));
    setActivePart(null);
  };

  return (
    <AdminDashboardLayout>
      <div className="relative w-[400px] mx-auto p-4">
        <div className="relative">
          {/* Human Image */}
          <Image
            alt="human"
            src={HumanBody}
            style={{ height: "calc(100vh - 170px)" }}
          />

          {/* Markers */}
          {bodyParts.map((part) => (
            <div
              key={part.key}
              className="absolute cursor-pointer"
              style={{
                top: part.top,
                left: part.left,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => setActivePart(part.key)}
            >
              {/* Highlight Border if Active */}
              {activePart === part.key && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute border-1 border-gray-400 bg-gray-200 opacity-30"
                  style={{
                    top: part.borderTop,
                    left: part.borderLeft,
                    width: part.borderWidth,
                    transform: "translate(-50%, -50%)",
                  }}
                ></motion.div>
              )}
              {/* Marker Button */}
                <div
                className={`relative rounded-full w-4 h-4 flex items-center justify-center text-white text-xs font-bold
                    ${measurements[part.key as keyof MeasurementData] ? "bg-green-500" : "bg-blue-500"}
                `}
                title={part.label}
                >
                {measurements[part.key as keyof MeasurementData] ? "✓" : "?"}
                </div>

              {/* Input Popover */}
              <AnimatePresence>
                {activePart === part.key && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border rounded shadow-lg p-3 w-44 z-50"
                  >
                    <label className="text-sm font-semibold text-black">
                      {part.label}
                    </label>
                    <input
                      type="number"
                      className="w-full mt-2 border rounded px-2 py-1 text-white z-20"
                      defaultValue={
                        measurements[part.key as keyof MeasurementData] || ""
                      }
                      onBlur={(e) =>
                        handleSave(part.key, parseFloat(e.target.value))
                      }
                      autoFocus
                    />
                    <button
                      className="text-xs text-gray-500 mt-2 block mx-auto"
                      onClick={() => setActivePart(null)}
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Debug */}
        {/* <pre className="mt-6 bg-gray-100 p-3 rounded text-xs">{JSON.stringify(measurements, null, 2)}</pre> */}
      </div>
    </AdminDashboardLayout>
  );
}
