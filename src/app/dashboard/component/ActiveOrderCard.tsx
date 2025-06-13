import React from "react";
import { Progress, Tooltip } from "@heroui/react";
import { IoCalendarNumber } from "react-icons/io5";
import { GiProgression } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { formatDate } from "../../interfaces";

export interface ComponentProp {
  orderNo: string;
  totalOrderItems: string;
  remaingOrderItems: string;
  orderPercentage: string;
  deadline: string;
  orderStatus: string;
  clientName: string;
}

const ActiveOrderCard: React.FC<ComponentProp> = ({
  orderNo,
  totalOrderItems,
  remaingOrderItems,
  orderPercentage,
  deadline,
  orderStatus,
  clientName,
}) => {
  return (
    <div className="rounded-2xl bg-gray-100 p-3 dark:border-[#1d2939] dark:bg-[#353535] space-y-4">
      <div className="flex items-center gap-5">
        <span className="dark:text-white text-gray-800">{orderNo}</span>
        <div className="h-6 w-0 border-1 border-gray-700" />
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Total finished: {totalOrderItems}pcs</span>
          <span className="text-xs text-gray-500">.__.</span>
          <span className="text-sm text-gray-500">
            Requaired qunatity: {remaingOrderItems}pcs
          </span>
        </div>
      </div>
      <Tooltip content={`${orderPercentage}%`}>
        <Progress
          aria-label="Loading..."
          color="success"
          value={Number(orderPercentage)}
        />
      </Tooltip>

      <div className="grid grid-cols-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <IoCalendarNumber size={18} />
            <span className="uppercase dark:text-gray-500 text-gray-800">expected finished date</span>
          </div>
          <span className="text-sm dark:text-white text-black pl-7">{formatDate(deadline)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <GiProgression size={18} />
            <span className="uppercase dark:text-gray-500 text-gray-800">current status</span>
          </div>
          <span className="text-sm dark:text-white text-black pl-7">{orderStatus}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <FaUserCircle size={18} />
            <span className="uppercase  dark:text-gray-500 text-gray-800">client Name</span>
          </div>
          <span className="text-sm dark:text-white text-black pl-7">{clientName}</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveOrderCard;
