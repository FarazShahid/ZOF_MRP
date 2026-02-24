"use client";

import React from "react";
import { useParams } from "next/navigation";
import PermissionGuard from "@/src/app/components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import EventDetail from "@/src/components/events/EventDetail";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const eventId = Number(params?.id);

  return (
    <PermissionGuard required={PERMISSIONS_ENUM.EVENTS.VIEW}>
      <EventDetail eventId={eventId} />
    </PermissionGuard>
  );
}
