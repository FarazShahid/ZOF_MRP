import useColorOptionsStore from "@/store/useColorOptionsStore";
import React, { FC, useEffect } from "react";

interface ColorContainerProp {
  ColorOptionName: string;
  ColorOptionId: number;
}

const ColorContainer: FC<ColorContainerProp> = ({ ColorOptionName, ColorOptionId }) => {
  const {colorOptions, fetchColorOptions } = useColorOptionsStore();

  useEffect(() => {
    if (colorOptions.length === 0) {
      fetchColorOptions();
    }
  }, []);

  const matchedColor = colorOptions.find(
    (color) => color.Id === ColorOptionId
  );

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-5 rounded"
        style={{ background: matchedColor?.HexCode || "#ccc" }}
      />
      <span className="text-sm">{ColorOptionName}</span>
    </div>
  );
};

export default ColorContainer;
