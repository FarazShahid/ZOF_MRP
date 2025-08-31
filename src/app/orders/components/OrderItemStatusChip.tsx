import { OrderItemShipmentEnum } from "@/interface";
import React from "react";
import { GoDotFill } from "react-icons/go";

const OrderItemStatusChip = ({ status }: { status: string | undefined }) => {
    let chipStyle = "";
    if(status=== OrderItemShipmentEnum.SHIPPED){
        chipStyle = "text-green-500 bg-green-100";
    }else if(status === OrderItemShipmentEnum.PENDING){
        chipStyle = "text-[#f59e0b] bg-[#e4e4c9]"
    }else if(status === OrderItemShipmentEnum.PARTIALLY_SHIPPED){
      chipStyle = "text-blue-500 bg-blue-100";
    }
  return (
    <div className={`rounded-full flex items-center text-xs  ${chipStyle}`}>
      <GoDotFill size={22} /> <span className="pr-2 capitalize">{status}</span>
    </div>
  );
};

export default OrderItemStatusChip;
