"use client";

import React, { useEffect } from "react";
import useClientStore from "@/store/useClientStore";
import useProductStore from "@/store/useProductStore";
import useOrderStore from "@/store/useOrderStore";
import { RxFileText } from "react-icons/rx";
import { IoShirt } from "react-icons/io5";
import { FaUsers, FaWarehouse } from "react-icons/fa";
import Widget from "./Widget";

const DashboardWidgetContainer = () => {
  const { fetchClients, clients } = useClientStore();
  const { fetchProducts, products } = useProductStore();
  const { fetchOrders, Orders } = useOrderStore();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchClients(),
        fetchProducts(),
        fetchOrders(0),
      ]);
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <Widget
        total={Orders.length}
        title="Total Orders"
        icon={<RxFileText />}
        iconBg="#b91c1c"
      />
      <Widget
        total={products.length}
        title="Total Products"
        icon={<IoShirt />}
        iconBg="#2563eb"
      />
      <Widget
        total={clients.length}
        title="Total Clients"
        icon={<FaUsers />}
        iconBg="#ca8a04"
      />
      <Widget
        total={0}
        title="Inventory"
        icon={<FaWarehouse />}
        iconBg="#138c9f"
      />
    </div>
  );
};

export default DashboardWidgetContainer;
