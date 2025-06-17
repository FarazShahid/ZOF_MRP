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
    <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-[#1d2939] dark:bg-white/[0.03] shadow-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="dark:bg-[#353535] bg-gray-300 rounded-xl p-2">{icon}</div>
        <PercentageWidget percentage={percentage} />
      </div>
      <span className="text-gray-500 uppercase">{title}</span>
      <span className="dark:text-white text-gray-800 text-3xl">{number}</span>
    </div>
  );
};

export default Widget;
