"use client";

import { useEffect } from "react";
import useOrderStore from "@/store/useOrderStore";
import OrderList from "../../components/order/OrderList";

const OrderTable = () => {
  const { fetchOrders, Orders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded">
      <OrderList orders={Orders} />
    </div>
  );
};

export default OrderTable;
