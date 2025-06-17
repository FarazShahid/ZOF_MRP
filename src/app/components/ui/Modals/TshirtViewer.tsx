"use client";

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useProgress,
  Bounds,
} from "@react-three/drei";
import TShirtModel from "./TShirtModal";
import ColorFilter from "../Filters/ColorFilter";
import MeasurementMarkers from "../Filters/MeasurementMarkers";
import MeasurementFilter from "../Filters/MeasurementFilter";
import { MeasurementType } from "@/interface";

const Loader: React.FC = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <span style={{ color: "#fff" }}>Loading... {progress.toFixed(0)}%</span>
    </Html>
  );
};

const TShirtViewer: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
 const [activeMeasurement, setActiveMeasurement] = useState<MeasurementType | null>(null);
  const [measurementValues, setMeasurementValues] = useState<Record<MeasurementType, string>>({
    chest: "",
    neck: "",
    sleeveLength: "",
  });

  return (
    <div className="w-full h-full flex gap-2">
      <div className="flex flex-col gap-2 border-1 border-gray-200 rounded-lg h-fit">
        <ColorFilter onClick={(color) => setSelectedColor(color)} />
        <MeasurementFilter onClick={setActiveMeasurement} />
      </div>

      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 5]} intensity={1} castShadow />
        <Suspense fallback={<Loader />}>
          <Environment preset="city" background={false} />
          <Bounds fit clip margin={1.2}>
            <TShirtModel color={selectedColor} />
            <MeasurementMarkers
              type={activeMeasurement}
              value={
                activeMeasurement ? measurementValues[activeMeasurement] : ""
              }
            />
          </Bounds>
        </Suspense>

        <OrbitControls
          enableZoom
          enablePan
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0.6, 0]}
        />
      </Canvas>
    </div>
  );
};

export default TShirtViewer;
