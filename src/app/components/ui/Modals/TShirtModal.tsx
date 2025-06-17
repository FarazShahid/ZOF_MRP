import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Color, Group, MeshStandardMaterial } from "three";

interface TShirtModelProps {
  color?: string;
  url?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const TShirtModel: React.FC<TShirtModelProps> = ({
  url = "/models/long_sleeve_t-_shirt.glb",
  color = "#ffffff",
  scale = 1.3,
  position = [0, -1, 0],
  rotation = [0, Math.PI / 0.9, 0],
}) => {
  const gltf = useGLTF(url) as { scene: Group };

  const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useEffect(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mat = child.material as MeshStandardMaterial;
        if (mat.color) {
          mat.color = new Color(color);
        }
      }
    });
  }, [clonedScene, color]);

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={position}
      rotation={[0, 0.5, 0]}
    />
  );
};

useGLTF.preload("/models/t_shirt.glb");

export default TShirtModel;
