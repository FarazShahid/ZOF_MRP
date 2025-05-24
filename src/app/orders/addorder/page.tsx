import React from "react";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import OrderForm from "../components/OrderForm";

const page = () => {
  return (
    <AdminDashboardLayout>
      <OrderForm />
    </AdminDashboardLayout>
  );
};

export default page;
