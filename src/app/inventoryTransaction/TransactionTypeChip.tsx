import { TRANSACTION_TYPES } from "@/store/useInventoryTransection";
import React from "react";


const colors = ["#80ff80", "#EF4444", "#009900", "#FBBF24", "#ff7800"];

interface TransactionTypeChipProps {
  type: string;
}

const TransactionTypeChip: React.FC<TransactionTypeChipProps> = ({ type }) => {
  const index = TRANSACTION_TYPES.findIndex((t) => t.value === type);

  if (index === -1) {
    return (
      <span className="px-2 py-1 border border-gray-400 rounded-full text-gray-600 text-sm">
        Unknown
      </span>
    );
  }

  const color = colors[index];
  const label = TRANSACTION_TYPES[index].label;

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium uppercase"
      style={{
        border: `1px solid ${color}`,
        color: color,
      }}
    >
      {label}
    </span>
  );
};

export default TransactionTypeChip;
