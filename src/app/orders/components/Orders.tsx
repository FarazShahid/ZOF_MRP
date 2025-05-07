import ActiveOrderCard from "../../dashboard/component/ActiveOrderCard";
import OrderCard from "./OrderCard";

const Orders = () => {
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
    <div className="grid grid-cols-1 gap-5 w-full h-[75vh] overflow-y-auto">
      {activeOrdersData.map((order, index) => {
        return (
          <OrderCard />
          // <ActiveOrderCard
          //   key={index}
          //   clientName={order.clientName}
          //   orderNo={order.orderNo}
          //   deadline={order.deadline}
          //   orderPercentage={order.orderPercentage}
          //   orderStatus={order.orderStatus}
          //   remaingOrderItems={order.remaingOrderItems}
          //   totalOrderItems={order.totalOrderItems}
          // />
        );
      })}
    </div>
  );
};

export default Orders;
