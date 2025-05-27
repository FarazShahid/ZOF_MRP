"use client";

import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import StockWidegt from "./component/StockWidegt";
import ProductWidget from "./component/ProductWidget";
import DashboardCardWidgets from "./component/DashboardCardWidgets";
import ActiveOrders from "./component/ActiveOrders";
import OrderSummaryChart from "./component/OrderSummaryChart";

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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h6 className="text-white text-xl font-semibold">Dashboard</h6>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-8">
            <StockWidegt />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <ProductWidget loading={loading} />
          </div>
        </div>
        <DashboardCardWidgets loading={loading} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-6">
            <ActiveOrders />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-6">
            <OrderSummaryChart />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default page;
