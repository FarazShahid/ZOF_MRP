"use client";

import React from "react";
import usePermissionStore from "@/store/usePermissionStore";


interface PermissionGuardProps {
  required: number | number[];
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ required, children }) => {
  const permissions = usePermissionStore((state) => state.permissions);

  const hasPermission = Array.isArray(required)
    ? required.some((id) => permissions.includes(id))
    : permissions.includes(required);

  if (!hasPermission) return null;

  return <>{children}</>;
};

export default PermissionGuard;

