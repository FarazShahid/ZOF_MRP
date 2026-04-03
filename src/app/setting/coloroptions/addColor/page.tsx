"use client"
import PantoneColorDropdown from "../PantoneColorPicker";

export type PantoneColor = {
  code: string;
  name: string;
  hex: string;
  h: number;
  s: number;
  l: number;
};

const page = () => {

  const handleColorPicker = (selectedColor: PantoneColor) => {
    console.log(selectedColor);
  };

  return (
      <PantoneColorDropdown
            onChange={(color) => handleColorPicker(color)}
          />
  );
};

export default page;
