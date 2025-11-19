import React from "react";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import OrderForm from "../components/OrderForm";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../../components/auth/PermissionGaurd";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.ORDER.ADD}>
        <OrderForm />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
