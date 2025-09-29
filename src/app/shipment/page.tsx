import React from "react";
import ShipmentModule from "../components/shipment/ShipmentModule";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";

const page = () => {
  return (
    <AdminDashboardLayout>
      <ShipmentModule />
    </AdminDashboardLayout>
  );
};

export default page;
