import React, { FC, useEffect } from "react";
import Link from "next/link";
import { IoIosStats } from "react-icons/io";
import { FaUserTie } from "react-icons/fa6";
import { FaFileImage, FaVideo } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { IoReturnDownBack } from "react-icons/io5";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import useOrderStore from "@/store/useOrderStore";
import PriorityChip from "./PriorityChip";
import OrderDeadline from "./OrderDeadline";
import ClientDetails from "./ClientDetails";
import ColorContainer from "./ColorContainer";
import OrderStatusTimeline from "./OrderStatusTimeline";
import { handleView } from "@/interface/GetFileType";

interface ViewOrderProps {
  orderId: number;
}

const ViewOrderDetails: FC<ViewOrderProps> = ({ orderId }) => {
  const { getOrderById, OrderById } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId);
    }
  }, [orderId]);

  return (
    <div className="space-y-5 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={"/orders"} className="p-1 border-1 rounded">
            <IoReturnDownBack />
          </Link>
          <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-900">{OrderById?.OrderNumber}</h2>
        </div>
        <button
          className="px-3 py-1 flex items-center gap-1 bg-green-900 rounded-lg text-sm text-gray-400"
          type="button"
        >
          <BsFileEarmarkPdfFill /> PDF
        </button>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-[75%] flex flex-col gap-5">
          <div className=" flex items-center gap-10 dark:bg-[#161616] bg-gray-300 rounded p-4 shadow-lg">
            <OrderDeadline deadline={OrderById?.Deadline} />
            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex items-center justify-center border-1  dark:bg-default-100 bg-gray-500 border-default-200/50 rounded-small w-11 h-11">
                <IoIosStats size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-medium dark:text-foreground text-gray-700 font-medium">
                  {OrderById?.StatusName}
                </p>
                <p className="text-xs dark:text-foreground text-gray-700 font-medium">
                  Current Status
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3  text-gray-400">
              <div className="flex items-center justify-center border-1  bg-default-100 border-default-200/50 rounded-small w-11 h-11">
                <FaUserTie size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-medium text-foreground font-medium">
                  {OrderById?.ClientName}
                </p>
                <p className="text-xs text-foreground font-medium">
                  {OrderById?.EventName}
                </p>
              </div>
            </div>
          </div>
          {OrderById?.items.map((orderItem, index) => {
            return (
              <div
                className="bg-[#161616] rounded p-4 flex flex-col gap-3 shadow-lg text-gray-400"
                key={index}
              >
                <p>
                  {orderItem?.ProductCategoryName}_
                  {orderItem?.ProductFabricName}_{orderItem?.ProductFabricGSM}
                </p>

                {orderItem?.orderItemDetails?.map((detail, index) => {
                  return (
                    <div
                      className="grid grid-cols-4 gap-8"
                      key={`${index}_${detail?.ColorOptionId}`}
                    >
                      <ColorContainer
                        key={detail?.ColorOptionId}
                        ColorOptionName={detail?.ColorOptionName}
                        ColorOptionId={detail.ColorOptionId}
                      />
                      <div className="flex items-center gap-5 text-sm">
                        <span>Priority: </span>
                        <PriorityChip priority={detail?.Priority} />
                      </div>
                      <div className="flex items-center gap-5 text-sm">
                        <span>Qunatity: </span>
                        <span>{detail?.Quantity}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-5 text-sm" >
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
                <p>Documents:</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {orderItem.ImagePath && orderItem.ImagePath ? (
                    <button
                      type="button"
                      onClick={() => handleView(orderItem.ImagePath)}
                      className="flex gap-2 bg-gray-dark p-2 rounded-lg cursor-pointer text-blue-500"
                    >
                      <FaFileImage />
                      <span className="text-xs">Image File</span>
                    </button>
                  ) : (
                    <></>
                  )}
                  {orderItem.FilePath && orderItem.FilePath ? (
                    <button
                      type="button"
                      onClick={() => handleView(orderItem.FilePath)}
                      className="flex gap-2 bg-gray-dark p-2 rounded-lg cursor-pointer text-blue-500"
                    >
                      <CgFileDocument />
                      <span className="text-xs">Doc File</span>
                    </button>
                  ) : (
                    <></>
                  )}
                  {orderItem.VideoPath && orderItem.VideoPath ? (
                    <button
                      type="button"
                      onClick={() => handleView(orderItem.VideoPath)}
                      className="flex gap-2 bg-gray-dark p-2 rounded-lg cursor-pointer text-blue-500"
                    >
                      <FaVideo />
                      <span className="text-xs">Video File</span>
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-[25%] flex flex-col gap-2">
          <div className="p-3 bg-[#161616] shadow-lg  flex flex-col gap-5 rounded text-gray-400">
            <p className="text-sm">Status Timeline</p>
            <OrderStatusTimeline />
          </div>
          <ClientDetails clientId={OrderById?.ClientId} />
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
