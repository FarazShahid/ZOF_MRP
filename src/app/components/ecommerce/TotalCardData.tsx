import React, { ReactNode } from "react";


interface TotoalCardDataType {
  name: string;
  icon: ReactNode;
  total: number;
}

const TotalCardData: React.FC<TotoalCardDataType> = ({ name, icon, total }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col justify-between">
      <div className="flex items-center gap-4">
        <div className="border-1 p-1 rounded-full">{icon}</div>
        <h3 className="text-medium font-semibold text-gray-800 dark:text-white/90">
          {name}
        </h3>
      </div>
      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-900">{total}</div>
    </div>
  );
};

export default TotalCardData;
