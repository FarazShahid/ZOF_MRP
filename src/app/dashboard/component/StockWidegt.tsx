"use client";

import React, { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Progress } from "@heroui/react";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StockWidegt = () => {
  const stockLevels = useDashboardReportsStore((s) => s.stockLevels);
  const loading = useDashboardReportsStore((s) => s.loading);
  const fetchStockLevels = useDashboardReportsStore((s) => s.fetchStockLevels);

  const hasRequested = useRef(false);
  useEffect(() => {
    if (!hasRequested.current && !stockLevels && !loading) {
      hasRequested.current = true;
      fetchStockLevels();
    }
  }, [stockLevels, loading, fetchStockLevels]);

  const summary = stockLevels?.summary;
  const counts = {
    high: summary?.highInStock ?? 0,
    nearLow: summary?.nearLow ?? 0,
    low: summary?.lowStock ?? 0,
    out: summary?.outOfStock ?? 0,
  };

  const totalProducts = counts.high + counts.nearLow + counts.low + counts.out;
  const series = [counts.high, counts.nearLow, counts.low, counts.out];
  const labels = ["High", "Near-Low", "Low", "Out"];

  const donutOptions: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    labels,
    legend: { show: false },
    colors: ["#22c55e", "#eab308", "#facc15", "#ef4444"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Active Product",
              fontSize: "14px",
              color: "#ffffff",
              formatter: () => `${(totalProducts || 0).toLocaleString()}`,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
  };

  const stats = useMemo(
    () => [
      {
        label: "HIGH STOCK PRODUCT",
        count: counts.high,
        color: "success" as const,
        value: totalProducts > 0 ? Math.round((counts?.high / totalProducts) * 100) : 0,
      },
      {
        label: "NEAR-LOW STOCK PRODUCT",
        count: counts.nearLow,
        color: "warning" as const,
        value: totalProducts > 0 ? Math.round((counts?.nearLow / totalProducts) * 100) : 0,
      },
      {
        label: "LOW STOCK PRODUCT",
        count: counts.low,
        color: "danger" as const,
        value: totalProducts > 0 ? Math.round((counts?.low / totalProducts) * 100) : 0,
      },
      {
        label: "OUT OF STOCK PRODUCT",
        count: counts.out,
        color: "danger" as const,
        value: totalProducts > 0 ? Math.round((counts?.out / totalProducts) * 100) : 0,
      },
    ],
    [counts.high, counts.nearLow, counts.low, counts.out, totalProducts]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-[#1d2939] dark:bg-white/[0.03] shadow-md">
      <span className="dark:text-white text-gray-900">Stock level</span>
      <div className=" dark:text-white text-gray-800 p-4 rounded-xl flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex justify-center items-center">
          {(!stockLevels && loading) ? (
            <div className="w-[320px] h-[320px] rounded-full bg-gray-100 dark:bg-white/[0.06] animate-pulse" />
          ) : (
            <Chart
              options={donutOptions}
              series={series}
              type="donut"
              width={320}
            />
          )}
        </div>
        <div className="lg:w-1/2 space-y-4">
          {(!stockLevels && loading) ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="w-40 h-3 rounded bg-gray-100 dark:bg-white/[0.06] animate-pulse" />
                <div className="h-2 rounded bg-gray-100 dark:bg-white/[0.06] animate-pulse" />
                <div className="w-24 h-3 rounded bg-gray-100 dark:bg.white/[0.06] animate-pulse" />
              </div>
            ))
          ) : (
            stats?.map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="text-xs text-gray-400">{s.label}</p>
                <Progress aria-label="Loading..." className="max-w-md" color={s.color} value={s.value} />
                <p className="text-xs text-white">
                  {s.count.toLocaleString()} products
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StockWidegt;
