import React, { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button, Tab, Tabs } from "@heroui/react";
import { IoReturnDownBack } from "react-icons/io5";

import useOrderStore from "@/store/useOrderStore";
import { PdfVariant } from "@/src/types/OrderPDfType";
import {OrderItemShipmentEnum } from "@/interface";

import OrderStatus from "./OrderStatus";
import DownloadPdfMenu from "../../components/order/DownloadPdfMenu";
import CardSkeleton from "../../components/ui/Skeleton/CardSkeleton";
import OrderInfo from "../../components/order/view order/OrderInfo";
import OrderAttachements from "../../components/order/view order/OrderAttachements";
import ShipmentAttachments from "../../components/order/view order/ShipmentAttachments";
import OrderItemsCard from "../../components/order/view order/OrderItemsCard";
import { OrderInfoSkeleton } from "../../components/order/view order/OrderInfoSkeleton";
import PermissionGuard from "../../components/auth/PermissionGaurd";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

const OrderItemCard = dynamic(
  () => import("../../components/order/view order/OrderItemCard"),
  {
    loading: () => <CardSkeleton />,
  }
);

interface ViewOrderProps {
  orderId: number;
}

const ViewOrderDetails: FC<ViewOrderProps> = ({ orderId }) => {
 
 
  const [localStatusName, setLocalStatusName] = useState<string>("");
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [openUpdateStatusModal, setOpenUpdateStatusModal] =
    useState<boolean>(false);

  const {
    changeOrderStatus,
    getOrderById,
    getOrderStatusLog,
    generateAndDownloadOrderPdf,
    OrderById,
    loading,
  } = useOrderStore();


  // Callbacks
  const handleCloseStatusModal = useCallback(() => {
    setRefetchData((s) => !s);
    setOpenUpdateStatusModal(false);
  }, []);

  const handleStatusChange = useCallback(
    (statusId: number, statusName: string) => {
      changeOrderStatus({ id: orderId, statusId }, handleCloseStatusModal);
      setLocalStatusName(statusName);
    },
    [changeOrderStatus, handleCloseStatusModal, orderId]
  );

  const handleDownloadPdf = async (variant: PdfVariant) => {
    await generateAndDownloadOrderPdf(orderId, variant);
  };

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId);
      getOrderStatusLog(orderId);
    }
  }, [orderId, refetchData]);

  return (
    <div className="space-y-5 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={"/orders"}
            className="p-1 border-1 border-gray-700 rounded"
          >
            <IoReturnDownBack />
          </Link>
          <h2 className="text-2xl font-semibold dark:text-gray-600 text-gray-800">
            {loading && !OrderById ? (
              <span className="animate-pulse">Loading…</span>
            ) : (
              OrderById?.OrderName
            )}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <DownloadPdfMenu
            downloading={downloading}
            OrderById={OrderById.Id}
            handleDownloadPdf={(v) => handleDownloadPdf(v)}
          />
          <PermissionGuard required={PERMISSIONS_ENUM.ORDER.UPDATE}>   
          {OrderById.OrderShipmentStatus !== OrderItemShipmentEnum.SHIPPED && (
            <Button
              type="button"
              onPress={() => setOpenUpdateStatusModal(true)}
              className="px-3 py-1 flex items-center gap-2 bg-blue-800 dark:bg-blue-600 rounded-lg text-sm text-white disabled:opacity-50"
            >
              Change Status
            </Button>
          )}
          </PermissionGuard>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        aria-label="Tabs colors"
        color="primary"
        radius="full"
        variant="bordered"
      >
        <Tab key="info" title="Order Info">
          {
            loading && !orderId ? (
              <OrderInfoSkeleton />
            ):  (<OrderInfo OrderById={OrderById} />)
          }
        </Tab>
        <Tab key="OrderItems" title="Order Items">
          <OrderItemsCard OrderById={OrderById} />
        </Tab>
        <Tab key="OrderAttachements" title="Order Attachements">
          <OrderAttachements orderId={OrderById.Id} />
        </Tab>
        {OrderById?.StatusName === 'Shipped' && (
          <Tab key="ShipmentAttachments" title="Shipment Attachements">
            <ShipmentAttachments orderId={OrderById.Id} />
          </Tab>
        )}
      </Tabs>
      

      {/* ----------- Changes Order Status  ------------ */}
      {openUpdateStatusModal && (
        <OrderStatus
          OrderId={orderId}
          isOpen={openUpdateStatusModal}
          onCloseStatusModal={handleCloseStatusModal}
          onChangeStatus={(statusId, statusName) =>
            handleStatusChange(statusId, statusName)
          }
        />
      )}
    </div>
  );
};

export default ViewOrderDetails;
