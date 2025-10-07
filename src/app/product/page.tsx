import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../components/auth/PermissionGaurd";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import ProductModule from "../components/product/ProductModule";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
        <ProductModule />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
