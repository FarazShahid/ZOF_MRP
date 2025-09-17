import React, { useEffect, useState } from "react";
import {
  X,
  Package,
  Calendar,
  DollarSign,
  Weight,
  ChevronDown,
  ChevronRight,
  Truck,
  User,
  Clock,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { ShipmentStatus } from "@/src/types/admin";
import useShipmentStore from "@/store/useShipmentStore";
import { useRouter } from "next/navigation";
import RecentAttachmentsView from "../RecentAttachmentsView";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";

interface ShipmentDetailProps {
  shipmentId: number;
  onClose: () => void;
}

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({
  shipmentId,
  onClose,
}) => {
  const { getShipmentById, ShipmentById } = useShipmentStore();
  const [isBoxesSectionOpen, setIsBoxesSectionOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (shipmentId) {
      getShipmentById(shipmentId);
    }
  }, [shipmentId]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const viewOrderDetail = (orderId: number) => {
    router.push(`/orders/vieworder/${orderId}`);
  };

  return (
    <div className="fixed right-0 top-0 w-96 bg-white dark:bg-black shadow-2xl flex flex-col h-full z-50 transform transition-transform duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {ShipmentById?.ShipmentCode}
            </h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {ShipmentById?.ShipmentCarrierName}
                </span>
              </div>

              <StatusBadge
                status={
                  (ShipmentById?.Status as ShipmentStatus) || "In Transit"
                }
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Basic Info Section */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shipment Details
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Shipment Date
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(ShipmentById?.ShipmentDate || "")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Shipment Cost
                </p>
                <p className="text-sm text-gray-600">
                  {ShipmentById?.ShipmentCost}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Weight className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Total Weight
                </p>
                <p className="text-sm text-gray-600">
                  {ShipmentById?.TotalWeight} {ShipmentById?.WeightUnit}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Number of Boxes
                </p>
                <p className="text-sm text-gray-600">
                  {ShipmentById?.NumberOfBoxes}
                </p>
              </div>
            </div>

            {ShipmentById?.ReceivedTime && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Received Time
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(ShipmentById?.ReceivedTime)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Associated Orders
          </h3>
          <div className="space-y-3">
            {ShipmentById?.Orders.map((order) => (
              <div key={order.Id} className="p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.OrderName}
                    </p>
                    <p className="text-sm text-gray-600">{order.OrderNumber}</p>
                  </div>
                  <button
                    onClick={() => viewOrderDetail(order.Id)}
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap"
                  >
                    View Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boxes Section */}
        <div className="p-6 border-b border-slate-200">
          <button
            onClick={() => setIsBoxesSectionOpen(!isBoxesSectionOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Boxes ({ShipmentById?.boxes?.length || 0})
            </h3>
            {isBoxesSectionOpen ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {isBoxesSectionOpen && ShipmentById?.boxes && (
            <div className="mt-4 space-y-3">
              {ShipmentById?.boxes.map((box, index) => (
                <div key={index} className="p-3 rounded-lg">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">
                        Box #{box.BoxNumber}
                      </span>
                      <span className="text-gray-600">
                        {box.Weight} {ShipmentById?.WeightUnit}
                      </span>
                    </div>
                    {box?.items?.map((boxItem, index) => {
                      return (
                        <div className="flex justify-between" key={index}>
                          <span className="font-medium text-gray-900">
                            {boxItem?.OrderItemName}
                          </span>
                          <span className="text-gray-600">
                            {boxItem?.Quantity}
                          </span>
                        </div>
                      );
                    })}
                    <div>
                      <p className="text-xs text-gray-500">
                        {box.OrderBoxDescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attachements  */}

        <div className="p-6 border-b border-slate-200">
          <RecentAttachmentsView
            referenceId={shipmentId}
            referenceType={DOCUMENT_REFERENCE_TYPE.SHIPMENT}
          />
        </div>

        {/* Meta Info Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Meta Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Created By</p>
                <p className="text-gray-600">{ShipmentById?.CreatedBy}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Created On</p>
                <p className="text-gray-600">
                  {formatDateTime(ShipmentById?.CreatedOn || "")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Updated By</p>
                <p className="text-gray-600">{ShipmentById?.UpdatedBy}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Updated On</p>
                <p className="text-gray-600">
                  {formatDateTime(ShipmentById?.UpdatedOn || "")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
