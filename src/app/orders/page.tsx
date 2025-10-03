import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../components/auth/PermissionGaurd";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import OrderTable from "./components/OrderTable";

const page = () => {
  return (
    <AdminDashboardLayout>
      <PermissionGuard required={PERMISSIONS_ENUM.ORDER.VIEW}>
        <OrderTable />
      </PermissionGuard>
    </AdminDashboardLayout>
  );
};

export default page;
