import useOrderStore from "@/store/useOrderStore";
import ActiveOrderCard from "../../dashboard/component/ActiveOrderCard";
import OrderCard from "./OrderCard";
import OrderTable from "./OrderTable";
import { useEffect } from "react";
import Link from "next/link";

const Orders = () => {
  const {fetchOrders, Orders} = useOrderStore();


  useEffect(()=>{
    fetchOrders(0);
  },[])


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
    <div className="flex flex-col gap-5">
      {/* <div className="flex justify-end items-center">
        <Link href="/addorder" className="bg-green-800 text-gray-300 rounded px-2 py-1">New Order</Link>
      </div> */}
      {/* <div className="grid grid-cols-1 gap-5 w-full overflow-y-auto">
        {Orders.map((order, index) => {
          return (
            <ActiveOrderCard
              key={index}
              clientName={order.ClientName}
              orderNo={order.OrderNumber}
              deadline={order.Deadline}
              orderPercentage={"30"}
              orderStatus={order.StatusName}
              remaingOrderItems={"30"}
              totalOrderItems={"20"}
            />
          );
        })}
      
      </div> */}
        <OrderTable />
    </div>
  );
};

export default Orders;
