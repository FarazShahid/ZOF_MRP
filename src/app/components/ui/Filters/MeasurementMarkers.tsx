import React from 'react';
import { Html } from '@react-three/drei';
import { Line,  } from '@react-three/drei';
import { Vector3 } from 'three';
import { MeasurementType } from '@/interface';

interface Props {
  type: MeasurementType | null;
  value?: string;
}

const MeasurementMarkers: React.FC<Props> = ({ type, value }) => {
  if (!type) return null;

  const commonLineProps = {
    color: 'green',
    lineWidth: 2,
    dashed: false,
  };

  switch (type) {
    case 'chest':
      return (
        <>
         
          <Line
            points={[
              new Vector3(-0.26, 0.9, 0),
              new Vector3(0.14, 0.9, 0),
            ]}
            {...commonLineProps}
          />
          <Html position={[0, 0.95, 0.1]} center>
            <div className="bg-black/80 text-white px-2 py-1 text-xs rounded">
              CHEST: {value || '32``'}
            </div>
          </Html>
        </>
      );

    case 'neck':
      return (
        <>
          <Line
            points={[
              new Vector3(-0.2, 1.55, 0.1),
              new Vector3(0.2, 1.55, 0.1),
            ]}
            {...commonLineProps}
          />
          <Html position={[0, 1, 0.1]} center>
            <div className="bg-black/80 text-white px-2 py-1 text-xs rounded">
              NECK: {value || '---'}
            </div>
          </Html>
        </>
      );

    case 'sleeveLength':
      return (
        <>
          <Line
            points={[
              new Vector3(-0.5, 1.0, 0), // shoulder start
              new Vector3(-0.85, 1.0, -0.8), // wrist
            ]}
            {...commonLineProps}
          />
          <Html position={[-0.7, 1.05, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 text-xs rounded">
              SLEEVE: {value || '---'}
            </div>
          </Html>
        </>
      );

    default:
      return null;
  }
};

export default MeasurementMarkers;
