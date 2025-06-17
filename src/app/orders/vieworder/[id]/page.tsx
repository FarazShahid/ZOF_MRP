"use client";

import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import { useParams } from "next/navigation";
import ViewOrderDetails from "../../components/ViewOrderDetails";

export default function Profile() {
  const params = useParams();
  const id = params?.id;

  if (!id || typeof id !== "string") {
    return <div>Invalid order ID</div>;
  }

  return (
    <AdminDashboardLayout>
      <ViewOrderDetails orderId={Number(id)} />
    </AdminDashboardLayout>
  );
}