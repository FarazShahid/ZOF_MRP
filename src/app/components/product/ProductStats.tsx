import React from "react";
import { Package, CheckCircle, FlaskConical, Archive, HelpCircle } from "lucide-react";
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
    { title: "Total Products", value: products.length, icon: Package, gradient: "from-blue-600 to-blue-700", border: "border-blue-500/20", labelCls: "text-blue-100", iconCls: "text-blue-200", onClick: () => { onStatusChange("all"); onArchivedChange("all"); }, active: statusFilter === "all" && archivedFilter === "all" },
    { title: "Approved", value: approved, icon: CheckCircle, gradient: "from-green-600 to-green-700", border: "border-green-500/20", labelCls: "text-green-100", iconCls: "text-green-200", onClick: () => onStatusChange("Approved" as ProductStatus), active: statusFilter === "Approved" },
    { title: "Samples", value: sample, icon: FlaskConical, gradient: "from-purple-600 to-purple-700", border: "border-purple-500/20", labelCls: "text-purple-100", iconCls: "text-purple-200", onClick: () => onStatusChange("Sample" as ProductStatus), active: statusFilter === "Sample" },
    { title: "Pending", value: emptyStatus, icon: HelpCircle, gradient: "from-yellow-600 to-yellow-700", border: "border-yellow-500/20", labelCls: "text-yellow-100", iconCls: "text-yellow-200", onClick: () => onStatusChange("" as unknown as ProductStatus), active: (statusFilter as string) === "" },
    { title: "Archived", value: archived, icon: Archive, gradient: "from-slate-600 to-slate-700", border: "border-slate-500/20", labelCls: "text-slate-100", iconCls: "text-slate-200", onClick: () => onArchivedChange("archived"), active: archivedFilter === "archived" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      {cards.map(card => (
        <div
          key={card.title}
          role="button"
          tabIndex={0}
          aria-pressed={card.active}
          onClick={card.onClick}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") card.onClick(); }}
          className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 border ${card.border} cursor-pointer transition-all hover:opacity-95 ${card.active ? "ring-2 ring-offset-2 ring-white/50" : ""}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`${card.labelCls} text-sm font-medium`}>{card.title}</span>
            <card.icon className={`w-8 h-8 flex items-center justify-center ${card.iconCls}`} />
          </div>
          <div className="text-3xl font-bold text-white">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;
