"use client";

import React from "react";
import { useParams } from "next/navigation";
import ShipmentForm from "../../components/ShipmentForm";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";

const page = () => {
  const params = useParams();
  const id = params?.id;

  if (!id || typeof id !== "string") {
    return <div>Invalid Shipment ID</div>;
  }

  return (
    <AdminDashboardLayout>
      <ShipmentForm shipmentId={id} />
    </AdminDashboardLayout>
  );
};

export default page;
