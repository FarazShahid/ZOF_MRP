import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { IoIosStats } from "react-icons/io";
import { FaUserTie } from "react-icons/fa6";
import { IoReturnDownBack } from "react-icons/io5";
import { TbStatusChange } from "react-icons/tb";
import { IoIosPrint } from "react-icons/io";
import useOrderStore from "@/store/useOrderStore";
import PriorityChip from "./PriorityChip";
import OrderDeadline from "./OrderDeadline";
import ClientDetails from "./ClientDetails";
import ColorContainer from "./ColorContainer";
import OrderStatusTimeline from "./OrderStatusTimeline";
import { ViewMeasurementChart } from "./ViewMeasurementChart";
import OrderStatus from "./OrderStatus";
import PrintableOrderSheet from "./PrintableOrderSheet";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";

interface ViewOrderProps {
  orderId: number;
}

const ViewOrderDetails: FC<ViewOrderProps> = ({ orderId }) => {
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [measurementId, setMeasurementId] = useState<number>(0);
  const [sizeOptionName, setSizeOptionName] = useState<string>("");
  const [localStatusName, setLocalStatusName] = useState<string>("");
  const [refetchData, setRefetchData] = useState<boolean>(false);
  const [openUpdateStatusModal, setOpenUpdateStatusModal] =
    useState<boolean>(false);

  const {
    changeOrderStatus,
    getOrderById,
    getOrderStatusLog,
    OrderById,
    OrderStatusLogs,
  } = useOrderStore();

  const handleOpenViewModal = (id: number, sizeName: string) => {
    setMeasurementId(id);
    setOpenViewModal(true);
    setSizeOptionName(sizeName);
  };

  const handeCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleCloseStatusModal = () => {
    setRefetchData(!refetchData);
    setOpenUpdateStatusModal(false);
  };

  const handleStatusChange = (statusId: number, statusName: string) => {
    const selectedStatusId = {
      id: orderId,
      statusId: statusId,
    };
    changeOrderStatus(selectedStatusId, handleCloseStatusModal);
    setLocalStatusName(statusName);
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 300); // slight delay to ensure DOM is ready
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
            {OrderById?.OrderNumber}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1 flex items-center gap-2 dark:bg-blue-600 bg-blue-800 rounded-lg text-sm text-white"
          >
            <IoIosPrint /> Order Print
          </button>
          <button
            type="button"
            onClick={() => setOpenUpdateStatusModal(true)}
            className="px-3 py-1 flex items-center gap-2 dark:bg-blue-600 bg-blue-800 rounded-lg text-sm text-white"
          >
            <TbStatusChange /> Change Status
          </button>
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-[75%] flex flex-col gap-5">
          <div className=" flex items-center gap-10 dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 p-4 shadow-lg">
            <OrderDeadline deadline={OrderById?.Deadline} />
            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex items-center justify-center border-1 dark:bg-default-100 bg-gray-300 dark:text-default-500 text-gray-600 border-default-200/50 rounded-small w-11 h-11">
                <IoIosStats size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-medium dark:text-foreground text-gray-700 font-medium">
                  {localStatusName ? localStatusName : OrderById?.StatusName}
                </p>
                <p className="text-xs dark:text-foreground text-gray-700 font-medium">
                  Current Status
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
          {OrderById?.items.map((orderItem, index) => {
            return (
              <div
                className="dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 p-4 flex flex-col gap-3 shadow-lg dark:text-gray-400 text-gray-800"
                key={index}
              >
                <p>
                  {orderItem?.ProductCategoryName}_
                  {orderItem?.ProductFabricName}_{orderItem?.ProductFabricGSM}
                </p>

                {orderItem?.orderItemDetails?.map((detail, index) => {
                  return (
                    <div
                      className="grid grid-cols-3 gap-8"
                      key={`${index}_${detail?.ColorOptionId}`}
                    >
                      <div className="flex items-center gap-3">
                        <PriorityChip
                          priority={detail?.Priority}
                          showLabel={true}
                        />

                        <ColorContainer
                          key={detail?.ColorOptionId}
                          ColorOptionName={detail?.ColorOptionName}
                          HexCode={detail?.HexCode}
                        />
                      </div>
                      <div className="flex items-center gap-5 text-sm">
                        <span>Qunatity: </span>
                        <span>{detail?.Quantity}</span>
                      </div>
                      <div className="flex items-center gap-5 text-sm">
                        <span>Size: </span>
                        <span>{detail?.SizeOptionName}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenViewModal(
                              detail?.MeasurementId,
                              detail?.SizeOptionName
                            )
                          }
                          className=" py-1 px-2 bg-blue-600 rounded text-xs text-white"
                        >
                          Size Chart
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-5 text-sm">
                  <span>Printing:</span>
                  <div className="flex items-center gap-1" key={index}>
                    {orderItem?.printingOptions?.map(
                      (printingOption, index) => {
                        return (
                          <>
                            <span key={index}>
                              {printingOption.PrintingOptionName},
                            </span>
                          </>
                        );
                      }
                    )}
                  </div>
                </div>
                <RecentAttachmentsView
                  referenceId={orderItem.ProductId}
                  referenceType={DOCUMENT_REFERENCE_TYPE.PRODUCT}
                />
              </div>
            );
          })}
        </div>
        <div className="w-[25%] flex flex-col gap-2">
          <div className="p-3 dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 shadow-lg flex flex-col gap-5 dark:text-gray-400 text-gray-800">
            <p className="text-sm">Status Timeline</p>
            <OrderStatusTimeline OrderStatusLogs={OrderStatusLogs} />
          </div>
          <ClientDetails clientId={OrderById?.ClientId} />
        </div>
      </div>

      {openViewModal && (
        <ViewMeasurementChart
          isOpen={openViewModal}
          measurementId={measurementId}
          sizeOptionName={sizeOptionName}
          onCloseViewModal={handeCloseViewModal}
        />
      )}

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

      <PrintableOrderSheet order={OrderById} />
    </div>
  );
};

export default ViewOrderDetails;
