import React from 'react';
import { Table, Grid3X3 } from 'lucide-react';
import { ViewMode } from '@/src/types/admin';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('table')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'table'
            ? 'bg-white dark:bg-slate-700 text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Table className="w-4 h-4" />
        Table
      </button>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'grid'
            ? 'bg-white dark:bg-slate-700 text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
        Card
      </button>
    </div>
  );
};