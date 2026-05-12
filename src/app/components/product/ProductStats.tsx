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
    { title: "Total Products", value: products.length, icon: Package, bg: "bg-gradient-to-br from-blue-600 to-blue-700", border: "border-blue-500/20", labelCls: "text-blue-100", iconCls: "text-blue-200", onClick: () => { onStatusChange("all"); onArchivedChange("all"); }, active: statusFilter === "all" && archivedFilter === "all" },
    { title: "Approved", value: approved, icon: CheckCircle, bg: "bg-gradient-to-br from-green-600 to-green-700", border: "border-green-500/20", labelCls: "text-green-100", iconCls: "text-green-200", onClick: () => { onStatusChange("Approved" as ProductStatus); onArchivedChange("all"); }, active: statusFilter === "Approved" && archivedFilter !== "archived" },
    { title: "Samples", value: sample, icon: FlaskConical, bg: "bg-gradient-to-br from-purple-600 to-purple-700", border: "border-purple-500/20", labelCls: "text-purple-100", iconCls: "text-purple-200", onClick: () => { onStatusChange("Sample" as ProductStatus); onArchivedChange("all"); }, active: statusFilter === "Sample" && archivedFilter !== "archived" },
    { title: "Pending", value: emptyStatus, icon: HelpCircle, bg: "bg-gradient-to-br from-amber-500 to-orange-600", border: "border-amber-400/20", labelCls: "text-amber-50", iconCls: "text-amber-100", onClick: () => { onStatusChange("" as unknown as ProductStatus); onArchivedChange("all"); }, active: (statusFilter as string) === "" && archivedFilter !== "archived" },
    { title: "Archived", value: archived, icon: Archive, bg: "bg-gradient-to-br from-slate-600 to-slate-700", border: "border-slate-500/20", labelCls: "text-slate-100", iconCls: "text-slate-200", onClick: () => { onArchivedChange("archived"); onStatusChange("all"); }, active: archivedFilter === "archived" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3 xl:grid-cols-5">
      {cards.map(card => (
        <div
          key={card.title}
          role="button"
          tabIndex={0}
          aria-pressed={card.active}
          onClick={card.onClick}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") card.onClick(); }}
          className={`${card.bg} rounded-2xl p-6 border cursor-pointer transition-all hover:opacity-95 ${
            card.active
              ? "border-2 border-white ring-4 ring-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.35)]"
              : card.border
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`${card.labelCls} text-sm font-medium`}>{card.title}</span>
            <card.icon className={`w-8 h-8 ${card.iconCls}`} />
          </div>
          <div className="text-3xl font-bold text-white">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;
