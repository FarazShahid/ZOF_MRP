import React from "react";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
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
    pending: shipments?.filter((s) => s.Status === "Damaged").length,
    shipped: shipments?.filter((s) => s.Status === "In Transit").length,
    delivered: shipments?.filter((s) => s.Status === "Delivered").length,
    cancelled: shipments?.filter((s) => s.Status === "Cancelled").length,
  };

  const statCards = [
    {
      title: "Total Shipments",
      value: stats.total,
      icon: Package,
      bgColor: "bg-slate-400",
      textColor: "text-white",
      iconBg: "bg-slate-600",
      seal: "/Seal 1.png",
      onClick: () => onStatusChange('all' as const),
      active: statusFilter === 'all'
    },
    {
      title: "In Transit",
      value: stats.shipped,
      icon: Truck,
      bgColor: "bg-blue-500",
      textColor: "text-white",
      iconBg: "bg-blue-600",
      seal: "/Seal 2.png",
      onClick: () => onStatusChange('In Transit' as ShipmentStatus),
      active: statusFilter === 'In Transit'
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      bgColor: "bg-green-500",
      textColor: "text-white",
      iconBg: "bg-green-600",
      seal: "/Seal 3.png",
      onClick: () => onStatusChange('Delivered' as ShipmentStatus),
      active: statusFilter === 'Delivered'
    },
    {
      title: "Damaged Shipments",
      value: stats.pending,
      icon: Clock,
      bgColor: "bg-yellow-500",
      textColor: "text-white",
      iconBg: "bg-yellow-600",
      seal: "/Seal 4.png",
      onClick: () => onStatusChange('Damaged' as ShipmentStatus),
      active: statusFilter === 'Damaged'
    },

    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      bgColor: "bg-red-500",
      textColor: "text-white",
      iconBg: "bg-red-600",
      seal: "/Seal 5.png",
      onClick: () => onStatusChange('Cancelled' as ShipmentStatus),
      active: statusFilter === 'Cancelled'
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            role="button"
            tabIndex={0}
            aria-pressed={card.active}
            onClick={card.onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') card.onClick(); }}
            className={`${card.textColor} ${card.bgColor} rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden ${card.active ? 'ring-2 ring-offset-2 ring-white/80' : ''}`}
          >
            {/* Decorative seal image */}
            <div className="pointer-events-none absolute -right-4 -bottom-6 group-hover:opacity-30 transition-opacity duration-300">
              <div className="relative w-28 h-28 transform group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300 ease-out">
                <Image src={card.seal} alt="decorative seal" fill className="object-contain" sizes="112px" />
              </div>
            </div>

            {/* Soft radial highlight on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden>
              <div className="absolute -inset-16 rounded-full bg-white/5 blur-2xl group-hover:scale-105 transition-transform" />
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div className={`${card.iconBg} p-3 rounded-lg transform group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-90">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentStats;
