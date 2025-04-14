"use client";
import React, { useEffect, useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartTab from "../common/ChartTab";
import dayjs from "dayjs";
import useInventoryTransection from "@/store/useInventoryTransection";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const {
    loading,
    fetchInventoryTransactions,
    inventoryTransactions,
  } = useInventoryTransection();

  useEffect(() => {
    fetchInventoryTransactions();
  }, []);

  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const { series, categories } = useMemo(() => {
    const groupedData: Record<
      string,
      {
        IN: number;
        OUT: number;
        PRODUCTION: number;
        "Opening Balance": number;
        Disposal: number;
      }
    > = {};

    inventoryTransactions.forEach((txn) => {
      const month = dayjs(txn.TransactionDate).format("MMM");

      if (!groupedData[month]) {
        groupedData[month] = {
          IN: 0,
          OUT: 0,
          PRODUCTION: 0,
          "Opening Balance": 0,
          Disposal: 0,
        };
      }

      const txnType = txn.TransactionType as keyof typeof groupedData[string];
      groupedData[month][txnType] += parseFloat(txn.Quantity);
    });

    return {
      categories: allMonths,
      series: [
        { name: "IN", data: allMonths.map((m) => groupedData[m]?.IN || 0) },
        { name: "OUT", data: allMonths.map((m) => groupedData[m]?.OUT || 0) },
        { name: "PRODUCTION", data: allMonths.map((m) => groupedData[m]?.PRODUCTION || 0) },
        { name: "Opening Balance", data: allMonths.map((m) => groupedData[m]?.["Opening Balance"] || 0) },
        { name: "Disposal", data: allMonths.map((m) => groupedData[m]?.Disposal || 0) },
      ],
    };
  }, [inventoryTransactions]);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3B82F6", "#EF4444", "#10B981", "#FBBF24", "#6366F1"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Transations Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Inventory transactions grouped by month
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
