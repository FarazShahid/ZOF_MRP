import React from 'react';
import { Factory, Truck, Package, Archive } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Production':
        return {
          label: 'In Production',
          className: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: Factory
        };
      case 'Shipped':
        return {
          label: 'Shipped',
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: Truck
        };
      case 'Packing':
        return {
          label: 'Packing',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Package
        };
      case 'Kept in Stock':
        return {
          label: 'Kept in Stock',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Archive
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: Package
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;