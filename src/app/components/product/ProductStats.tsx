import React from "react";
import { Package, CheckCircle, FlaskConical, Archive, XCircle } from "lucide-react";
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
    { title: "Total Products", value: products.length, icon: Package, bg: "bg-slate-500", onClick: () => { onStatusChange("all"); onArchivedChange("all"); }, active: statusFilter === "all" && archivedFilter === "all" },
    { title: "Approved", value: approved, icon: CheckCircle, bg: "bg-green-600", onClick: () => onStatusChange("Approved" as ProductStatus), active: statusFilter === "Approved" },
    { title: "Samples", value: sample, icon: FlaskConical, bg: "bg-blue-600", onClick: () => onStatusChange("Sample" as ProductStatus), active: statusFilter === "Sample" },
    { title: "No Status", value: emptyStatus, icon: XCircle, bg: "bg-yellow-600", onClick: () => onStatusChange("" as unknown as ProductStatus), active: (statusFilter as string) === "" },
    { title: "Archived", value: archived, icon: Archive, bg: "bg-red-600", onClick: () => onArchivedChange("archived"), active: archivedFilter === "archived" },
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
            className={`${card.bg} text-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${card.active ? 'ring-2 ring-offset-2 ring-white/80' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className="bg-white/15 p-3 rounded-lg">
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductStats;
