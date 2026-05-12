"use client";

import React from "react";

export type ClientProfileTabType =
  | "overview"
  | "contacts"
  | "programs"
  | "products"
  | "orders"
  | "shipments"
  | "files";

export interface ClientProfileTabCounts {
  projects?: number;
  products?: number;
  orders?: number;
  shipments?: number;
}

const TABS: { id: ClientProfileTabType; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "ri-dashboard-line" },
  { id: "contacts", label: "Contacts", icon: "ri-contacts-line" },
  { id: "programs", label: "Projects", icon: "ri-folder-line" },
  { id: "products", label: "Products", icon: "ri-t-shirt-line" },
  { id: "orders", label: "Orders", icon: "ri-shopping-bag-line" },
  { id: "shipments", label: "Shipments", icon: "ri-truck-line" },
  { id: "files", label: "Files", icon: "ri-folder-open-line" },
];

interface ClientProfileTabsProps {
  activeTab: ClientProfileTabType;
  onTabChange: (tab: ClientProfileTabType) => void;
  counts?: ClientProfileTabCounts;
}

export default function ClientProfileTabs({
  activeTab,
  onTabChange,
  counts,
}: ClientProfileTabsProps) {
  const getCount = (tabId: ClientProfileTabType): number | undefined => {
    if (tabId === "programs") return counts?.projects;
    if (tabId === "products") return counts?.products;
    if (tabId === "orders") return counts?.orders;
    if (tabId === "shipments") return counts?.shipments;
    return undefined;
  };

  return (
    <div className="border-b border-slate-800 mb-8">
      <div className="flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const count = getCount(tab.id);
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <i
                className={`${tab.icon} w-4 h-4 inline-flex items-center justify-center`}
              ></i>
              {tab.label}
              {count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-slate-700/80 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
