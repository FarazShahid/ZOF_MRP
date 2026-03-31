// /components/audit/AuditLogFilters.tsx
import React from "react";
import { CiSearch, CiCalendar } from "react-icons/ci";
import { FilterState } from "@/src/types/audit";

interface AuditLogFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  moduleOptions: string[];
  actionOptions: string[];
}

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  filters,
  onFilterChange,
  moduleOptions,
  actionOptions,
}) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="px-6 pb-4">
      {/* Quick Search */}
      <div className="mb-4">
        <div className="relative">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Date Range */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <CiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) =>
                  updateFilter("dateRange", { ...filters.dateRange, start: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <div className="relative">
              <CiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) =>
                  updateFilter("dateRange", { ...filters.dateRange, end: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Module Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Module</label>
          <select
            value={filters.module}
            onChange={(e) => updateFilter("module", e.target.value)}
            className="w-full py-2 px-3 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            <option value="">All Modules</option>
            {moduleOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Action Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Action</label>
          <select
            value={filters.action}
            onChange={(e) => updateFilter("action", e.target.value)}
            className="w-full py-2 px-3 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            <option value="">All Actions</option>
            {actionOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* User Filter (matches Email) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">User (Email)</label>
          <input
            type="text"
            placeholder="Filter by user email..."
            value={filters.user}
            onChange={(e) => updateFilter("user", e.target.value)}
            className="w-full py-2 px-3 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
