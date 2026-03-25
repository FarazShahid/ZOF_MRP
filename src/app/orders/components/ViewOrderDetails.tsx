"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useOrderStore from "@/store/useOrderStore";
import { PdfVariant } from "@/src/types/OrderPDfType";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";
import usePermission from "@/src/hooks/usePermission";
import { formatDate } from "@/src/types/admin";

import OrderStatus from "./OrderStatus";
import DownloadPdfMenu from "../../components/order/DownloadPdfMenu";
import OrderInfo from "../../components/order/view order/OrderInfo";
import OrderAttachements from "../../components/order/view order/OrderAttachements";
import ShipmentAttachments from "../../components/order/view order/ShipmentAttachments";
import OrderItemsCard from "../../components/order/view order/OrderItemsCard";
import { OrderInfoSkeleton } from "../../components/order/view order/OrderInfoSkeleton";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import FeedbackTab from "../../components/order/view order/FeedbackTab";

interface ViewOrderProps {
  orderId: number;
}

const getStatusColor = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s.includes("production")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (s.includes("shipped")) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  if (s.includes("packing")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (s.includes("kept") || s.includes("completed")) return "bg-green-500/20 text-green-400 border-green-500/30";
  return "bg-slate-500/20 text-slate-400 border-slate-500/30";
};

const getTypeColor = (type: string) => {
  if (type === "Sample") return "bg-teal-500/20 text-teal-300 border-teal-500/30";
  if (type === "Reorder") return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  return "bg-slate-600/30 text-slate-300 border-slate-500/30";
};

const ViewOrderDetails: FC<ViewOrderProps> = ({ orderId }) => {
  const router = useRouter();
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("info");
  const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState<boolean>(false);
  const hasChangeStatusPermission = usePermission(PERMISSIONS_ENUM.ORDER.UPDATE);

  const {
    changeOrderStatus,
    getOrderById,
    getOrderStatusLog,
    generateAndDownloadOrderPdf,
    OrderById,
    loading,
  } = useOrderStore();

  const handleCloseStatusModal = useCallback(() => {
    setRefetchData((s) => !s);
    setOpenUpdateStatusModal(false);
  }, []);

  const handleStatusChange = useCallback(
    (statusId: number, statusName: string) => {
      changeOrderStatus({ id: orderId, statusId }, handleCloseStatusModal);
    },
    [changeOrderStatus, handleCloseStatusModal, orderId]
  );

  const handleDownloadPdf = async (variant: PdfVariant) => {
    await generateAndDownloadOrderPdf(orderId, variant);
  };

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId);
      if (hasChangeStatusPermission) {
        getOrderStatusLog(orderId);
      }
    }
  }, [orderId, refetchData, hasChangeStatusPermission]);

  const lineItemsCount = OrderById?.items?.length ?? 0;
  const totalUnits = (OrderById?.items ?? []).reduce(
    (sum, item) =>
      sum +
      (item.orderItemDetails ?? []).reduce((s, d) => s + (Number(d.Quantity) || 0), 0),
    0
  );

  const tabs = [
    { key: "info", label: "Order Info", icon: "ri-dashboard-line" },
    { key: "OrderItems", label: "Items", icon: "ri-list-check-2", count: lineItemsCount },
    { key: "OrderAttachements", label: "Order Attachments", icon: "ri-palette-line" },
    ...(OrderById?.StatusName === "Shipped"
      ? [{ key: "ShipmentAttachments", label: "Shipment Attachments", icon: "ri-truck-line" as const }]
      : []),
    { key: "Feedback", label: "Feedback", icon: "ri-history-line" },
  ];

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link
          href="/orders"
          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          Orders
        </Link>
        <i className="ri-arrow-right-s-line text-slate-600 w-4 h-4 flex items-center justify-center" />
        <span className="text-slate-200">
          {loading && !OrderById ? "Loading…" : OrderById?.OrderName ?? "—"}
        </span>
      </div>

      {/* Top Section - reference style */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-white">
                {loading && !OrderById ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  OrderById?.OrderName ?? "—"
                )}
              </h1>
              {OrderById && (
                <>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                      OrderById.StatusName ?? ""
                    )}`}
                  >
                    {OrderById.StatusName ?? "—"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getTypeColor(
                      OrderById.OrderType ?? ""
                    )}`}
                  >
                    {OrderById.OrderType ?? "—"}
                  </span>
                </>
              )}
            </div>
            {OrderById && (
              <div className="flex items-center gap-6 text-sm text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <i className="ri-hashtag w-4 h-4 flex items-center justify-center" />
                  {OrderById.OrderNumber ?? OrderById.Id}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ri-building-line w-4 h-4 flex items-center justify-center" />
                  {OrderById.ClientName ?? "—"}
                </span>
                {OrderById.OrderEventId && (
                  <Link
                    href={`/events/${OrderById.OrderEventId}`}
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <i className="ri-calendar-event-line w-4 h-4 flex items-center justify-center" />
                    {OrderById.EventName ?? "—"}
                  </Link>
                )}
                <span className="flex items-center gap-1.5">
                  <i className="ri-calendar-check-line w-4 h-4 flex items-center justify-center" />
                  Delivery: {OrderById?.Deadline ? formatDate(OrderById.Deadline) : "—"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 ml-6 shrink-0">
            <DownloadPdfMenu
              downloading={downloading}
              OrderById={OrderById?.Id}
              handleDownloadPdf={(v) => handleDownloadPdf(v)}
            />
            <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>
              <button
                type="button"
                onClick={() => setOpenUpdateStatusModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-checkbox-circle-line mr-1.5 w-4 h-4 inline-flex items-center justify-center" />
                Change Status
              </button>
            </PermissionGuard>
          </div>
        </div>

        {/* Summary Cards */}
        {OrderById && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Total Units</div>
              <div className="text-xl font-bold text-white">{totalUnits.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Line Items</div>
              <div className="text-xl font-bold text-white">{lineItemsCount}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Total Amount</div>
              <div className="text-xl font-bold text-white">—</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Production</div>
              <div className="text-xl font-bold text-white">—</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Shipments</div>
              <div className="text-xl font-bold text-white">—</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs - reference style pill bar */}
      <div className="flex items-center gap-1 mb-6 bg-slate-900 rounded-xl p-1 border border-slate-800 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`} />
            {tab.label}
            {"count" in tab && tab.count !== undefined && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? "bg-yellow-400 text-black font-bold" : "bg-slate-700 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "info" &&
        (loading && !OrderById ? (
          <OrderInfoSkeleton />
        ) : OrderById ? (
          <OrderInfo OrderById={OrderById} />
        ) : (
          <OrderInfoSkeleton />
        ))}
      {activeTab === "OrderItems" && <OrderItemsCard OrderById={OrderById} />}
      {activeTab === "OrderAttachements" && OrderById && (
        <OrderAttachements orderId={OrderById.Id} />
      )}
      {activeTab === "ShipmentAttachments" && OrderById?.StatusName === "Shipped" && (
        <ShipmentAttachments orderId={OrderById.Id} />
      )}
      {activeTab === "Feedback" && OrderById && <FeedbackTab orderId={OrderById.Id} />}

      {openUpdateStatusModal && (
        <OrderStatus
          OrderId={orderId}
          isOpen={openUpdateStatusModal}
          onCloseStatusModal={handleCloseStatusModal}
          onChangeStatus={(statusId, statusName) => handleStatusChange(statusId, statusName)}
        />
      )}
    </div>
  );
};

export default ViewOrderDetails;
