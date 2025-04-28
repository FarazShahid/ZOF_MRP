import React from "react";
import RecentOrders from "./components/RecentOrders";
import AdminLayout from "./lauout";
import { EcommerceMetrics } from "../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../components/ecommerce/StatisticsChart";



const page = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>
        <div className="col-span-12">
          <StatisticsChart />
        </div>
        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </AdminLayout>
  );
};

export default page;
