"use client";

import React, { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OrderStatusDonut: React.FC = () => {
  const summary = useDashboardReportsStore((s) => s.orderStatusSummary);
  const loading = useDashboardReportsStore((s) => s.loading);
  const fetchOrderStatusSummary = useDashboardReportsStore((s) => s.fetchOrderStatusSummary);

  const hasRequested = useRef(false);
  useEffect(() => {
    if (!hasRequested.current && (!summary || summary?.length === 0) && !loading) {
      hasRequested.current = true;
      fetchOrderStatusSummary();
    }
  }, [summary, loading, fetchOrderStatusSummary]);

  const { labels, series, colors } = useMemo(() => {
    const basePalette: Record<string, string> = {
      Pending: "#f59e0b",
      Production: "#60a5fa",
      "In Production": "#60a5fa",
      Packing: "#a78bfa",
      "Kept in Stock": "#f97316",
      Shipped: "#10b981",
      Delivered: "#22c55e",
      QA: "#eab308",
      Ready: "#3b82f6",
    };

    const lbls = (summary ?? [])?.map((s) => s?.statusName);
    const sers = (summary ?? [])?.map((s) => s?.count);
    const cols = lbls?.map((name) => basePalette[name] || "#94a3b8");
    return { labels: lbls, series: sers, colors: cols };
  }, [summary]);

  const options: ApexOptions = {
    chart: { type: "donut", background: "transparent" },
    labels,
    legend: { show: true, position: "bottom", labels: { colors: "#CBD5E1" } },
    colors,
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: { show: true, total: { show: true, label: "Orders", fontSize: "14px", color: "#ffffff" } },
        },
      },
    },
    tooltip: { theme: "dark" },
    grid: { borderColor: "#334155" },
  };

  return (
    <div className="h-full p-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="dark:text-white text-gray-900 font-medium">Orders by Status</span>
          <p className="text-xs text-gray-500">Distribution across lifecycle</p>
        </div>
      </div>
      {(!summary || summary?.length === 0) && loading ? (
        <div className="animate-pulse h-[360px] rounded-xl bg-gray-100 dark:bg-white/[0.06]" />
      ) : (
        <Chart options={options} series={series?.length ? series : [1]} type="donut" height={360} />
      )}
    </div>
  );
};

export default OrderStatusDonut;


