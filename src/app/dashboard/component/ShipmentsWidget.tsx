"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { FiTruck, FiPackage, FiCheckCircle, FiPieChart } from "react-icons/fi";
import ViewMoreButton from "./ViewMoreButton";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";

const ShipmentsWidget: React.FC = () => {
  const summary = useDashboardReportsStore((s) => s.shipmentsSummary);
  const loading = useDashboardReportsStore((s) => s.loading);
  const fetchShipmentsSummary = useDashboardReportsStore((s) => s.fetchShipmentsSummary);

  const hasRequested = useRef(false);
  useEffect(() => {
    if (!hasRequested.current && !summary && !loading) {
      hasRequested.current = true;
      fetchShipmentsSummary();
    }
  }, [summary, loading, fetchShipmentsSummary]);

  const metrics = useMemo(
    () => {
      const pct = summary?.totalShipments
        ? (summary.delivered / summary.totalShipments) * 100
        : null;
      return [
        { label: "Total Shipments", value: summary?.totalShipments ?? "-" },
        { label: "In transit", value: summary?.inTransit ?? "-" },
        { label: "Delivered", value: summary?.delivered ?? "-" },
        { label: "Delivered Percentage", value: pct !== null ? `${pct.toFixed(2)}%` : "-" },
      ];
    },
    [summary]
  );

  const iconFor = (label: string) => {
    switch (label) {
      case "Total Shipments":
        return { node: <FiPackage />, cls: "bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20" };
      case "In transit":
        return { node: <FiTruck />, cls: "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20" };
      case "Delivered":
        return { node: <FiCheckCircle />, cls: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20" };
      default:
        return { node: <FiPieChart />, cls: "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20" };
    }
  };

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gray-100 ring-1 ring-gray-200/60 dark:ring-white/10 dark:bg-white/[0.06]"><FiTruck /></div>
          <span className="dark:text-white text-gray-900 font-medium">Shipments</span>
        </div>
        <ViewMoreButton path="/shipment" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(!summary && loading) ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 p-3 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:ring-white/10 animate-pulse h-[70px]" />
          ))
        ) : (
          metrics.map((m, i) => {
            const ico = iconFor(m.label);
            const isPct = typeof m.value === "string" && m.value.toString().includes("%");
            const pctNum = isPct ? Math.max(0, Math.min(100, parseFloat(m.value as string) || 0)) : 0;
            return (
              <div key={i} className="rounded-xl bg-gray-100 p-3 ring-1 ring-gray-200/60 dark:bg-white/[0.06] dark:ring-white/10">
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-lg ring-1 ${ico.cls}`}>{ico.node}</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{m.label}</p>
                    <p className="text-lg dark:text-white text-gray-900 font-medium">{m.value}</p>
                  </div>
                </div>
                {isPct ? (
                  <div className="mt-2 h-1.5 w-full rounded bg-gray-200 dark:bg-white/10">
                    <div className="h-full rounded bg-violet-500" style={{ width: `${pctNum}%` }} />
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShipmentsWidget;


