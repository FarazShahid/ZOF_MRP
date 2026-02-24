"use client";

import React from "react";
import { useParams } from "next/navigation";
import PermissionGuard from "@/src/app/components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import ClientProfile from "@/src/components/clients/ClientProfile";

export default function ClientProfilePage() {
  const params = useParams<{ id: string }>();
  const clientId = Number(params?.id);

  return (
    <PermissionGuard required={PERMISSIONS_ENUM.CLIENTS.VIEW}>
      <div className="max-w-7xl mx-auto">
        <ClientProfile clientId={clientId} />
      </div>
    </PermissionGuard>
  );
}
