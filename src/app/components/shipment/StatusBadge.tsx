import { ShipmentStatus } from '@/src/types/admin';
import React from 'react';

interface StatusBadgeProps {
  status: ShipmentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyle = (status: ShipmentStatus) => {
    switch (status) {
      case 'In Transit':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Damaged':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;