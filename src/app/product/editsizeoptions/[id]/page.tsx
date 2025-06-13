"use client";

import SizeMeasurementForm from "@/src/app/addsize/SizeMeasurementForm";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import { useParams } from "next/navigation";

export default function Profile() {
  const params = useParams();
  const id = params?.id;

  if (!id || typeof id !== "string") {
    return <div>Invalid ID</div>;
  }

  return (
    <AdminDashboardLayout>
      <SizeMeasurementForm sizeId={Number(id)} isEdit={true} />
    </AdminDashboardLayout>
  );
}