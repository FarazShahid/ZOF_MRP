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
      gradient: "from-slate-700 to-slate-800",
      border: "border-slate-600/30",
      labelClass: "text-slate-300",
      iconClass: "text-slate-300",
      status: "all" as const,
    },
    {
      title: "In Production",
      value: stats.production,
      icon: "ri-tools-line",
      gradient: "from-amber-600 to-amber-700",
      border: "border-amber-500/20",
      labelClass: "text-amber-100",
      iconClass: "text-amber-200",
      status: "Production" as OrderStatus,
    },
    {
      title: "In Transit",
      value: stats.shipped,
      icon: "ri-truck-line",
      gradient: "from-purple-600 to-purple-700",
      border: "border-purple-500/20",
      labelClass: "text-purple-100",
      iconClass: "text-purple-200",
      status: "Shipped" as OrderStatus,
    },
    {
      title: "Packing",
      value: stats.packing,
      icon: "ri-palette-line",
      gradient: "from-blue-600 to-blue-700",
      border: "border-blue-500/20",
      labelClass: "text-blue-100",
      iconClass: "text-blue-200",
      status: "Packing" as OrderStatus,
    },
    {
      title: "Completed",
      value: stats.kept_in_stock,
      icon: "ri-checkbox-circle-line",
      gradient: "from-green-600 to-green-700",
      border: "border-green-500/20",
      labelClass: "text-green-100",
      iconClass: "text-green-200",
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
            className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 border ${card.border} text-left transition-all duration-200 hover:opacity-95 cursor-pointer ${
              active ? "ring-2 ring-white/30" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`${card.labelClass} text-sm font-medium`}>{card.title}</span>
              <i className={`${card.icon} ${card.iconClass} text-2xl w-8 h-8 flex items-center justify-center`} />
            </div>
            <div className="text-3xl font-bold text-white">{card.value}</div>
          </button>
        );
      })}
    </div>
  );
};

export default OrderDashboard;
