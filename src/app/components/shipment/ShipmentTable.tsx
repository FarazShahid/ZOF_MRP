import React from "react";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import { GetAllShipments } from "@/store/useShipmentStore";
import StatusBadge from "./StatusBadge";
import { ShipmentStatus } from "@/src/types/admin";
import { useRouter } from "next/navigation";
import PermissionGuard from "../auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

interface ShipmentTableProps {
  shipments: GetAllShipments[];
  onViewDetails: (id: number) => void;
  onDelete: (id: number) => void;
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({
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
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Shipment
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Carrier
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Boxes
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Weight
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Cost
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Orders
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {shipments?.map((shipment) => (
              <tr
                key={shipment.Id}
                className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {shipment.ShipmentCode}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                  {formatDate(shipment.ShipmentDate)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                  {shipment.ShipmentCarrierName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={shipment.Status as ShipmentStatus} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                  {shipment.NumberOfBoxes}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                  {shipment.TotalWeight} {shipment.WeightUnit}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                  {shipment.ShipmentCost}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {shipment.Orders.slice(0, 2).map((order) => (
                      <span
                        key={order.Id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                      >
                        {order.OrderNumber}
                      </span>
                    ))}
                    {shipment.Orders.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                        +{shipment.Orders.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(shipment.Id);
                      }}
                      className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <PermissionGuard
                      required={PERMISSIONS_ENUM.SHIPMENT.UPDATE}
                    >
                      <button
                        onClick={() => handleEditShipment(shipment.Id)}
                        className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Edit"
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </PermissionGuard>

                    <PermissionGuard
                      required={PERMISSIONS_ENUM.SHIPMENT.DELETE}
                    >
                      <button
                        onClick={() => onDelete(shipment.Id)}
                        className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </PermissionGuard>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {shipments?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-gray-400 dark:text-slate-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400">No shipments found</p>
        </div>
      )}
    </div>
  );
};

export default ShipmentTable;
