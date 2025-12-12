"use client";

import React, { useMemo } from "react";
import { Building2, Package, ShoppingCart, FolderKanban } from "lucide-react";

export type TabType = "overview" | "orders" | "products" | "projects";

interface Props {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
  ordersCount: number;
  productsCount: number;
  projectsCount?: number;
}

const TabsNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  ordersCount,
  productsCount,
  projectsCount = 0,
}) => {
  const tabs = useMemo(() => ([
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "projects", label: `Projects (${projectsCount})`, icon: FolderKanban },
    { id: "orders", label: `Orders (${ordersCount})`, icon: ShoppingCart },
    { id: "products", label: `Products (${productsCount})`, icon: Package },
  ]), [ordersCount, productsCount, projectsCount]);

	return (
		<div className="border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-slate-900/60">
			<nav className="flex -mb-px overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
						className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === (tab.id as TabType)
								? "border-blue-600 text-blue-700 dark:text-blue-300 bg-blue-50/40 dark:bg-slate-800/40"
								: "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabsNav;


