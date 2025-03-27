import React from "react";
import { IoShirt } from "react-icons/io5";

const ProductWidget = () => {
  return (
    <div className="bg-white p-5 flex flex-col gap-2 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Total Products</span>
        <div className="bg-blue-600 rounded-full text-white p-2">
          <IoShirt />
        </div>
      </div>
      <div className="font-semibold text-4xl text-[#9747FF] font-mono">
        1500
      </div>
    </div>
  );
};

export default ProductWidget;
