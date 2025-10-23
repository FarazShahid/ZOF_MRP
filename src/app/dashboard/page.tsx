"use client";

import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import StockWidegt from "./component/StockWidegt";
import ProductWidget from "./component/ProductWidget";
import OrderSummaryChart from "./component/OrderSummaryChart";
import KpiTiles from "./component/KpiTiles";
import OrderStatusDonut from "./component/OrderStatusDonut";
import LateOrdersTable from "./component/LateOrdersTable";
import ShipmentsWidget from "./component/ShipmentsWidget";
import TopClientsWidget from "./component/TopClientsWidget";

const page = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <AdminDashboardLayout>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h6 className="dark:text-white text-gray-800 text-xl font-semibold">Dashboard</h6>
        </div>
        <KpiTiles />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="col-span-1 md:col-span-2 lg:col-span-8">
            <OrderSummaryChart />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <OrderStatusDonut />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="col-span-1 md:col-span-2 lg:col-span-8">
            <LateOrdersTable />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <ShipmentsWidget />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-3">
          <div className="col-span-1 md:col-span-1 lg:col-span-4">
            <TopClientsWidget />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-4">
            <ProductWidget loading={loading} />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-4">
            <StockWidegt />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default page;
