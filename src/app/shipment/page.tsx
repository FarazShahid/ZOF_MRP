import React from "react";
import ShipmentModule from "../components/shipment/ShipmentModule";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.SHIPMENT.VIEW}>
        <ShipmentModule />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
