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
  ShoppingBag,
  FileText,
  Info,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { ShipmentStatus } from "@/src/types/admin";
import useShipmentStore from "@/store/useShipmentStore";
import { useRouter } from "next/navigation";
import RecentAttachmentsView from "../RecentAttachmentsView";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";

interface ShipmentDetailProps {
  shipmentId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({
  shipmentId,
  isOpen,
  onClose,
}) => {
  const { getShipmentById, ShipmentById } = useShipmentStore();
  const [isBoxesSectionOpen, setIsBoxesSectionOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (shipmentId) {
      getShipmentById(shipmentId);
    }
  }, [shipmentId]);

  // Smooth open/close transition
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

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

  if (!isOpen && !visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 w-[480px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full z-50 transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 dark:bg-emerald-800 border-b border-white/20">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">
                {ShipmentById?.ShipmentCode}
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-200" />
                  <span className="text-sm text-emerald-100">
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
              onClick={handleClose}
              className="p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Shipment Details Section */}
          <div className="p-5 border-b-4 border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Shipment Details
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-600 dark:text-slate-400">Shipment Date</span>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  {formatDate(ShipmentById?.ShipmentDate || "")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-600 dark:text-slate-400">Shipment Cost</span>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  {ShipmentById?.ShipmentCost}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Weight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-600 dark:text-slate-400">Total Weight</span>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  {ShipmentById?.TotalWeight} {ShipmentById?.WeightUnit}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-sm text-gray-600 dark:text-slate-400">Number of Boxes</span>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
                  {ShipmentById?.NumberOfBoxes}
                </span>
              </div>

              {ShipmentById?.ReceivedTime && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                    <span className="text-sm text-gray-600 dark:text-slate-400">Received Time</span>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400">
                    {formatDateTime(ShipmentById?.ReceivedTime)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Associated Orders Section */}
          <div className="p-5 border-b-4 border-emerald-50 dark:border-emerald-500/5">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Associated Orders
              </h3>
            </div>
            <div className="space-y-3">
              {ShipmentById?.Orders.map((order) => (
                <div key={order.Id} className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.OrderName}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                      {order.OrderNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => viewOrderDetail(order.Id)}
                    type="button"
                    className="w-full py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-lg transition-colors text-center"
                  >
                    View Order
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Boxes Section */}
          <div className="p-5 border-b-4 border-gray-100 dark:border-slate-800">
            <button
              onClick={() => setIsBoxesSectionOpen(!isBoxesSectionOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Boxes ({ShipmentById?.boxes?.length || 0})
                </h3>
              </div>
              {isBoxesSectionOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              )}
            </button>

            {isBoxesSectionOpen && ShipmentById?.boxes && (
              <div className="mt-3 space-y-2">
                {ShipmentById?.boxes.map((box, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Box #{box.BoxNumber}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        {box.Weight} {ShipmentById?.WeightUnit}
                      </span>
                    </div>
                    {box?.items?.map((boxItem, idx) => (
                      <div className="flex items-center justify-between py-1" key={idx}>
                        <span className="text-xs text-gray-600 dark:text-slate-400">
                          {boxItem?.OrderItemName}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
                          {boxItem?.Quantity} pcs
                        </span>
                      </div>
                    ))}
                    {box.OrderBoxDescription && (
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                        {box.OrderBoxDescription}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="p-5 border-b-4 border-emerald-50 dark:border-emerald-500/5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Attachments
              </h3>
            </div>
            <RecentAttachmentsView
              referenceId={shipmentId}
              referenceType={DOCUMENT_REFERENCE_TYPE.SHIPMENT}
            />
          </div>

          {/* Meta Information */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Meta Information
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-slate-400">Created By</span>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-900 dark:text-slate-300">{ShipmentById?.CreatedBy}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-slate-400">Created On</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-900 dark:text-slate-300">
                    {formatDateTime(ShipmentById?.CreatedOn || "")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-slate-400">Updated By</span>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-900 dark:text-slate-300">{ShipmentById?.UpdatedBy}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-slate-400">Updated On</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-xs text-gray-900 dark:text-slate-300">
                    {formatDateTime(ShipmentById?.UpdatedOn || "")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShipmentDetail;
