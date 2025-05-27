import React, { FC } from "react";
import PercentageWidget from "./PercentageWidget";

interface WidgetProps {
  icon: React.ReactNode;
  percentage: number;
  title: string;
  number: string;
}

const Widget: FC<WidgetProps> = ({ icon, percentage, title, number }) => {
  return (
    <div className="bg-gray-950 rounded-lg p-4 shadow-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="bg-gray-800 rounded-xl p-2">{icon}</div>
        <PercentageWidget percentage={percentage} />
      </div>
      <span className="text-gray-500 uppercase">{title}</span>
      <span className="text-white text-3xl">{number}</span>
    </div>
  );
};

export default Widget;
