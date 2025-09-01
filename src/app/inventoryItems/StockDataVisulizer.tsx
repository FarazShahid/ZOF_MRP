"use client";

import React, { useEffect, useMemo } from "react";
import { GoDotFill } from "react-icons/go";
import useInventoryItemsStore from "@/store/useInventoryItemsStore";

interface ChipProps {
  stock: number;
  reorderLevel: string | number;
  itemCode: string;
}

const StockDataVisulizer: React.FC<ChipProps> = ({
  stock,
  reorderLevel,
  itemCode,
}) => {
  const reorder = Number(reorderLevel);
  const stockInt = Number(String(stock).split(".")[0]);

  // Zustand methods
  const updateStockLevelStatus = useInventoryItemsStore(
    (state) => state.updateStockLevelStatus
  );
  const currentStatus = useInventoryItemsStore(
    (state) => state.stockStatusMap[itemCode]
  );

  // Memoize the calculated status
  const { stockClass, stockStatus } = useMemo<{
    stockClass: string;
    stockStatus: "low" | "normal" | "high";
  }>(() => {
    if (stockInt < reorder) {
      return { stockClass: "lowStock", stockStatus: "low" };
    }
    if (stockInt === reorder) {
      return { stockClass: "warningStock", stockStatus: "normal" };
    }
    return { stockClass: "highStock dark:text-green-900", stockStatus: "high" };
  }, [stockInt, reorder]);

  // Determine tooltip message
  const tooltipMessage = useMemo(() => {
    switch (stockStatus) {
      case "low":
        return <GoDotFill className="text-red-600" size={30} />;
      case "normal":
        return <GoDotFill className="text-yellow-600" size={30} />;
      case "high":
        return <GoDotFill className="text-green-600" size={30} />;
      default:
        return "";
    }
  }, [stockStatus]);

  // Only update Zustand store if the status has changed
  useEffect(() => {
    if (currentStatus !== stockStatus) {
      updateStockLevelStatus(itemCode, stockStatus);
    }
  }, [currentStatus, itemCode, stockStatus, updateStockLevelStatus]);

  return (
    <div className="flex items-center justify-center">
      {tooltipMessage}
    </div>
  );
};

export default StockDataVisulizer;
