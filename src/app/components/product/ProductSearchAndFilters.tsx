import React, { useMemo } from "react";
import { Search } from "lucide-react";
import { Product } from "@/store/useProductStore";
import { ProductStatus } from "@/src/types/product";

interface Props {
  searchTerm: string;
  onSearchChange: (v: string) => void;

  statusFilter: ProductStatus | "all";
  onStatusChange: (v: ProductStatus | "all") => void;

  categoryFilter: number | "all";
  onCategoryChange: (v: number | "all") => void;

  clientFilter: number | "all";
  onClientChange: (v: number | "all") => void;

  projectFilter: number | "all";
  onProjectChange: (v: number | "all") => void;

  fabricFilter: number | "all";
  onFabricChange: (v: number | "all") => void;

  archivedFilter: "all" | "active" | "archived";
  onArchivedChange: (v: "all" | "active" | "archived") => void;

  dateRange: { start: string; end: string };
  onDateRangeChange: (v: { start: string; end: string }) => void;

  products: Product[];
  projects?: Array<{ Id: number; Name: string; ClientId: number }>;
}

const ProductSearchAndFilters: React.FC<Props> = ({
  searchTerm, onSearchChange,
  statusFilter, onStatusChange,
  categoryFilter, onCategoryChange,
  clientFilter, onClientChange,
  projectFilter, onProjectChange,
  fabricFilter, onFabricChange,
  archivedFilter, onArchivedChange,
  dateRange, onDateRangeChange,
  products,
  projects = []
}) => {

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => `${p.ProductCategoryId}|${p.ProductCategoryName}`)))
      .map(str => {
        const [id, name] = str.split("|");
        return { id: Number(id), name };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const clients = useMemo(
    () => Array.from(new Set(products.map(p => `${p.ClientId}|${p.ClientName}`)))
      .map(str => {
        const [id, name] = str.split("|");
        return { id: Number(id), name };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const fabrics = useMemo(
    () => Array.from(new Set(products.map(p => `${p.FabricTypeId}|${p.FabricType}`)))
      .map(str => {
        const [id, name] = str.split("|");
        return { id: Number(id), name };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const selectClass = "bg-slate-800/70 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-colors cursor-pointer";

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-slate-800/60">
      <div className="space-y-3">
        {/* Row 1: Search (2/4 width) + 2 dropdowns (1/4 each) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full ${selectClass} pl-10 placeholder:text-slate-500`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as ProductStatus | "all")}
            className={selectClass}
          >
            <option value="all">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Sample">Sample</option>
            <option value="Rejected">Rejected</option>
            <option value="">Pending</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className={selectClass}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Row 2: 4 dropdowns evenly spaced */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={clientFilter}
            onChange={(e) => onClientChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className={selectClass}
          >
            <option value="all">All Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={projectFilter}
            onChange={(e) => onProjectChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className={selectClass}
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.Id} value={p.Id}>{p.Name}</option>
            ))}
          </select>

          <select
            value={fabricFilter}
            onChange={(e) => onFabricChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className={selectClass}
          >
            <option value="all">All Fabrics</option>
            {fabrics.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <select
            value={archivedFilter}
            onChange={(e) => onArchivedChange(e.target.value as "all" | "active" | "archived")}
            className={selectClass}
          >
            <option value="all">All (Active + Archived)</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchAndFilters;
