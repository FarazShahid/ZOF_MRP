import React from "react";
import { Package, AlertTriangle, Boxes, Ruler, Warehouse } from "lucide-react";
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
    { title: "Total Items", value: total, icon: Package, bg: "bg-slate-500", onClick: () => onQuickFilterChange("all" as QuickFilter), active: quickFilter === "all" },
    { title: "Low Stock", value: lowStock, icon: AlertTriangle, bg: "bg-red-600", onClick: () => onQuickFilterChange("lowStock" as QuickFilter), active: quickFilter === "lowStock" },
    { title: "With UOM", value: withUom, icon: Ruler, bg: "bg-blue-600", onClick: () => onQuickFilterChange("withUom" as QuickFilter), active: quickFilter === "withUom" },
    { title: "With Supplier", value: withSupplier, icon: Warehouse, bg: "bg-green-600", onClick: () => onQuickFilterChange("withSupplier" as QuickFilter), active: quickFilter === "withSupplier" },
    { title: "No Subcategory", value: withoutSubcategory, icon: Boxes, bg: "bg-yellow-600", onClick: () => onQuickFilterChange("noSubcategory" as QuickFilter), active: quickFilter === "noSubcategory" },
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

export default InventoryStats;


