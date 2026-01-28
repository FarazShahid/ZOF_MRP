"use client";

import React, { useMemo } from "react";
import { Building2, Package, ShoppingCart, FolderKanban } from "lucide-react";
import TabActionButton from "./TabActionButton";

export type TabType = "overview" | "orders" | "products" | "projects";

interface Props {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
  ordersCount: number;
  productsCount: number;
  projectsCount?: number;
  actionButton?: React.ReactNode;
}

const TabsNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  ordersCount,
  productsCount,
  projectsCount = 0,
  actionButton,
}) => {
  const tabs = useMemo(() => ([
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "projects", label: `Projects (${projectsCount})`, icon: FolderKanban },
    { id: "products", label: `Products (${productsCount})`, icon: Package },
    { id: "orders", label: `Orders (${ordersCount})`, icon: ShoppingCart },
    
  ]), [ordersCount, productsCount, projectsCount]);

	return (
    <div className="border-b border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <div className="flex items-center justify-between -mb-px px-1">
        <nav className="flex overflow-x-auto flex-1 gap-1 py-3">
          {tabs.map((tab) => {
            const isActive = activeTab === (tab.id as TabType);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        {actionButton && (
          <div className="px-2 py-1 flex-shrink-0">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
};

export { TabActionButton };
export default TabsNav;




