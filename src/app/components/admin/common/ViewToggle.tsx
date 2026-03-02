import React from 'react';
import { Table, Grid3X3 } from 'lucide-react';
import { ViewMode } from '@/src/types/admin';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
      <button
        onClick={() => onViewModeChange('table')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
          viewMode === 'table'
            ? 'bg-slate-700 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Table className="w-4 h-4" />
        Table
      </button>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
          viewMode === 'grid'
            ? 'bg-slate-700 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
        Card
      </button>
    </div>
  );
};