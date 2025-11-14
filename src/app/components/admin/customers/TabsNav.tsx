"use client";

import React, { useMemo } from "react";
import { Building2, Package, ShoppingCart } from "lucide-react";

export type TabType = "overview" | "orders" | "products";

interface Props {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
  ordersCount: number;
  productsCount: number;
}

const TabsNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  ordersCount,
  productsCount,
}) => {
  const tabs = useMemo(() => ([
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "orders", label: `Orders (${ordersCount})`, icon: ShoppingCart },
    { id: "products", label: `Products (${productsCount})`, icon: Package },
  ]), [ordersCount, productsCount]);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === (tab.id as TabType)
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
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


