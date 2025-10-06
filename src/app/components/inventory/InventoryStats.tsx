import React from "react";
import { Package, AlertTriangle, Boxes, Ruler, Warehouse } from "lucide-react";
import { InventoryItemResponse } from "@/store/useInventoryItemsStore";

interface Props {
  items: InventoryItemResponse[];
}

const InventoryStats: React.FC<Props> = ({ items }) => {
  const total = items.length;
  const lowStock = items.filter((i) => Number(i.Stock) <= Number(i.ReorderLevel)).length;
  const withUom = items.filter((i) => Boolean(i.UnitOfMeasureId || i.UnitOfMeasureName)).length;
  const withSupplier = items.filter((i) => Boolean(i.SupplierName)).length;
  const withoutSubcategory = items.filter((i) => !i.SubCategoryName).length;

  const cards = [
    { title: "Total Items", value: total, icon: Package, bg: "bg-slate-500" },
    { title: "Low Stock", value: lowStock, icon: AlertTriangle, bg: "bg-red-600" },
    { title: "With UOM", value: withUom, icon: Ruler, bg: "bg-blue-600" },
    { title: "With Supplier", value: withSupplier, icon: Warehouse, bg: "bg-green-600" },
    { title: "No Subcategory", value: withoutSubcategory, icon: Boxes, bg: "bg-yellow-600" },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} text-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
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


