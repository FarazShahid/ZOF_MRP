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
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm hover:shadow-lg transition-shadow flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="rounded-xl p-2 bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-gray-200 ring-1 ring-gray-200/60 dark:ring-white/10">
          {icon}
        </div>
        <PercentageWidget percentage={percentage} />
      </div>
      <span className="text-xs tracking-wide text-gray-500 uppercase">
        {title}
      </span>
      <span className="dark:text-white text-gray-900 text-3xl font-semibold">{number}</span>
    </div>
  );
};

export default Widget;
