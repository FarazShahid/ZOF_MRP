import React from "react";
import { GoDotFill } from "react-icons/go";

const OrderItemStatusChip = ({ status }: { status: string }) => {
    let chipStyle = "";
    if(status=== "delivered"){
        chipStyle = "text-green-500 bg-green-100";
    }else if(status === "pending"){
        chipStyle = "text-[#f59e0b] bg-[#e4e4c9]"
    }
  return (
    <div className={`rounded-full flex items-center text-xs  ${chipStyle}`}>
      <GoDotFill size={22} /> <span className="pr-2 capitalize">{status}</span>
    </div>
  );
};

export default OrderItemStatusChip;
