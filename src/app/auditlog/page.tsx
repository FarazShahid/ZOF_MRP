import React from "react";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import { AuditLogs } from "../components/auditlog/AuditLogs";
const page = () => {
  return (
    <AdminDashboardLayout>
      <AuditLogs />
    </AdminDashboardLayout>
  );
};

export default page;
