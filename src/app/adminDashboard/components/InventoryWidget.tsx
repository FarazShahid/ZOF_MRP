import React from "react";
import { FaWarehouse } from "react-icons/fa";

const InventoryWidget = () => {
  return (
    <div className="bg-white p-5 flex flex-col gap-2 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Inventory</span>
        <div className="bg-[#138c9f] rounded-full text-white p-2">
          <FaWarehouse />
        </div>
      </div>
      <div className="font-semibold text-4xl text-[#9747FF] font-mono">100</div>
    </div>
  );
};

export default InventoryWidget;
