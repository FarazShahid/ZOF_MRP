import React, { useMemo } from "react";
import { Search } from "lucide-react";
import { InventoryItemResponse } from "@/store/useInventoryItemsStore";

interface Props {
  searchTerm: string;
  onSearchChange: (v: string) => void;

  categoryFilter: number | "all";
  onCategoryChange: (v: number | "all") => void;

  subCategoryFilter: string | "all";
  onSubCategoryChange: (v: string | "all") => void;

  supplierFilter: string | "all";
  onSupplierChange: (v: string | "all") => void;

  uomFilter: string | "all";
  onUomChange: (v: string | "all") => void;

  stockFilter: "all" | "low" | "normal" | "high";
  onStockChange: (v: "all" | "low" | "normal" | "high") => void;

  items: InventoryItemResponse[];
}

const InventorySeachAndFilter: React.FC<Props> = ({
  searchTerm, onSearchChange,
  categoryFilter, onCategoryChange,
  subCategoryFilter, onSubCategoryChange,
  supplierFilter, onSupplierChange,
  uomFilter, onUomChange,
  stockFilter, onStockChange,
  items
}) => {

  const categories = useMemo(
    () => Array.from(new Set(items.map(i => i.CategoryId))).
      map(id => ({ id, name: `Cat-${id}` })).
      sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [items]
  );

  const subCategories = useMemo(
    () => Array.from(new Set(items.map(i => i.SubCategoryName || ""))).
      filter(Boolean).
      map(name => ({ name })).
      sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [items]
  );

  const suppliers = useMemo(
    () => Array.from(new Set(items.map(i => i.SupplierName || "")))
      .filter(Boolean)
      .map(name => ({ name }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [items]
  );

  const uoms = useMemo(
    () => Array.from(new Set(items.map(i => i.UnitOfMeasureShortForm || i.UnitOfMeasureName || "")))
      .filter(Boolean)
      .map(name => ({ name }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [items]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, code, category, supplier..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Category */}
        <div className="min-w-40">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sub Category */}
        <div className="min-w-40">
          <select
            value={subCategoryFilter}
            onChange={(e) => onSubCategoryChange(e.target.value as string | "all")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Sub Categories</option>
            {subCategories.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div className="min-w-40">
          <select
            value={supplierFilter}
            onChange={(e) => onSupplierChange(e.target.value as string | "all")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Suppliers</option>
            {suppliers.map(s => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* UOM */}
        <div className="min-w-40">
          <select
            value={uomFilter}
            onChange={(e) => onUomChange(e.target.value as string | "all")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All UOMs</option>
            {uoms.map(u => (
              <option key={u.name} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Stock Level */}
        <div className="min-w-36">
          <select
            value={stockFilter}
            onChange={(e) => onStockChange(e.target.value as "all" | "low" | "normal" | "high")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Stock</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InventorySeachAndFilter;


