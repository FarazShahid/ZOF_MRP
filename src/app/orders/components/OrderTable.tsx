"use client";

import { useEffect } from "react";
import useOrderStore from "@/store/useOrderStore";
import useClientStore from "@/store/useClientStore";
import OrderList from "../../components/order/OrderList";

const OrderTable = () => {
  const { fetchOrders, Orders } = useOrderStore();
  const { fetchClients, clients } = useClientStore();


  useEffect(() => {
     fetchClients();
      fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded">
      <OrderList clients={clients} orders={Orders} />
    </div>
  );
};

export default OrderTable;
