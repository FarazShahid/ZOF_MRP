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
        columnWidth: "40%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
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
    legend: {
      show: false,
    },
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
    <div className="bg-gray-900 p-4 rounded-xl shadow-md text-white">
      <div className="flex justify-between items-center mb-4">
        <span className="text-white">Orders Summary</span>
        <span className="text-sm text-gray-400">Jan - Dec</span>
      </div>
      <Chart options={options} series={series} type="bar" height={420} />
    </div>
  );
};

export default OrderSummaryChart;
