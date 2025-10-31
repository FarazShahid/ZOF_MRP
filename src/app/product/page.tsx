import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../components/auth/PermissionGaurd";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import ProductModule from "../components/product/ProductModule";
import ProductTabs from "../components/product/ProductTabs";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
        <div className="flex flex-col gap-4">
          <ProductTabs />
          <ProductModule />
        </div>
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
