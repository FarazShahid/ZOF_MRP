"use client";

import React from "react";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  clientFilter: string;
  onClientFilterChange: (value: string) => void;
  clients: { Id: number; Name: string }[];
}

const EventFilters: React.FC<EventFiltersProps> = ({
  searchQuery,
  onSearchChange,
  clientFilter,
  onClientFilterChange,
  clients,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 mb-6 border border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Search events by name, client, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 text-slate-300 text-sm px-4 py-2.5 pl-10 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 flex items-center justify-center"></i>
        </div>

        <select
          value={clientFilter}
          onChange={(e) => onClientFilterChange(e.target.value)}
          className="bg-slate-800 text-slate-300 text-sm px-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="all">All Clients</option>
          {clients?.map((c) => (
            <option key={c.Id} value={String(c.Id)}>
              {c.Name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventFilters;
