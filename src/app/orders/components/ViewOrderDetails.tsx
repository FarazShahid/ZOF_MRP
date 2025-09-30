import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button, Tab, Tabs } from "@heroui/react";
import { IoIosStats } from "react-icons/io";
import { FaUserTie } from "react-icons/fa6";
import { GiCargoShip } from "react-icons/gi";
import { IoReturnDownBack } from "react-icons/io5";
import { FiDownload, FiLoader } from "react-icons/fi";

import useOrderStore from "@/store/useOrderStore";
import { PdfVariant } from "@/src/types/OrderPDfType";
import useQAchecklistStore from "@/store/useQAchecklistStore";
import { DOCUMENT_REFERENCE_TYPE, OrderItemShipmentEnum } from "@/interface";
import { useOrderItemSelectionStore } from "@/store/useOrderItemSelectionStore";

import OrderStatus from "./OrderStatus";
import OrderDeadline from "./OrderDeadline";
import ClientDetails from "./ClientDetails";
import StatusTimelineDrawer from "./StatusTimelineDrawer";
import { ViewMeasurementChart } from "./ViewMeasurementChart";
import { OrderItem } from "../../interfaces/OrderStoreInterface";
import DownloadPdfMenu from "../../components/order/DownloadPdfMenu";
import CardSkeleton from "../../components/ui/Skeleton/CardSkeleton";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import SidebarSkeleton from "../../components/ui/Skeleton/SideBarSkeleton";
import OrderInfo from "../../components/order/view order/OrderInfo";
import OrderAttachements from "../../components/order/view order/OrderAttachements";
import OrderItemsCard from "../../components/order/view order/OrderItemsCard";

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
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [measurementId, setMeasurementId] = useState<number>(0);
  const [sizeOptionName, setSizeOptionName] = useState<string>("");
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

  const {
    selectionMode,
    selectedIds,
    enterSelectionWith,
    toggleOne,
    setAll,
    clear,
    exit,
  } = useOrderItemSelectionStore();

  const { downloadQAChecklistZip, loading: qaLoading } = useQAchecklistStore();

  const items: OrderItem[] = useMemo(() => OrderById?.items ?? [], [OrderById]);
  const allIds = useMemo(() => items.map((i) => i.Id), [items]);
  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const anySelected = selectedArray.length > 0;
  const allSelected = anySelected && selectedArray.length === allIds.length;

  const handleSelectAllToggle = () => {
    if (allSelected) clear();
    else setAll(allIds);
  };

  const handleDownloadQA = async () => {
    await downloadQAChecklistZip(orderId, selectedArray);
  };

  // Callbacks
  const handleOpenViewModal = useCallback((id: number, sizeName: string) => {
    setMeasurementId(id);
    setSizeOptionName(sizeName);
    setOpenViewModal(true);
  }, []);

  const handleCloseViewModal = useCallback(() => setOpenViewModal(false), []);

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
              OrderById?.OrderNumber
            )}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {selectionMode && anySelected && (
            <Button
              type="button"
              onPress={qaLoading ? undefined : handleDownloadQA}
              isLoading={qaLoading}
              isDisabled={qaLoading}
              spinner={<FiLoader className="animate-spin" />}
              spinnerPlacement="start"
              className={[
                "px-3 py-1 flex items-center gap-2 rounded-lg text-sm text-white",
                "bg-blue-800 dark:bg-blue-600",
                qaLoading ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
              aria-busy={qaLoading}
              title={
                qaLoading
                  ? "Downloading…"
                  : "Download QA Sheets ZIP for selected items"
              }
            >
              {!qaLoading && <FiDownload />}
              {qaLoading ? "Downloading…" : "QA Sheet"}
            </Button>
          )}
          <DownloadPdfMenu
            downloading={downloading}
            OrderById={OrderById.Id}
            handleDownloadPdf={(v) => handleDownloadPdf(v)}
          />
          {OrderById.OrderShipmentStatus !== OrderItemShipmentEnum.SHIPPED && (
            <Button
              type="button"
              onPress={() => setOpenUpdateStatusModal(true)}
              className="px-3 py-1 flex items-center gap-2 bg-blue-800 dark:bg-blue-600 rounded-lg text-sm text-white disabled:opacity-50"
            >
              Change Status
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        aria-label="Tabs colors"
        color="primary"
        radius="full"
        variant="underlined"
      >
        <Tab key="info" title="Order Info">
          <OrderInfo OrderById={OrderById} />
        </Tab>
        <Tab key="OrderItems" title="Order Items">
          <OrderItemsCard OrderById={OrderById} />
        </Tab>
        <Tab key="OrderAttachements" title="Order Attachements">
          <OrderAttachements orderId={OrderById.Id} />
        </Tab>
      </Tabs>

      {/* <div className="flex gap-4 w-full">
        <div className="w-[75%] flex flex-col gap-5">
          {loading && !OrderById ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <div className=" flex items-center gap-10 dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 p-4 shadow-lg">
                <OrderDeadline
                  deadline={OrderById?.Deadline}
                  OrderShipmentStatus={OrderById?.OrderShipmentStatus}
                />
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="flex items-center justify-center border-1 dark:bg-default-100 bg-gray-300 dark:text-default-500 text-gray-600 border-default-200/50 rounded-small w-11 h-11">
                    <IoIosStats size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-medium dark:text-foreground text-gray-700 font-medium">
                      {localStatusName
                        ? localStatusName
                        : OrderById?.StatusName}
                    </p>
                    <p className="text-xs dark:text-foreground text-gray-700 font-medium">
                      Order Status
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="flex items-center justify-center border-1 dark:bg-default-100 bg-gray-300 dark:text-default-500 text-gray-600 border-default-200/50 rounded-small w-11 h-11">
                    <GiCargoShip size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-medium dark:text-foreground text-gray-700 font-medium">
                      {OrderById.OrderShipmentStatus}
                    </p>
                    <p className="text-xs dark:text-foreground text-gray-700 font-medium">
                      Shipment Status
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3  text-gray-400">
                  <div className="flex items-center justify-center border-1 dark:bg-default-100 bg-gray-300 dark:text-default-500 text-gray-600 border-default-200/50 rounded-small w-11 h-11">
                    <FaUserTie size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-medium dark:text-foreground text-gray-800 font-medium">
                      {OrderById?.ClientName}
                    </p>
                    <p className="text-xs dark:text-foreground text-gray-800 font-medium">
                      {OrderById?.EventName}
                    </p>
                  </div>
                </div>
              </div>
              {selectionMode && (
                <div className="flex items-center justify-between rounded-xl border dark:border-slate-700 border-slate-300 p-2">
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAllToggle}
                        className="h-4 w-4 accent-black"
                      />
                      <span className="text-sm">Select all</span>
                    </label>
                    {anySelected && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-slate-800">
                        {selectedArray.length} selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clear}
                      className="text-xs px-2 py-1 rounded-lg border dark:border-slate-700 border-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={exit}
                      className="text-xs px-2 py-1 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black hover:opacity-90"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {OrderById?.items.map((orderItem, index) => {
                  return (
                    <OrderItemCard
                      key={index}
                      item={orderItem}
                      selectionMode={selectionMode}
                      selected={selectedIds.has(orderItem.Id)}
                      onToggle={(id) => toggleOne(id)}
                      onEnterSelection={(id) => enterSelectionWith(id)}
                      onOpenViewModal={handleOpenViewModal}
                    />
                  );
                })}
              </div>

              <RecentAttachmentsView
                label={"Order Attachments"}
                referenceId={OrderById.Id}
                referenceType={DOCUMENT_REFERENCE_TYPE.ORDER}
              />
            </>
          )}
        </div>

        <div className="w-[25%] flex flex-col gap-2">
          {loading && !OrderById ? (
            <>
              <SidebarSkeleton />
              <SidebarSkeleton />
            </>
          ) : (
            <>
              <div className="p-3 dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 shadow-lg flex flex-col gap-5 dark:text-foreground text-gray-700">
                <p className="text-sm">Status Timeline</p>
                <StatusTimelineDrawer />
              </div>
              <ClientDetails clientId={OrderById?.ClientId} />
            </>
          )}
        </div>
      </div> */}

      {/* ----------- View Measurement  ------------ */}
      {openViewModal && (
        <ViewMeasurementChart
          isOpen={openViewModal}
          measurementId={measurementId}
          sizeOptionName={sizeOptionName}
          onCloseViewModal={handleCloseViewModal}
        />
      )}

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
