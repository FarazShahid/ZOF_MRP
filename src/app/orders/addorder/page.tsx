import React from "react";
import OrderForm from "../components/OrderForm";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../../components/auth/PermissionGaurd";

const page = () => {
  return (
      <PermissionGuard required={PERMISSIONS_ENUM.ORDER.ADD}>
        <OrderForm />
      </PermissionGuard>
  );
};

export default page;
