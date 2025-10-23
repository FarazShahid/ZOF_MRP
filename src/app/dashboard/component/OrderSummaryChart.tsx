"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OrderSummaryChart = () => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "38%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#CBD5E1",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#CBD5E1",
        },
      },
    },
    legend: { show: false },
    fill: {
      opacity: 1,
    },
    colors: ["#3B82F6"],
    tooltip: {
      theme: "dark",
    },
    grid: {
      borderColor: "#334155",
    },
  };

  const series = [
    {
      name: "Orders Completed",
      data: [15000, 13000, 18000, 17000, 14000],
    },
  ];

  return (
    <div className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="dark:text-white text-gray-900 font-medium">Orders Summary</span>
          <p className="text-xs text-gray-500">Created vs Fulfilled (range)</p>
        </div>
        <span className="text-xs dark:text-gray-400 text-gray-600">Jan - Dec</span>
      </div>
      <Chart options={options} series={series} type="bar" height={420} />
    </div>
  );
};

export default OrderSummaryChart;
