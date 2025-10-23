import React from "react";
import { FiTruck } from "react-icons/fi";
import ViewMoreButton from "./ViewMoreButton";

const exceptions = [
  { id: 1, carrier: "DHL", tracking: "DH12345", issue: "Delayed", days: 2 },
  { id: 2, carrier: "FedEx", tracking: "FX99881", issue: "Pickup failed", days: 1 },
  { id: 3, carrier: "UPS", tracking: "UP44421", issue: "Customs hold", days: 3 },
];

const ShipmentsWidget: React.FC = () => {
  const metrics = [
    { label: "To ship today", value: 24 },
    { label: "In transit", value: 118 },
    { label: "Delivered (range)", value: 176 },
    { label: "On-time delivery", value: "95%" },
  ];

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gray-100 ring-1 ring-gray-200/60 dark:ring-white/10 dark:bg-white/[0.06]"><FiTruck /></div>
          <span className="dark:text-white text-gray-900 font-medium">Shipments</span>
        </div>
        <ViewMoreButton path="/shipments" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-xl bg-gray-100 p-3 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:ring-white/10">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg dark:text-white text-gray-900 font-medium">{m.value}</p>
          </div>
        ))}
      </div>
      {/* <div>
        <p className="text-sm text-gray-500 mb-2">Exceptions</p>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {exceptions.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-xl bg-gray-100 p-2 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:ring-white/10">
              <div className="text-sm dark:text-white text-gray-900">
                <span className="font-medium">{e.carrier}</span> · {e.tracking}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-white/[0.06] dark:text-red-300 dark:ring-white/10">{e.issue}</span>
                <span className="text-gray-500">{e.days}d</span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ShipmentsWidget;


