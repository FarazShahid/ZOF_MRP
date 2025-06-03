"use client";

import { useParams } from "next/navigation";
import SizeMeasurementForm from "../../addsize/SizeMeasurementForm";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";

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
