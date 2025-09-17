import React from "react";
import { FiFileText } from "react-icons/fi";

interface StatProps {
  totalLogsLength: number;
  filteredLogsLength: number;
  currentPage: number;
  totalPages: number;
}

const AuditLogStats: React.FC<StatProps> = ({
   totalLogsLength,
  filteredLogsLength,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-blue-50 dark:bg-blue-100 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <FiFileText className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Total Logs</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalLogsLength}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div>
            <p className="text-sm font-medium text-green-900">
              Filtered Results
            </p>
            <p className="text-2xl font-bold text-green-600">
              {filteredLogsLength}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <div>
            <p className="text-sm font-medium text-orange-900">Current Page</p>
            <p className="text-2xl font-bold text-orange-600">
              {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogStats;
