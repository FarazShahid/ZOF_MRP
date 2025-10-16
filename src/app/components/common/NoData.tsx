import React from "react";
import { Inbox } from "lucide-react";

interface NoDataProps {
  title?: string;
  message?: string;
  className?: string;
}

const NoData: React.FC<NoDataProps> = ({
  title = "No data found",
  message = "Try adjusting your filters or create a new item.",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 ${className}`}>
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-slate-700 mb-3">
        <Inbox className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{message}</p>
      )}
    </div>
  );
};

export default NoData;


