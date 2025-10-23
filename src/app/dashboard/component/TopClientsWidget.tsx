import React from "react";
import ViewMoreButton from "./ViewMoreButton";

const clients = [
  { id: 1, name: "CRFC", orders: 182, revenue: 420000 },
  { id: 2, name: "Nike", orders: 96, revenue: 280000 },
  { id: 3, name: "Adidas", orders: 74, revenue: 210000 },
  { id: 4, name: "Puma", orders: 48, revenue: 110000 },
  { id: 5, name: "H&M", orders: 36, revenue: 88000 },
];

const TopClientsWidget: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="dark:text-white text-gray-900 font-medium">Top clients</span>
        <ViewMoreButton path="/clients" />
      </div>
      <div className="space-y-2 h-[290px] overflow-x-auto px-1 pt-1">
        {clients.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl bg-gray-100 p-3 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:ring-white/10">
            <div>
              <p className="dark:text-white text-gray-900 font-medium">{c.name}</p>
              <p className="text-xs text-gray-500"></p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{c.orders} orders</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopClientsWidget;


