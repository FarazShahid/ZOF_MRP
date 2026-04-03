import React from "react";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";
import { OrderStatus } from "@/src/types/admin";

interface OrderDashboardProps {
  orders: GetOrdersType[];
  statusFilter: OrderStatus | "all";
  onStatusChange: (status: OrderStatus | "all") => void;
}

const OrderDashboard: React.FC<OrderDashboardProps> = ({ orders, statusFilter, onStatusChange }) => {
  const stats = {
    total: orders.length,
    production: orders.filter((o) => o.StatusName === "Production").length,
    shipped: orders.filter((o) => o.StatusName === "Shipped").length,
    packing: orders.filter((o) => o.StatusName === "Packing").length,
    kept_in_stock: orders.filter((o) => o.StatusName === "Kept in Stock").length,
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: "ri-shopping-bag-line",
      bg: "bg-slate-800/60",
      border: "border-slate-700/50",
      labelClass: "text-slate-400",
      iconClass: "text-slate-400",
      status: "all" as const,
    },
    {
      title: "In Production",
      value: stats.production,
      icon: "ri-tools-line",
      bg: "bg-amber-950/40",
      border: "border-amber-800/30",
      labelClass: "text-amber-400",
      iconClass: "text-amber-400",
      status: "Production" as OrderStatus,
    },
    {
      title: "In Transit",
      value: stats.shipped,
      icon: "ri-truck-line",
      bg: "bg-purple-950/40",
      border: "border-purple-800/30",
      labelClass: "text-purple-400",
      iconClass: "text-purple-400",
      status: "Shipped" as OrderStatus,
    },
    {
      title: "Packing",
      value: stats.packing,
      icon: "ri-palette-line",
      bg: "bg-blue-950/40",
      border: "border-blue-800/30",
      labelClass: "text-blue-400",
      iconClass: "text-blue-400",
      status: "Packing" as OrderStatus,
    },
    {
      title: "Completed",
      value: stats.kept_in_stock,
      icon: "ri-checkbox-circle-line",
      bg: "bg-emerald-950/40",
      border: "border-emerald-800/30",
      labelClass: "text-emerald-400",
      iconClass: "text-emerald-400",
      status: "Kept in Stock" as OrderStatus,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      {statCards.map((card) => {
        const active = statusFilter === card.status;
        return (
          <button
            key={card.title}
            type="button"
            onClick={() => onStatusChange(card.status)}
            className={`group ${card.bg} rounded-2xl p-6 border ${active ? "border-green-500" : card.border} text-left transition-all duration-200 hover:opacity-95 cursor-pointer ${
              active ? "ring-1 ring-green-500/30" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`${card.labelClass} text-sm font-medium`}>{card.title}</span>
              <i className={`${card.icon} ${card.iconClass} text-3xl w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125`} />
            </div>
            <div className="text-3xl font-bold text-white">{card.value}</div>
          </button>
        );
      })}
    </div>
  );
};

export default OrderDashboard;
