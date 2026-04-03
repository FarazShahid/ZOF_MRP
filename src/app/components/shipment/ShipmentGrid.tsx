import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  Package,
  Calendar,
  Weight,
  DollarSign,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { GetAllShipments } from "@/store/useShipmentStore";
import { ShipmentStatus } from "@/src/types/admin";
import { useRouter } from "next/navigation";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

interface ShipmentGridProps {
  shipments: GetAllShipments[];
  onViewDetails: (id: number) => void;
  onDelete: (id: number) => void;
}

const ShipmentGrid: React.FC<ShipmentGridProps> = ({
  shipments,
  onViewDetails,
  onDelete,
}) => {
  const router = useRouter();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEditShipment = (id: number) => {
    router.push(`/shipments/editshipment/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pb-4">
      {shipments?.map((shipment) => (
        <div
          key={shipment.Id}
          className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {shipment?.ShipmentCode}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {shipment?.ShipmentCarrierName}
                  </p>
                </div>
              </div>
              <StatusBadge status={shipment?.Status as ShipmentStatus} />
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3 pt-3 space-y-2">
            {/* Date & Boxes row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/60 rounded-md px-2.5 py-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-slate-300">{formatDate(shipment.ShipmentDate)}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/60 rounded-md px-2.5 py-2">
                <Package className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-slate-300">{shipment.NumberOfBoxes} boxes</span>
              </div>
            </div>

            {/* Weight & Cost row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/60 rounded-md px-2.5 py-2">
                <Weight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-slate-300">{shipment.TotalWeight} {shipment.WeightUnit}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/60 rounded-md px-2.5 py-2">
                <DollarSign className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                <span className="text-xs font-medium text-gray-900 dark:text-white">{shipment.ShipmentCost}</span>
              </div>
            </div>

            {/* Orders - inline */}
            <div className="flex items-center gap-2 flex-nowrap overflow-hidden">
              <span className="text-[10px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider shrink-0">Associated Orders</span>
              {shipment.Orders.slice(0, 3).map((order) => (
                <span
                  key={order.Id}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shrink-0"
                >
                  {order.OrderNumber}
                </span>
              ))}
              {shipment.Orders.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 shrink-0">
                  +{shipment.Orders.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(shipment.Id);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </button>

            <PermissionGuard required={PERMISSIONS_ENUM.SHIPMENT.UPDATE}>
              <button
                type="button"
                onClick={() => handleEditShipment(shipment.Id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </PermissionGuard>

            <PermissionGuard required={PERMISSIONS_ENUM.SHIPMENT.DELETE}>
              <button
                type="button"
                onClick={() => onDelete(shipment.Id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </PermissionGuard>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShipmentGrid;
