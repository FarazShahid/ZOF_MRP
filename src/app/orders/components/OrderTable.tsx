"use client";

import { useEffect, useState } from "react";
import useOrderStore from "@/store/useOrderStore";
import useClientStore from "@/store/useClientStore";
import OrderList from "../../components/order/OrderList";

const OrderTable = () => {
  const { fetchOrders, Orders } = useOrderStore();
  const { fetchProjects, projects } = useClientStore();
  const [projectFilter, setProjectFilter] = useState<number | "all">("all");

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projectFilter !== "all" && Number.isFinite(Number(projectFilter))) {
      fetchOrders(undefined, Number(projectFilter));
    } else {
      fetchOrders();
    }
  }, [projectFilter, fetchOrders]);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded">
      <OrderList orders={Orders} projectFilter={projectFilter} onProjectFilterChange={setProjectFilter} projects={projects || []} />
    </div>
  );
};

export default OrderTable;
