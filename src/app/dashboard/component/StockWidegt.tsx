"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Progress } from "@heroui/react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StockWidegt = () => {
  const totalProducts = 8572;
  const series = [45, 25, 20, 10];
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
              formatter: () => `${totalProducts.toLocaleString()}`,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
  };

  const stats: {
    label: string;
    count: number;
    color: "success" | "warning" | "danger" | "default" | "primary" | "secondary";
    value: number;
  }[] = [
    { label: "HIGH STOCK PRODUCT", count: 1200, color: "success", value: 70 },
    { label: "NEAR-LOW STOCK PRODUCT", count: 1200, color: "warning", value: 40 },
    { label: "LOW STOCK PRODUCT", count: 1200, color: "danger", value: 18 },
    { label: "OUT OF STOCK PRODUCT", count: 1200, color: "danger", value: 5 },
  ];

  return (
    <div className="bg-gray-950 rounded-lg p-3 shadow-md">
      <span className="text-white">Stock level</span>

      <div className=" text-white p-4 rounded-xl flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex justify-center items-center">
          <Chart
            options={donutOptions}
            series={series}
            type="donut"
            width={320}
          />
        </div>
        <div className="lg:w-1/2 space-y-4">
          {stats.map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xs text-gray-400">{s.label}</p>
              <Progress aria-label="Loading..." className="max-w-md" color={s.color} value={s.value} />
              <p className="text-xs text-white">
                {s.count.toLocaleString()} products
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockWidegt;
