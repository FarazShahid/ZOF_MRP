"use client"

import PantoneColorDropdown from "../PantoneColorPicker";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";

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
    <AdminDashboardLayout>
      <PantoneColorDropdown
            onChange={(color) => handleColorPicker(color)}
          />
    </AdminDashboardLayout>
  );
};

export default page;
