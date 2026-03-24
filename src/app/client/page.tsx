import React from "react";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import CustomersModule from "../components/admin/customers/CustomersModule";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.CLIENTS.VIEW}>
        <CustomersModule />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;


