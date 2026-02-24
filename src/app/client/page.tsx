import React from "react";
import PermissionGuard from "../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import Clients from "@/src/components/clients/Clients";

const page = () => {
  return (
      <PermissionGuard required={PERMISSIONS_ENUM.CLIENTS.VIEW}>
        <Clients />
      </PermissionGuard>
  );
};

export default page;


