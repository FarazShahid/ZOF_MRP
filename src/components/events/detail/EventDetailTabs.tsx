"use client";

import React from "react";

export type EventDetailTabType = "orders" | "products" | "files" | "activity";

const TABS: {
  id: EventDetailTabType;
  label: string;
  icon: string;
  count?: number;
}[] = [
  { id: "orders", label: "Linked Orders", icon: "ri-shopping-bag-line" },
  { id: "products", label: "Linked Products", icon: "ri-box-3-line" },
  { id: "files", label: "Files", icon: "ri-folder-line" },
  { id: "activity", label: "Activity Log", icon: "ri-history-line" },
];

interface EventDetailTabsProps {
  activeTab: EventDetailTabType;
  onTabChange: (tab: EventDetailTabType) => void;
  counts?: Partial<Record<EventDetailTabType, number>>;
}

export default function EventDetailTabs({
  activeTab,
  onTabChange,
  counts = {},
}: EventDetailTabsProps) {
  return (
    <div className="flex items-center gap-1 mb-6 bg-slate-900 rounded-xl p-1 border border-slate-800 w-fit overflow-x-auto">
      {TABS.map((tab) => {
        const count = counts[tab.id] ?? 0;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`}></i>
            {tab.label}
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-blue-500/40 text-blue-100"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
