import { ShipmentStatus } from '@/src/types/admin';
import React from 'react';

interface StatusBadgeProps {
  status: ShipmentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyle = (status: ShipmentStatus) => {
    switch (status) {
      case 'In Transit':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/40';
      case 'Damaged':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/40';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/40';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/40 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/40';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/40';
    }
  };

  const getStatusText = (status: ShipmentStatus) => {
    switch (status) {
      case 'In Transit':
        return 'In Transit';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusStyle(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;