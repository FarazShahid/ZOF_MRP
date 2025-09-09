import React from 'react';
import { CiSearch, CiCalendar } from "react-icons/ci";
import { MdOutlineFileDownload } from "react-icons/md";
import { FilterState } from '@/src/types/audit';


interface AuditLogFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  filters,
  onFilterChange,
  onExport
}) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className=" border-b border-gray-200 p-6">
      {/* Quick Search */}
      <div className="mb-4">
        <div className="relative">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        {/* Date Range */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <CiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <CiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Module Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
          <select
            value={filters.module}
            onChange={(e) => updateFilter('module', e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Modules</option>
            <option value="Products">Products</option>
            <option value="Orders">Orders</option>
            <option value="Inventory">Inventory</option>
            <option value="Shipments">Shipments</option>
          </select>
        </div>

        {/* Action Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <select
            value={filters.action}
            onChange={(e) => updateFilter('action', e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Actions</option>
            <option value="Created">Created</option>
            <option value="Updated">Updated</option>
            <option value="Deleted">Deleted</option>
            <option value="Status Changed">Status Changed</option>
            <option value="Shipped">Shipped</option>
            <option value="Received">Received</option>
          </select>
        </div>

        {/* User Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
          <input
            type="text"
            placeholder="Filter by user..."
            value={filters.user}
            onChange={(e) => updateFilter('user', e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onExport('csv')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <MdOutlineFileDownload className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <MdOutlineFileDownload className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
};