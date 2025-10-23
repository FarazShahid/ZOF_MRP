import React from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const PercentageWidget = ({ percentage }: { percentage: number }) => {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ring-1 ${
      percentage >= 0
        ? "bg-green-50 text-green-700 ring-green-200 dark:bg-white/[0.06] dark:text-green-300 dark:ring-white/10"
        : "bg-red-50 text-red-700 ring-red-200 dark:bg-white/[0.06] dark:text-red-300 dark:ring-white/10"
    }`}>
      {percentage >= 0 ? (
        <IoIosArrowUp className="h-3 w-3" />
      ) : (
        <IoIosArrowDown className="h-3 w-3" />
      )}
      <span>{Math.abs(percentage)}%</span>
    </div>
  );
};

export default PercentageWidget;
