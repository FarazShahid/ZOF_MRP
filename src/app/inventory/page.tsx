"use client";

import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../components/auth/PermissionGaurd";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import InventoryModule from "../components/inventory/InventoryModule";
import { Tooltip } from "@heroui/react";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY.VIEW}>
        <InventoryModule />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
