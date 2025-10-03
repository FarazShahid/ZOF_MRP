import React from "react";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import { AdminSettings } from "../components/admin/AdminSettings";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.ADMIN_SETTING.VIEW}>
        <AdminSettings />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
