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
    router.push(`/shipment/editshipment/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {shipments?.map((shipment) => (
        <div
          key={shipment.Id}
          className="rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {shipment?.ShipmentCode}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {shipment?.ShipmentCarrierName}
                  </p>
                </div>
              </div>
              <StatusBadge status={shipment?.Status as ShipmentStatus} />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Date, Boxes, Weight, Cost */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">
                  {formatDate(shipment.ShipmentDate)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">
                  {shipment.NumberOfBoxes} boxes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Weight className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">
                  {shipment.TotalWeight} {shipment.WeightUnit}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="text-gray-900 font-medium">
                  {shipment.ShipmentCost}
                </span>
              </div>
            </div>

            {/* Orders */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">
                ASSOCIATED ORDERS
              </p>
              <div className="flex flex-wrap gap-1">
                {shipment.Orders.slice(0, 3).map((order) => (
                  <span
                    key={order.Id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {order.OrderNumber}
                  </span>
                ))}
                {shipment.Orders.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    +{shipment.Orders.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 rounded-b-lg border-t border-slate-200">
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(shipment.Id);
                }}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-50 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                type="button"
                onClick={() => handleEditShipment(shipment.Id)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-slate-100 dark:hover:bg-slate-500 rounded-md transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(shipment.Id)}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-100 hover:bg-red-50 dark:hover:bg-red-400 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShipmentGrid;
