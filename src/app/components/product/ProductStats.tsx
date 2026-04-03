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
    { title: "Total Products", value: products.length, icon: Package, bg: "bg-blue-950/40", border: "border-blue-800/30", labelCls: "text-blue-400", iconCls: "text-blue-400", onClick: () => { onStatusChange("all"); onArchivedChange("all"); }, active: statusFilter === "all" && archivedFilter === "all" },
    { title: "Approved", value: approved, icon: CheckCircle, bg: "bg-emerald-950/40", border: "border-emerald-800/30", labelCls: "text-emerald-400", iconCls: "text-emerald-400", onClick: () => { onStatusChange("Approved" as ProductStatus); onArchivedChange("all"); }, active: statusFilter === "Approved" && archivedFilter !== "archived" },
    { title: "Samples", value: sample, icon: FlaskConical, bg: "bg-purple-950/40", border: "border-purple-800/30", labelCls: "text-purple-400", iconCls: "text-purple-400", onClick: () => { onStatusChange("Sample" as ProductStatus); onArchivedChange("all"); }, active: statusFilter === "Sample" && archivedFilter !== "archived" },
    { title: "Pending", value: emptyStatus, icon: HelpCircle, bg: "bg-amber-950/40", border: "border-amber-800/30", labelCls: "text-amber-400", iconCls: "text-amber-400", onClick: () => { onStatusChange("" as unknown as ProductStatus); onArchivedChange("all"); }, active: (statusFilter as string) === "" && archivedFilter !== "archived" },
    { title: "Archived", value: archived, icon: Archive, bg: "bg-slate-800/60", border: "border-slate-700/50", labelCls: "text-slate-400", iconCls: "text-slate-400", onClick: () => { onArchivedChange("archived"); onStatusChange("all"); }, active: archivedFilter === "archived" },
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
          className={`${card.bg} rounded-2xl p-6 border ${card.active ? "border-green-500" : card.border} cursor-pointer transition-all hover:opacity-95 ${card.active ? "ring-1 ring-green-500/30" : ""}`}
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
