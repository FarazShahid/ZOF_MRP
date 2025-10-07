"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import { ActiveInventoryModule } from "@/src/types/inventory";
import { InventorySidebar } from "../Inventorysetupupdate/InventorySidebar";
import { TableSkel } from "../../components/ui/Skeleton/TableSkel";

// Lazy modules
const InventoryCategories = dynamic(() => import("../../categories/page"), {
  ssr: false,
  loading: () => <TableSkel />,
});
const Subcategories = dynamic(() => import("../../subcategories/page"), {
  ssr: false,
  loading: () => <TableSkel />,
});
const UnitofMeasure = dynamic(() => import("../../unitofmeasure/page"), {
  ssr: false,
  loading: () => <TableSkel />,
});
const Supplier = dynamic(() => import("../../supplier/page"), {
  ssr: false,
  loading: () => <TableSkel />,
});
const InventoryTransaction = dynamic(
  () => import("../../inventoryTransaction/page"),
  {
    ssr: false,
    loading: () => <TableSkel />,
  }
);

const Page = () => {
  const [activeModule, setActiveModule] = useState<ActiveInventoryModule>("categories");

  const renderActiveModule = () => {
    switch (activeModule) {
      case "categories":
        return <InventoryCategories />;
      case "subcategories":
        return <Subcategories />;
      case "uom":
        return <UnitofMeasure />;
      case "suppliers":
        return <Supplier />;
      case "transactions":
        return <InventoryTransaction />;
      default:
        return <InventoryCategories />;
    }
  };

  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW}>
        <div className="bg-gray-50 flex">
          <InventorySidebar
            activeModule={activeModule}
            onModuleChange={setActiveModule}
          />
          <div className="flex-1 overflow-auto p-4">{renderActiveModule()}</div>
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default Page;


