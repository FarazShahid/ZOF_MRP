"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "./Sidebar";
import { ActiveModule } from "@/src/types/admin";
import { TableSkel } from "../ui/Skeleton/TableSkel";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import usePermissionStore from "@/store/usePermissionStore";

// lazy load
const UsersModule = dynamic(() => import("./users/UsersModule"), {
  loading: () => <TableSkel />,
});
const EventsModule = dynamic(() => import("./events/EventsModule"), {
  ssr: false,
  loading: () => <TableSkel />,
});
const CarriorTable = dynamic(
  () => import("../../shipment/carrior/components/CarriorTable"),
  {
    ssr: false,
    loading: () => <TableSkel />,
  }
);
const RoleModule = dynamic(() => import("./roles/RoleModule"), {
  ssr: false,
  loading: () => <TableSkel />,
});

// Define module order and their required view permissions
const MODULE_ORDER: ActiveModule[] = [
  "users",
  "events",
  "carriers",
  "roles",
];

const MODULE_PERMISSION_MAP: Record<ActiveModule, number> = {
  users: PERMISSIONS_ENUM.USERS.VIEW,
  events: PERMISSIONS_ENUM.EVENTS.VIEW,
  carriers: PERMISSIONS_ENUM.CARRIERS.VIEW,
  roles: PERMISSIONS_ENUM.ROLES_AND_RIGHTS.VIEW,
};

export const AdminSettings: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>("users");
  const permissions = usePermissionStore((state) => state.permissions);

  // Pick the first accessible module dynamically based on permissions
  useEffect(() => {
    if (!permissions || permissions.length === 0) return;
    const firstAllowed = MODULE_ORDER.find((mod) =>
      permissions.includes(MODULE_PERMISSION_MAP[mod])
    );
    if (firstAllowed && firstAllowed !== activeModule) {
      setActiveModule(firstAllowed);
    }
  }, [permissions]);

  const renderActiveModule = () => {
    switch (activeModule) {
      case "users":
        return <PermissionGuard required={PERMISSIONS_ENUM.USERS.VIEW}><UsersModule /></PermissionGuard>;
      case "events":
        return <PermissionGuard required={PERMISSIONS_ENUM.EVENTS.VIEW}><EventsModule /></PermissionGuard>;
      case "carriers":
        return <PermissionGuard required={PERMISSIONS_ENUM.CARRIERS.VIEW}><CarriorTable /></PermissionGuard>;
      case "roles":
        return <PermissionGuard required={PERMISSIONS_ENUM.ROLES_AND_RIGHTS.VIEW}><RoleModule /></PermissionGuard>;
      default:
        return <PermissionGuard required={PERMISSIONS_ENUM.USERS.VIEW}><UsersModule /></PermissionGuard>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 overflow-auto">
        {renderActiveModule() || (
          permissions?.length > 0 ? (
            <div className="p-6 text-gray-500">You don't have access to any Admin modules.</div>
          ) : (
            <TableSkel />
          )
        )}
      </div>
    </div>
  );
};
