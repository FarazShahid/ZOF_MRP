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

const TABS: { id: ClientProfileTabType; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "ri-dashboard-line" },
  { id: "contacts", label: "Contacts", icon: "ri-contacts-line" },
  { id: "programs", label: "Programs/Events", icon: "ri-calendar-line" },
  { id: "products", label: "Products", icon: "ri-t-shirt-line" },
  { id: "orders", label: "Orders", icon: "ri-shopping-bag-line" },
  { id: "shipments", label: "Shipments", icon: "ri-truck-line" },
  { id: "files", label: "Files", icon: "ri-folder-line" },
];

interface ClientProfileTabsProps {
  activeTab: ClientProfileTabType;
  onTabChange: (tab: ClientProfileTabType) => void;
}

export default function ClientProfileTabs({
  activeTab,
  onTabChange,
}: ClientProfileTabsProps) {
  return (
    <div className="border-b border-slate-800 mb-8">
      <div className="flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <i
              className={`${tab.icon} mr-2 w-4 h-4 inline-flex items-center justify-center`}
            ></i>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
