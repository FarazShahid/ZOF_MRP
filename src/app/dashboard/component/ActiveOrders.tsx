import React from "react";
import ViewMoreButton from "./ViewMoreButton";
import ActiveOrderCard from "./ActiveOrderCard";

const ActiveOrders = () => {
  const activeOrdersData = [
    {
      id: 1,
      orderNo: "CR-52-FD",
      totalOrderItems: "30",
      remaingOrderItems: "50",
      orderPercentage: "70",
      deadline: "09 October 2025",
      orderStatus: "Production",
      clientName: "CRFC",
    },
    {
      id: 2,
      orderNo: "CR-02-RT",
      totalOrderItems: "130",
      remaingOrderItems: "250",
      orderPercentage: "20",
      deadline: "09 August 2025",
      orderStatus: "Production",
      clientName: "CRFC",
    },
    {
      id: 3,
      orderNo: "HM-02-RT",
      totalOrderItems: "100",
      remaingOrderItems: "50",
      orderPercentage: "50",
      deadline: "09 August 2025",
      orderStatus: "Printing",
      clientName: "CRFC",
    },
  ];

  return (
    <div className="bg-gray-950 rounded-lg p-3 shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-white">Active Order</span>
        <ViewMoreButton path="/orders" />
      </div>
      <div className="space-y-3 h-[450px] overflow-x-auto px-2">
        {activeOrdersData.map((order, index) => {
          return (
            <ActiveOrderCard
              key={index}
              clientName={order.clientName}
              orderNo={order.orderNo}
              deadline={order.deadline}
              orderPercentage={order.orderPercentage}
              orderStatus={order.orderStatus}
              remaingOrderItems={order.remaingOrderItems}
              totalOrderItems={order.totalOrderItems}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ActiveOrders;
