"use client";

import React, { useEffect, useMemo } from "react";
import useInventoryItemsStore from "@/store/useInventoryItemsStore";
import { Tooltip } from "@heroui/react";

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
    return { stockClass: "highStock", stockStatus: "high" };
  }, [stockInt, reorder]);


  // Determine tooltip message
  const tooltipMessage = useMemo(() => {
    switch (stockStatus) {
      case "low":
        return "❗ Danger: Stock is below reorder level!";
      case "normal":
        return "⚠️ Warning: Stock is at reorder level.";
      case "high":
        return "✅ Stock level is healthy.";
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
    <Tooltip content={tooltipMessage}>
      <div className={`${stockClass} stockDataShip cursor-pointer`}>{stock}</div>
    </Tooltip>
  );
};

export default StockDataVisulizer;
