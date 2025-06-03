import AdminDashboardLayout from "@/src/app/components/common/AdminDashboardLayout";
import SizeMeasurementForm from "./SizeMeasurementForm";

const page = () => {
  return (
    <AdminDashboardLayout>
      <SizeMeasurementForm isEdit={false} />
    </AdminDashboardLayout>
  );
};

export default page;
