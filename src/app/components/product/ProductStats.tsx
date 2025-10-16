import React from "react";
import { Package, CheckCircle, FlaskConical, Archive, XCircle } from "lucide-react";
import Image from "next/image";
import { Product } from "@/store/useProductStore";
import { ProductStatus } from "@/src/types/product";

interface Props {
  products: Product[];
  statusFilter: ProductStatus | "all";
  onStatusChange: (status: ProductStatus | "all") => void;
  archivedFilter: "all" | "active" | "archived";
  onArchivedChange: (v: "all" | "active" | "archived") => void;
}

const ProductStats: React.FC<Props> = ({ products, statusFilter, onStatusChange, archivedFilter, onArchivedChange }) => {
  const approved = products.filter(p => (p.productStatus || "").toLowerCase() === "approved").length;
  const sample = products.filter(p => (p.productStatus || "").toLowerCase() === "sample").length;
  const emptyStatus = products.filter(p => !p.productStatus).length;
  const archived = products.filter(p => p.isArchived).length;

  const cards = [
    { title: "Total Products", value: products.length, icon: Package, bg: "bg-slate-500", iconBg: "bg-slate-700", seal: "/Seal 1.png", onClick: () => { onStatusChange("all"); onArchivedChange("all"); }, active: statusFilter === "all" && archivedFilter === "all" },
    { title: "Approved", value: approved, icon: CheckCircle, bg: "bg-green-600", iconBg: "bg-green-800", seal: "/Seal 2.png", onClick: () => onStatusChange("Approved" as ProductStatus), active: statusFilter === "Approved" },
    { title: "Samples", value: sample, icon: FlaskConical, bg: "bg-blue-600", iconBg: "bg-blue-800", seal: "/Seal 3.png", onClick: () => onStatusChange("Sample" as ProductStatus), active: statusFilter === "Sample" },
    { title: "No Status", value: emptyStatus, icon: XCircle, bg: "bg-yellow-600", iconBg: "bg-yellow-800", seal: "/Seal 4.png", onClick: () => onStatusChange("" as unknown as ProductStatus), active: (statusFilter as string) === "" },
    { title: "Archived", value: archived, icon: Archive, bg: "bg-red-600", iconBg: "bg-red-800", seal: "/Seal 5.png", onClick: () => onArchivedChange("archived"), active: archivedFilter === "archived" },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(card => (
          <div
            key={card.title}
            role="button"
            tabIndex={0}
            aria-pressed={card.active}
            onClick={card.onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') card.onClick(); }}
            className={`${card.bg} text-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden ${card.active ? 'ring-2 ring-offset-2 ring-white/80' : ''}`}
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

export default ProductStats;
