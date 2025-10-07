import React from "react";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import { AdminSettings } from "../components/admin/AdminSettings";

const page = () => {
  return (
    <AdminDashboardLayout>
         <AdminSettings />
    </AdminDashboardLayout>
  );
};

export default page;
