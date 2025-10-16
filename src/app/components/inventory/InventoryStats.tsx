import React from "react";
import { Package, AlertTriangle, Boxes, Ruler, Warehouse } from "lucide-react";
import Image from "next/image";
import { InventoryItemResponse } from "@/store/useInventoryItemsStore";

type QuickFilter = "all" | "lowStock" | "withUom" | "withSupplier" | "noSubcategory";

interface Props {
  items: InventoryItemResponse[];
  quickFilter: QuickFilter;
  onQuickFilterChange: (filter: QuickFilter) => void;
}

const InventoryStats: React.FC<Props> = ({ items, quickFilter, onQuickFilterChange }) => {
  const total = items.length;
  const lowStock = items.filter((i) => Number(i.Stock) <= Number(i.ReorderLevel)).length;
  const withUom = items.filter((i) => Boolean(i.UnitOfMeasureId || i.UnitOfMeasureName)).length;
  const withSupplier = items.filter((i) => Boolean(i.SupplierName)).length;
  const withoutSubcategory = items.filter((i) => !i.SubCategoryName).length;

  const cards = [
    { title: "Total Items", value: total, icon: Package, bg: "bg-slate-500", iconBg: "bg-slate-700", seal: "/Seal 1.png", onClick: () => onQuickFilterChange("all" as QuickFilter), active: quickFilter === "all" },
    { title: "Low Stock", value: lowStock, icon: AlertTriangle, bg: "bg-red-600", iconBg: "bg-red-800", seal: "/Seal 2.png", onClick: () => onQuickFilterChange("lowStock" as QuickFilter), active: quickFilter === "lowStock" },
    { title: "With UOM", value: withUom, icon: Ruler, bg: "bg-blue-600", iconBg: "bg-blue-800", seal: "/Seal 3.png", onClick: () => onQuickFilterChange("withUom" as QuickFilter), active: quickFilter === "withUom" },
    { title: "With Supplier", value: withSupplier, icon: Warehouse, bg: "bg-green-600", iconBg: "bg-green-800", seal: "/Seal 4.png", onClick: () => onQuickFilterChange("withSupplier" as QuickFilter), active: quickFilter === "withSupplier" },
    { title: "No Subcategory", value: withoutSubcategory, icon: Boxes, bg: "bg-yellow-600", iconBg: "bg-yellow-800", seal: "/Seal 5.png", onClick: () => onQuickFilterChange("noSubcategory" as QuickFilter), active: quickFilter === "noSubcategory" },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
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

export default InventoryStats;


