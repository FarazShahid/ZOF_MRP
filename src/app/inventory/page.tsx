import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../components/auth/PermissionGaurd";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import InventoryModule from "../components/inventory/InventoryModule";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW}>
        <InventoryModule />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
