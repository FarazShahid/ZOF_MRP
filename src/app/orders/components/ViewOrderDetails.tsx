import React, { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { IoIosStats, IoIosPrint } from "react-icons/io";
import { FaUserTie } from "react-icons/fa6";
import { IoReturnDownBack } from "react-icons/io5";
import { TbStatusChange } from "react-icons/tb";
import useOrderStore from "@/store/useOrderStore";
import { PdfVariant } from "@/src/types/OrderPDfType";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { GiCargoShip } from "react-icons/gi";
import OrderStatus from "./OrderStatus";
import { FaRegEye } from "react-icons/fa";
import OrderDeadline from "./OrderDeadline";
import ClientDetails from "./ClientDetails";
import { ViewMeasurementChart } from "./ViewMeasurementChart";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import CardSkeleton from "../../components/ui/Skeleton/CardSkeleton";
import SidebarSkeleton from "../../components/ui/Skeleton/SideBarSkeleton";
import StatusTimelineDrawer from "./StatusTimelineDrawer";
import OrderItemStatusChip from "./OrderItemStatusChip";
import DownloadPdfMenu from "../../components/order/DownloadPdfMenu";
import { CheckSquare } from "lucide-react";
import QaSheet from "../../components/order/QaSheet";

interface ViewOrderProps {
  orderId: number;
}


const ViewOrderDetails: FC<ViewOrderProps> = ({ orderId }) => {
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [measurementId, setMeasurementId] = useState<number>(0);
  const [sizeOptionName, setSizeOptionName] = useState<string>("");
  const [localStatusName, setLocalStatusName] = useState<string>("");
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [openQASheet, setOpenQASheet] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [openUpdateStatusModal, setOpenUpdateStatusModal] =
    useState<boolean>(false);
  const [orderProductInof, setOrderProductInfo] = useState({
    orderId: 0,
    orderName: "",
    orderNumber: "",
    OrderDeadline: "",
    clientName: "",
    productName: "",
    productId: 0,
  })

  const {
    changeOrderStatus,
    getOrderById,
    getOrderStatusLog,
    generateAndDownloadOrderPdf,
    OrderById,
    loading,
  } = useOrderStore();

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
        <DownloadPdfMenu
          downloading={downloading}
          OrderById={OrderById.Id}
          handleDownloadPdf={(v) => handleDownloadPdf(v)}
        />
      </div>

      <div className="flex gap-4 w-full">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {OrderById?.items.map((orderItem, index) => {
                  return (
                    <div
                      className="dark:bg-[#161616] bg-gray-100 hover:shadow-md transition-all duration-200 rounded-2xl border-1 dark:border-slate-700 border-slate-300 p-4 flex flex-col gap-2 shadow-lg dark:text-foreground text-gray-700"
                      key={index}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-mono text-foreground font-bold">
                          {orderItem.ProductName}
                        </span>
                        <OrderItemStatusChip
                          status={orderItem.ItemShipmentStatus}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">Fabric:</span>
                        <span className="">
                          {orderItem?.ProductFabricName}_
                          {orderItem?.ProductFabricGSM}
                        </span>
                      </div>

                      {/* -------- Printing Options  ---------- */}

                      {orderItem?.printingOptions?.length > 0 && (
                        <div className="flex text-sm">
                          <span>Printing:</span>
                          <div className="flex flex-wrap gap-1 pl-1">
                            {orderItem.printingOptions.map(
                              (printingOption, idx) => (
                                <span
                                  key={printingOption.PrintingOptionId ?? idx}
                                  className="rounded-xl px-2 text-xs bg-gray-200 flex items-center justify-center"
                                >
                                  {printingOption.PrintingOptionName}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      <table>
                        <thead>
                          <tr>
                            <th className="border-2 text-xs text-center">
                              Size
                            </th>
                            <th className="border-2 text-xs text-center">
                              Qunatity
                            </th>
                            <th className="border-2 text-xs text-center">
                              Measurement
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItem?.orderItemDetails?.map((detail, index) => {
                            return (
                              <tr key={index}>
                                <td className="border-2 text-xs text-center">
                                  {detail.SizeOptionId && (
                                    <>{detail?.SizeOptionName}</>
                                  )}
                                </td>
                                <td className="border-2 text-xs text-center">
                                  {detail?.Quantity}
                                </td>
                                <td className="border-2 text-xs text-center">
                                  {detail.SizeOptionId && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenViewModal(
                                          detail?.MeasurementId,
                                          detail?.SizeOptionName
                                        )
                                      }
                                      className="w-fit"
                                    >
                                      <FaRegEye />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                       <div className="mt-1 w-full">
                        <button type="button" onClick={() => setOpenQASheet(true)} className="w-full flex items-center justify-center gap-2 py-1 text-sm bg-gray-300 rounded">
                         <CheckSquare size={16} /> QA Check List
                        </button>
                      </div>

                      {/* -----------  Product Attachments  ---------------- */}

                      <RecentAttachmentsView
                        referenceId={orderItem.ProductId}
                        referenceType={DOCUMENT_REFERENCE_TYPE.PRODUCT}
                      />

                     
                    </div>
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
      </div>

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

      {/* -----------  QA CheckList View Modal -------------- */}
      <QaSheet isOpen={openQASheet} onClose={() => setOpenQASheet(false)} />
    </div>
  );
};

export default ViewOrderDetails;
