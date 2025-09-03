// components/ShipmentStatusBadge.tsx
import React from "react";

export type ShipmentStatusType = "In Transit" | "Damaged" | "Delivered" | "Cancelled";

interface ShipmentStatusBadgeProps {
  status: ShipmentStatusType;
}

const statusColors: Record<ShipmentStatusType, string> = {
  "In Transit": "bg-blue-100 text-blue-700 border border-blue-300",
  "Damaged": "bg-red-100 text-red-700 border border-red-300",
  "Delivered": "bg-green-100 text-green-700 border border-green-300",
  "Cancelled": "bg-gray-100 text-gray-700 border border-gray-300",
};

const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

export default ShipmentStatusBadge;
