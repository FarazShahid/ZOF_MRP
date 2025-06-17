import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import OrderTable from "./components/OrderTable";

const page = () => {
  return (
    <AdminDashboardLayout>
      <OrderTable />
    </AdminDashboardLayout>
  );
};

export default page;
