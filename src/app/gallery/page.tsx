import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import GalleryPage from "../components/gallery/GalleryPage";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.PRODUCTS.VIEW}>
        <GalleryPage />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
