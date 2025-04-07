import React from "react";

const InventoryDashboardContainer = () => {
  return (
    <div className="flex items-center gap-5 h-full">
      <div className="w-[70%] bg-white p-4 rounded-lg h-full">
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold">Stock Alert</span>
          <button className="border-1 border-blue-400 text-blue-500 p-1 rounded-lg text-xs">
            View All
          </button>
        </div>
      </div>
      <div className="w-[30%] bg-white p-4 rounded-lg h-full">
        <span className="font-semibold">Inventory Summary</span>
      </div>
    </div>
  );
};

export default InventoryDashboardContainer;
