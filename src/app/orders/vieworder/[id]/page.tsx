"use client";

import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import { useParams } from "next/navigation";
import ViewOrderDetails from "../../components/ViewOrderDetails";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../../../components/auth/PermissionGaurd";

export default function Profile() {
  const params = useParams();
  const id = params?.id;

  if (!id || typeof id !== "string") {
    return <div>Invalid order ID</div>;
  }

  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.ORDER.VIEW}>
        <ViewOrderDetails orderId={Number(id)} />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
}