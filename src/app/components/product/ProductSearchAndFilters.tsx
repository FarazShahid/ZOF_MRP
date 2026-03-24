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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, category, client, or fabric..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Status */}
        <div className="min-w-40">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as ProductStatus | "all")}
            className="w-full px-3 py-2 border-1 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Sample">Sample</option>
            <option value="Rejected">Rejected</option>
            <option value="">Pending</option>
          </select>
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

        {/* Client */}
        <div className="min-w-40">
          <select
            value={clientFilter}
            onChange={(e) => onClientChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Project */}
        <div className="min-w-40">
          <select
            value={projectFilter}
            onChange={(e) => onProjectChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.Id} value={p.Id}>{p.Name}</option>
            ))}
          </select>
        </div>

        {/* Fabric */}
        <div className="min-w-40">
          <select
            value={fabricFilter}
            onChange={(e) => onFabricChange(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Fabrics</option>
            {fabrics.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Archived */}
        <div className="min-w-36">
          <select
            value={archivedFilter}
            onChange={(e) => onArchivedChange(e.target.value as "all" | "active" | "archived")}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All (Active + Archived)</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Date Range (Created On) */}
      {/* <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600">Created between:</span>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
        />
        <span className="text-slate-400">to</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
        />
        {(dateRange.start || dateRange.end) && (
          <button
            onClick={() => onDateRangeChange({ start: "", end: "" })}
            className="text-slate-500 hover:text-slate-700 text-sm underline"
          >
            Clear
          </button>
        )}
      </div> */}
    </div>
  );
};

export default ProductSearchAndFilters;
