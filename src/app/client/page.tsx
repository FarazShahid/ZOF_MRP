import React from "react";
import Clients from "@/src/components/clients/Clients";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import PermissionGuard from "../components/auth/PermissionGaurd";

const page = () => {
  return (
      <PermissionGuard required={PERMISSIONS_ENUM.CLIENTS.VIEW}>
        <Clients />
      </PermissionGuard>
  );
};

export default page;


