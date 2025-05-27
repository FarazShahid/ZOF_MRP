import React from "react";
import { IoIosRedo, IoIosUndo } from "react-icons/io";

const PercentageWidget = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex items-center gap-1">
      <div
        className={` ${
          percentage > 10 ? " bg-yellow-300" : "bg-red-300 "
        } p-1 rounded`}
      >
        {percentage > 10 ? (
          <IoIosRedo className="text-gray-800" />
        ) : (
          <IoIosUndo className="text-gray-800" />
        )}
      </div>
      <span className="text-sm text-white">{percentage}%</span>
    </div>
  );
};

export default PercentageWidget;
