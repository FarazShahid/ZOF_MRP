import React from "react";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { GetAllShipments } from "@/store/useShipmentStore";
import { ShipmentStatus } from "@/src/types/admin";

interface DashboardProps {
  shipments: GetAllShipments[];
  statusFilter: ShipmentStatus | 'all';
  onStatusChange: (status: ShipmentStatus | 'all') => void;
}

const ShipmentStats: React.FC<DashboardProps> = ({ shipments, statusFilter, onStatusChange }) => {
  const stats = {
    total: shipments?.length,
    shipped: shipments?.filter((s) => s.Status === "In Transit").length,
    delivered: shipments?.filter((s) => s.Status === "Delivered").length,
    cancelled: shipments?.filter((s) => s.Status === "Cancelled").length,
  };

  const statCards = [
    {
      title: "Total Shipments",
      value: stats.total,
      icon: Package,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/10",
      onClick: () => onStatusChange('all' as const),
      active: statusFilter === 'all'
    },
    {
      title: "In Transit",
      value: stats.shipped,
      icon: Truck,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/10",
      onClick: () => onStatusChange('In Transit' as ShipmentStatus),
      active: statusFilter === 'In Transit'
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 dark:bg-cyan-500/10",
      onClick: () => onStatusChange('Delivered' as ShipmentStatus),
      active: statusFilter === 'Delivered'
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/10",
      onClick: () => onStatusChange('Cancelled' as ShipmentStatus),
      active: statusFilter === 'Cancelled'
    },
  ];

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            role="button"
            tabIndex={0}
            aria-pressed={card.active}
            onClick={card.onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') card.onClick(); }}
            className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${card.active ? 'ring-1 ring-emerald-500 dark:ring-emerald-500' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">{card.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentStats;
