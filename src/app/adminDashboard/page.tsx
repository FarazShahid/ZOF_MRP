import React from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import RecentOrders from "./components/RecentOrders";
import InventoryDashboardContainer from "./components/InventoryDashboardContainer";
import DashboardWidgetContainer from "./components/DashboardWidgetContainer";

const page = () => {
  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-5 h-full">
        <DashboardWidgetContainer />
        <RecentOrders />
        <InventoryDashboardContainer />
      </div>
    </AdminDashboardLayout>
  );
};

export default page;
