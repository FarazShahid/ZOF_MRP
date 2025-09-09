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
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'In Progress':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Completed':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'Cancelled':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status, type)}`}>
      {status}
    </span>
  );
};