import React, { FC } from "react";

interface ColorContainerProp {
  ColorOptionName: string;
  HexCode: string;
}

const ColorContainer: FC<ColorContainerProp> = ({
  ColorOptionName,
  HexCode,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-5 rounded border-1 border-gray-300"
        style={{ background: HexCode }}
      />
      <span className="text-sm">{ColorOptionName}</span>
    </div>
  );
};

export default ColorContainer;
