import React from "react";
import { FiFileText, FiFilter, FiLayers } from "react-icons/fi";

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
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <FiFileText className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLogsLength}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Total Logs</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <FiFilter className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredLogsLength}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Filtered Results</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
            <FiLayers className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentPage}<span className="text-xl font-bold text-cyan-500 mx-2">/</span>{totalPages}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Current Page</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogStats;
