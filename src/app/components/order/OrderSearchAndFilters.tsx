import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { OrderStatus } from "@/src/types/admin";
import { GetOrdersType } from "../../interfaces/OrderStoreInterface";

interface OrderSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (status: OrderStatus | "all") => void;
  clientFilter: number[];
  onClientChange: (clientIds: number[]) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  orders: GetOrdersType[];
}

const OrderSearchAndFilters: React.FC<OrderSearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  clientFilter,
  onClientChange,
  dateRange,
  onDateRangeChange,
  orders,
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
    <div className="space-y-4 mt-4">
      <div className="flex flex-wrap gap-4">
        {/* Search Bar */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order name, order number, or client..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="min-w-32">
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as OrderStatus | "all")
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Production">In Production</option>
            <option value="Shipped">Shipped</option>
            <option value="Packing">Packing</option>
            <option value="Kept in Stock">Kept in Stock</option>
          </select>
        </div>

        {/* Client Filter - Multi-select with checkboxes */}
        <div className="min-w-32 relative">
          <button
            type="button"
            onClick={() => setIsClientOpen((o) => !o)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {selectedClientNames}
          </button>
          {isClientOpen && (
            <div className="absolute right-0 z-10 mt-1 w-64 max-h-64 overflow-auto bg-white border border-slate-200 rounded-lg shadow">
              <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm text-slate-600">Clients</span>
                <button
                  type="button"
                  onClick={clearClients}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear
                </button>
              </div>
              <ul className="p-2 space-y-1">
                <li>
                  <label className="flex items-center gap-2 text-base text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={clientFilter.length === 0}
                      className="h-5 w-5"
                      onChange={clearClients}
                    />
                    All Clients
                  </label>
                </li>
                {clients.map((client) => (
                  <li key={client.id}>
                    <label className="flex items-center gap-2 text-base text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clientFilter.includes(client.id)}
                        className="h-5 w-5"
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
      </div>

      {/* Date Range Filter */}
      {/* <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Deadline Range:</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, start: e.target.value })
            }
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, end: e.target.value })
            }
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
        </div>
      </div> */}
    </div>
  );
};

export default OrderSearchAndFilters;
