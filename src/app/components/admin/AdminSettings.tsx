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
  () => import("../../shipments/carrior/components/CarriorTable"),
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-6 py-4 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <i className="ri-settings-3-line text-lg text-emerald-600 dark:text-emerald-400"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage system configuration</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-5 h-[calc(100vh-200px)]">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-5">
          {renderActiveModule() || (
            permissions?.length > 0 ? (
              <div className="text-gray-500 dark:text-slate-400">You don&apos;t have access to any Admin modules.</div>
            ) : (
              <TableSkel />
            )
          )}
        </div>
      </div>
    </div>
  );
};
