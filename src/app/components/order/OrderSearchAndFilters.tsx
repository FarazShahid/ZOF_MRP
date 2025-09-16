import React from "react";
import { Search } from "lucide-react";
import { Client } from "../../services/useFetchClients";
import { OrderStatus } from "@/src/types/admin";

interface OrderSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (status: OrderStatus | "all") => void;
  clientFilter: string;
  onClientChange: (client: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  clients: Client[];
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
  clients,
}) => {
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

        {/* Client Filter */}
        <div className="min-w-32">
          <select
            value={clientFilter}
            onChange={(e) => onClientChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Clients</option>
            {clients.map((client) => (
              <option key={client.Id} value={client.Id}>
                {client.Name}
              </option>
            ))}
          </select>
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
