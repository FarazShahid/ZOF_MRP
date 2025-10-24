"use client";

import React, { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import useDashboardReportsStore from "@/store/useDashboardReportsStore";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OrderSummaryChart = () => {
  const summary = useDashboardReportsStore((s) => s?.orderSummaryByMonth);
  const loading = useDashboardReportsStore((s) => s?.loading);
  const fetchOrderSummaryByMonth = useDashboardReportsStore((s) => s?.fetchOrderSummaryByMonth);

  const hasRequested = useRef(false);
  useEffect(() => {
    if (!hasRequested.current && (!summary || summary?.length === 0) && !loading) {
      hasRequested.current = true;
      const year = new Date().getFullYear();
      fetchOrderSummaryByMonth(year);
    }
  }, [summary, loading, fetchOrderSummaryByMonth]);

  const { categories, createdData, shippedData } = useMemo(() => {
    const fallbackMonths = [
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
    ];
    if (!summary || summary?.length === 0) {
      return { categories: fallbackMonths, createdData: Array(12).fill(0), shippedData: Array(12).fill(0) };
    }
    const cats = summary?.map((m) => (m?.monthName?.slice(0, 3) || ""))?.slice(0, 12);
    const created = summary?.map((m) => m?.created)?.slice(0, 12);
    const shipped = summary?.map((m) => m?.shipped)?.slice(0, 12);
    return { categories: cats, createdData: created, shippedData: shipped };
  }, [summary]);

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
      categories,
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
    legend: { show: true, position: "top", labels: { colors: "#CBD5E1" } },
    fill: {
      opacity: 1,
    },
    colors: ["#3B82F6", "#10B981"],
    tooltip: {
      theme: "dark",
    },
    grid: {
      borderColor: "#334155",
    },
  };

  const series = useMemo(
    () => [
      { name: "Created", data: createdData },
      { name: "Shipped", data: shippedData },
    ],
    [createdData, shippedData]
  );

  return (
    <div className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="dark:text-white text-gray-900 font-medium">Orders Summary</span>
          <p className="text-xs text-gray-500">Created vs Fulfilled (range)</p>
        </div>
        <span className="text-xs dark:text-gray-400 text-gray-600">Jan - Dec</span>
      </div>
      {(!summary || summary?.length === 0) && loading ? (
        <div className="animate-pulse h-[420px] rounded-xl bg-gray-100 dark:bg-white/[0.06]" />
      ) : (
        <Chart options={options} series={series} type="bar" height={420} />
      )}
    </div>
  );
};

export default OrderSummaryChart;
