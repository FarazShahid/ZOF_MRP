import React, { useEffect, useMemo, useRef, useState } from "react";
import { OrderStatus } from "@/src/types/admin";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";

interface OrderSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (status: OrderStatus | "all") => void;
  clientFilter: number[];
  onClientChange: (clientIds: number[]) => void;
  projectFilter: number | "all";
  onProjectChange: (projectId: number | "all") => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  orders: GetOrdersType[];
  projects?: Array<{ Id: number; Name: string; ClientId: number }>;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const OrderSearchAndFilters: React.FC<OrderSearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  clientFilter,
  onClientChange,
  projectFilter,
  onProjectChange,
  dateRange,
  onDateRangeChange,
  orders,
  projects = [],
  hasActiveFilters = false,
  onClearFilters,
}) => {
  const clients = useMemo(
    () =>
      Array.from(new Set(orders.map((p) => `${p.ClientId}|${p.ClientName}`)))
        .map((str) => {
          const [id, name] = str.split("|");
          return { id: Number(id), name };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [orders]
  );

  const [isClientOpen, setIsClientOpen] = useState(false);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target as Node)
      ) {
        setIsClientOpen(false);
      }
    };

    if (isClientOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isClientOpen]);

  const toggleClient = (id: number) => {
    const isSelected = clientFilter.includes(id);
    const updated = isSelected
      ? clientFilter.filter((cid) => cid !== id)
      : [...clientFilter, id];
    onClientChange(updated);
  };

  const clearClients = () => onClientChange([]);

  const selectedClientNames = useMemo(() => {
    if (clientFilter.length === 0) return "All Clients";
    const idToName = new Map(clients.map((c) => [c.id, c.name] as const));
    const names = clientFilter
      .map((id) => idToName.get(id))
      .filter(Boolean) as string[];
    if (names.length <= 2) return names.join(", ");
    return `${names.length} selected`;
  }, [clientFilter, clients]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-slate-800/60">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800/70 text-slate-200 text-sm px-4 py-2.5 pl-10 rounded-xl border border-slate-700/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-colors placeholder:text-slate-500"
          />
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 flex items-center justify-center" />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as OrderStatus | "all")}
          className="bg-slate-800/70 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-colors cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Production">Production</option>
          <option value="Shipped">Shipped</option>
          <option value="Packing">Packing</option>
          <option value="Kept in Stock">Kept in Stock</option>
        </select>

        {/* Project */}
        <select
          value={projectFilter}
          onChange={(e) =>
            onProjectChange(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="bg-slate-800/70 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-colors cursor-pointer"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.Id} value={p.Id}>
              {p.Name}
            </option>
          ))}
        </select>

        {/* Client - dropdown */}
        <div className="relative" ref={clientDropdownRef}>
          <button
            type="button"
            onClick={() => setIsClientOpen((o) => !o)}
            className="w-full bg-slate-800/70 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-colors cursor-pointer text-left"
          >
            {selectedClientNames}
          </button>
          {isClientOpen && (
            <div className="absolute left-0 right-0 z-10 mt-1 max-h-64 overflow-auto bg-slate-800 border border-slate-700/60 rounded-xl shadow-xl shadow-black/20">
              <div className="px-3 py-2 border-b border-slate-700/60 flex items-center justify-between">
                <span className="text-sm text-slate-400">Clients</span>
                <button
                  type="button"
                  onClick={clearClients}
                  className="text-xs text-green-400 hover:text-green-300 hover:underline transition-colors"
                >
                  Clear
                </button>
              </div>
              <ul className="p-2 space-y-1">
                <li>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white rounded-lg px-2 py-1 hover:bg-slate-700/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={clientFilter.length === 0}
                      className="rounded border-slate-600 bg-slate-900 accent-green-500"
                      onChange={clearClients}
                    />
                    All Clients
                  </label>
                </li>
                {clients.map((client) => (
                  <li key={client.id}>
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white rounded-lg px-2 py-1 hover:bg-slate-700/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={clientFilter.includes(client.id)}
                        className="rounded border-slate-600 bg-slate-900 accent-green-500"
                        onChange={() => toggleClient(client.id)}
                      />
                      {client.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Date From */}
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
          className="bg-slate-800/70 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-colors cursor-pointer"
          placeholder="From date"
        />

        {/* Date To + Clear */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="w-full bg-slate-800/70 text-slate-200 text-sm px-4 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-colors cursor-pointer"
            placeholder="To date"
          />
          {hasActiveFilters && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="p-2.5 text-slate-400 hover:text-green-400 hover:bg-slate-800/70 rounded-xl border border-transparent hover:border-slate-700/60 transition-colors cursor-pointer shrink-0"
              title="Clear filters"
            >
              <i className="ri-filter-off-line w-4 h-4 flex items-center justify-center" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSearchAndFilters;
