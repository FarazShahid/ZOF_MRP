import React from "react";
import RecentOrders from "./components/RecentOrders";
import { EcommerceMetrics } from "../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../components/ecommerce/MonthlyTarget";
import StatisticsChart from "../components/ecommerce/StatisticsChart";
import AdminLayout from "./lauout";


const page = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
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
