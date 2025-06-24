import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import InventoryTransaction from "../inventoryTransaction/page";

const page = () => {
  return (
    <AdminDashboardLayout>
      <InventoryTransaction />
    </AdminDashboardLayout>
  );
};

export default page;
