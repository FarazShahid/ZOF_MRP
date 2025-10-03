import React from "react";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { GetAllShipments } from "@/store/useShipmentStore";

interface DashboardProps {
  shipments: GetAllShipments[];
}

const ShipmentStats: React.FC<DashboardProps> = ({ shipments }) => {
  const stats = {
    total: shipments?.length,
    pending: shipments?.filter((s) => s.Status === "Damaged").length,
    shipped: shipments?.filter((s) => s.Status === "In Transit").length,
    delivered: shipments?.filter((s) => s.Status === "Delivered").length,
    cancelled: shipments?.filter((s) => s.Status === "cancelled").length,
  };

  const statCards = [
    {
      title: "Total Shipments",
      value: stats.total,
      icon: Package,
      bgColor: "bg-slate-400",
      textColor: "text-white",
      iconBg: "bg-slate-400",
    },
    {
      title: "In Transit",
      value: stats.shipped,
      icon: Truck,
      bgColor: "bg-blue-500",
      textColor: "text-white",
      iconBg: "bg-blue-600",
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      bgColor: "bg-green-500",
      textColor: "text-white",
      iconBg: "bg-green-600",
    },
    {
      title: "Damaged Shipments",
      value: stats.pending,
      icon: Clock,
      bgColor: "bg-yellow-500",
      textColor: "text-white",
      iconBg: "bg-yellow-600",
    },

    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      bgColor: "bg-red-500",
      textColor: "text-white",
      iconBg: "bg-red-600",
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`${card.textColor} ${card.bgColor} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.iconBg} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentStats;
