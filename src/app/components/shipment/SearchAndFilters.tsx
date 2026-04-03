import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { GetAllShipments } from '@/store/useShipmentStore';
import { ShipmentStatus } from '@/src/types/admin';

const CarrierDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  carriers: string[];
}> = ({ value, onChange, carriers }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = [{ label: 'All Carriers', value: 'all' }, ...carriers.map(c => ({ label: c, value: c }))];
  const selectedLabel = options.find(o => o.value === value)?.label || 'All Carriers';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-3 pr-8 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-emerald-500 dark:hover:border-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer whitespace-nowrap relative"
      >
        {selectedLabel}
        <ChevronDown className={`w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 min-w-[140px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-1 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                value === option.value
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const carriers = Array.from(new Set(shipments?.map(s => s?.ShipmentCarrierName))).sort();

  const statusOptions: { label: string; value: ShipmentStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'In Transit', value: 'In Transit' },
    { label: 'Damaged', value: 'Damaged' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Search Bar */}
      <div className="flex-1 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
        <input
          type="text"
          placeholder="Search by ID, product, client, or work order..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2">
        {statusOptions.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === s.value
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Carrier Filter Dropdown */}
      <CarrierDropdown
        value={carrierFilter}
        onChange={onCarrierChange}
        carriers={carriers}
      />
    </div>
  );
};

export default SearchAndFilters;