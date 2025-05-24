import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import InventoryItemsTable from "./InventoryItemsTable";

const page = () => {
  return (
    <AdminDashboardLayout>
      <InventoryItemsTable />
    </AdminDashboardLayout>
  );
};

export default page;
