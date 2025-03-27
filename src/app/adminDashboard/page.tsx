import React from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import OrderWidget from "./components/OrderWidget";
import ClientWidget from "./components/ClientWidget";
import ProductWidget from "./components/ProductWidget";
import InventoryWidget from "./components/InventoryWidget";
import RecentOrders from "./components/RecentOrders";
import InventoryDashboardContainer from "./components/InventoryDashboardContainer";

const page = () => {
  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-5 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <OrderWidget />
          <ProductWidget />
          <ClientWidget />
          <InventoryWidget />
        </div>
        <RecentOrders />
        <InventoryDashboardContainer />
      </div>
    </AdminDashboardLayout>
  );
};

export default page;
