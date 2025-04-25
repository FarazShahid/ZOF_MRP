"use client"

import AdminLayout from "@/src/app/adminDashboard/lauout";
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
    <AdminLayout>
      <PantoneColorDropdown
            onChange={(color) => handleColorPicker(color)}
          />
    </AdminLayout>
  );
};

export default page;
