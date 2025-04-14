"use client";
import React, { useEffect, useMemo } from "react";
import useClientStore from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";
import ClientOrdersPieChart from "./ClientOrdersPieChart";
import TotalCardData from "./TotalCardData";
import { FaUser } from "react-icons/fa";
import { FaTshirt } from "react-icons/fa";
import { MdFireTruck } from "react-icons/md";
import { RiAlignItemBottomLine } from "react-icons/ri";
import useSupplierStore from "@/store/useSupplierStore";
import useProductStore from "@/store/useProductStore";

export const EcommerceMetrics = () => {
  const { fetchClients, clients } = useClientStore();
  const { fetchOrders, Orders } = useOrderStore();
  const { fetchSuppliers, suppliers } = useSupplierStore();
  const { fetchProducts, products } = useProductStore();

  useEffect(() => {
    fetchClients();
    fetchOrders(0);
    fetchSuppliers();
    fetchProducts();
  }, []);

  const clientOrderData = useMemo(() => {
    if (!clients || !Orders) return [];

    return clients.map((client) => {
      const orderCount = Orders.filter(
        (order) => order.ClientId === client.Id
      ).length;
      return {
        name: client.Name,
        orders: orderCount,
      };
    });
  }, [clients, Orders]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Order Insight
        </h3>
        <ClientOrdersPieChart data={clientOrderData} />
      </div>
      <div className="grid grid-cols-1 gap-1 md:grid-cols-1 lg:grid-cols-2">
        <TotalCardData
          name="Clients"
          icon={<FaUser />}
          total={clients?.length || 0}
        />
        <TotalCardData
          name="Suppliers"
          icon={<MdFireTruck size={22} />}
          total={suppliers?.length || 0}
        />
        <TotalCardData
          name="Products"
          icon={<FaTshirt size={22} />}
          total={products?.length || 0}
        />
        <TotalCardData
          name="Orders"
          icon={<RiAlignItemBottomLine size={22} />}
          total={Orders?.length || 0}
        />
      </div>
    </div>
  );
};
