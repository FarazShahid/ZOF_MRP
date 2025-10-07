import React from "react";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import { AuditLogs } from "../components/auditlog/AuditLogs";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.AUDIT_LOGS.VIEW}>
        <AuditLogs />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
