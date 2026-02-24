import React from "react";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import Events from "@/src/components/events/Events";

export default function EventsPage() {
  return (
    <PermissionGuard required={PERMISSIONS_ENUM.EVENTS.VIEW}>
      <Events />
    </PermissionGuard>
  );
}
