"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OrderStatusDonut: React.FC = () => {
  const labels = ["New", "In Production", "QA", "Ready", "Shipped", "Delivered"];
  const series = [24, 38, 12, 8, 10, 56];

  const options: ApexOptions = {
    chart: { type: "donut", background: "transparent" },
    labels,
    legend: { show: true, position: "bottom", labels: { colors: "#CBD5E1" } },
    colors: ["#60a5fa", "#f59e0b", "#22c55e", "#a78bfa", "#f97316", "#10b981"],
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
      <Chart options={options} series={series} type="donut" height={360} />
    </div>
  );
};

export default OrderStatusDonut;


