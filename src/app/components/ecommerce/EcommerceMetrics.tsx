"use client";
import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { RiBox3Line } from "react-icons/ri";
import Badge from "../ui/badge/Badge";
import useClientStore from "@/store/useClientStore";
import useOrderStore from "@/store/useOrderStore";

export const EcommerceMetrics = () => {
  const { fetchClients, clients } = useClientStore();
  const { fetchOrders, Orders } = useOrderStore();


  const [clientPercentage, setClientPercentage] = useState(0);
  const [orderPercentage, setOrderPercentage] = useState(0);

  const filterByMonth = (data: any[], month: number, year: number) => {
    return data.filter((item) => {
      const createdDate = new Date(item.CreatedOn);
      return createdDate.getMonth() === month && createdDate.getFullYear() === year;
    });
  };

  const calculatePercentageChange = (newData: number, oldData: number) => {
    if (oldData === 0) return newData === 0 ? 0 : 100;
    return ((newData - oldData) / oldData) * 100;
  };


  useEffect(() => {
    fetchClients();
    fetchOrders(0);
  }, []);

  useEffect(() => {
    if (clients && Orders) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Filter clients and orders for current and previous months
      const currentClients = filterByMonth(clients, currentMonth, currentYear);
      const previousClients = filterByMonth(clients, currentMonth - 1, currentYear);
      const currentOrders = filterByMonth(Orders, currentMonth, currentYear);
      const previousOrders = filterByMonth(Orders, currentMonth - 1, currentYear);

      // Calculate the percentage change for clients and orders
      setClientPercentage(calculatePercentageChange(currentClients.length, previousClients.length));
      setOrderPercentage(calculatePercentageChange(currentOrders.length, previousOrders.length));
    }
  }, [clients, Orders]);


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FiUsers className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Clients
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {clients?.length || 0}
            </h4>
          </div>
          <Badge color={clientPercentage > 0 ? "success" : "error"}>
            {clientPercentage > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(clientPercentage).toFixed(2)}%
          </Badge>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <RiBox3Line className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {Orders?.length || 0}
            </h4>
          </div>

          <Badge color={orderPercentage > 0 ? "success" : "error"}>
            {orderPercentage > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(orderPercentage).toFixed(2)}%
          </Badge>
        </div>
      </div>
    </div>
  );
};
