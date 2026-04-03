import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'user' | 'event';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'default' }) => {
  const getStatusStyles = (status: string, type: string) => {
    if (type === 'event') {
      switch (status) {
        case 'Scheduled':
          return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
        case 'In Progress':
          return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
        case 'Completed':
          return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
        case 'Cancelled':
          return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
        default:
          return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30';
      }
    }

    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'Inactive':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusStyles(status, type)}`}>
      {status}
    </span>
  );
};