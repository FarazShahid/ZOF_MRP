import { PRIORITY_ENUM } from "@/interface/GetFileType";
import React from "react";
import { FaFlag } from "react-icons/fa6";

const priorityStyles: Record<number, string> = {
  1: "text-red-600", // High
  2: "text-yellow-600", // Normal
  3: "text-green-600", // Low
};

const PriorityChip = ({ priority }: { priority: number }) => {
  const priorityData = PRIORITY_ENUM.find((p) => p.id === priority);
  const colorClass = priorityStyles[priority] || "text-gray-500";

  return (
    <div className={`flex items-center gap-1 text-sm ${colorClass}`}>
      <FaFlag />
      <span>{priorityData?.label || "Unknown"}</span>
    </div>
  );
};

export default PriorityChip;
