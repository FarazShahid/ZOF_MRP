import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { GetAllShipments } from '@/store/useShipmentStore';
import { ShipmentStatus } from '@/src/types/admin';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: ShipmentStatus | 'all';
  onStatusChange: (status: ShipmentStatus | 'all') => void;
  carrierFilter: string;
  onCarrierChange: (carrier: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  shipments: GetAllShipments[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  carrierFilter,
  onCarrierChange,
  dateRange,
  onDateRangeChange,
  shipments
}) => {
  // Get unique carriers for filter dropdown
  const carriers = Array.from(new Set(shipments.map(s => s.ShipmentCarrierName))).sort();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search Bar */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by shipment code, carrier, or order number..."
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
            onChange={(e) => onStatusChange(e.target.value as ShipmentStatus | 'all')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>     
            <option value="In Transit">In Transit</option>
            <option value="Damaged">Damaged</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Carrier Filter */}
        <div className="min-w-32">
          <select
            value={carrierFilter}
            onChange={(e) => onCarrierChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Carriers</option>
            {carriers.map(carrier => (
              <option key={carrier} value={carrier}>{carrier}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Range Filter */}
      {/* <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Date Range:</span>
        </div>
        <div className="flex items-center space-x-2">
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
              onClick={() => onDateRangeChange({ start: '', end: '' })}
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

export default SearchAndFilters;