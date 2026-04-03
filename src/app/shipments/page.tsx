import PermissionGuard from "../components/auth/PermissionGaurd";
import ShipmentModule from "../components/shipment/ShipmentModule";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const page = () => {
  return (
    <PermissionGuard required={PERMISSIONS_ENUM.SHIPMENT.VIEW}>
      <ShipmentModule />
    </PermissionGuard>
  );
};

export default page;
