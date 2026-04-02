import SizeMeasurementForm from "./SizeMeasurementForm";
import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";

const page = () => {
  return (
    <AdminDashboardLayout>
      <SizeMeasurementForm isEdit={false} />
    </AdminDashboardLayout>
  );
};

export default page;
