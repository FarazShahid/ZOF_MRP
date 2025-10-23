"use client";

import React from "react";
import { FiClock, FiGrid, FiActivity } from "react-icons/fi";

type TimeRange = "7d" | "30d" | "90d" | "365d";

export interface DashboardFilters {
  timeRange: TimeRange;
  segment: "all" | "client" | "product" | "region" | "carrier";
  status: "all" | "open" | "in_progress" | "closed";
}

interface GlobalFiltersProps {
  filters: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
}

type Option<T extends string> = { key: T; label: string };

const ranges: Option<TimeRange>[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "365d", label: "1y" },
];

const segments: Option<DashboardFilters["segment"]>[] = [
  { key: "all", label: "All" },
  { key: "client", label: "Client" },
  { key: "product", label: "Product" },
  { key: "region", label: "Region" },
  { key: "carrier", label: "Carrier" },
];

const statuses: Option<DashboardFilters["status"]>[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In progress" },
  { key: "closed", label: "Closed" },
];

function Segmented<T extends string>(props: {
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
}) {
  const { value, options, onChange } = props;
  return (
    <div className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-gray-100/70 ring-1 ring-gray-200/60 dark:bg-white/[0.04] dark:ring-white/10">
      {options.map((opt) => (
        <button
          key={opt.key}
          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
            value === opt.key
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/80 dark:bg-white/[0.10] dark:text-white dark:ring-white/20"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-300"
          }`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const ChipLabel: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:text-gray-300 dark:ring-white/10">
    <span className="opacity-80">{icon}</span>
    {text}
  </span>
);

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="flex items-center gap-3">
          <ChipLabel icon={<FiClock />} text="Time range" />
          <Segmented
            value={filters.timeRange}
            options={ranges}
            onChange={(timeRange) => onChange({ ...filters, timeRange })}
          />
        </div>
        <div className="flex items-center gap-3">
          <ChipLabel icon={<FiGrid />} text="Segment" />
          <Segmented
            value={filters.segment}
            options={segments}
            onChange={(segment) => onChange({ ...filters, segment })}
          />
        </div>
        <div className="flex items-center gap-3">
          <ChipLabel icon={<FiActivity />} text="Status" />
          <Segmented
            value={filters.status}
            options={statuses}
            onChange={(status) => onChange({ ...filters, status })}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalFilters;


