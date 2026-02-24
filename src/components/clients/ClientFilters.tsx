"use client";

import React from "react";

interface ClientFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 mb-6 border border-slate-800">
      <div className="grid grid-cols-3 gap-4">
        <div className="relative col-span-2">
          <input
            type="text"
            placeholder="Search by business name, POC, email, or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 text-slate-300 text-sm px-4 py-2.5 pl-10 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 flex items-center justify-center"></i>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="bg-slate-800 text-slate-300 text-sm px-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default ClientFilters;
