import React from 'react';
import { ShoppingCart, Factory, Truck, Package, Archive } from 'lucide-react';
import { GetOrdersType } from '../../interfaces/OrderStoreInterface';

interface OrderDashboardProps {
  orders: GetOrdersType[];
}

const OrderDashboard: React.FC<OrderDashboardProps> = ({ orders }) => {
  const stats = {
    total: orders.length,
    production: orders.filter(o => o.StatusName === 'Production').length,
    shipped: orders.filter(o => o.StatusName === 'Shipped').length,
    packing: orders.filter(o => o.StatusName === 'Packing').length,
    kept_in_stock: orders.filter(o => o.StatusName === 'Kept in Stock').length,
  };

  const statCards = [
    {
      title: 'All Orders',
      value: stats.total,
      icon: ShoppingCart,
      bgColor: 'bg-slate-500',
      textColor: 'text-white',
      iconBg: 'bg-slate-600'
    },
    {
      title: 'In Production',
      value: stats.production,
      icon: Factory,
      bgColor: 'bg-orange-500',
      textColor: 'text-white',
      iconBg: 'bg-orange-600'
    },
    {
      title: 'Shipped',
      value: stats.shipped,
      icon: Truck,
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      iconBg: 'bg-green-600'
    },
    {
      title: 'Packing',
      value: stats.packing,
      icon: Package,
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      iconBg: 'bg-blue-600'
    },
    {
      title: 'Kept in Stock',
      value: stats.kept_in_stock,
      icon: Archive,
      bgColor: 'bg-gray-500',
      textColor: 'text-white',
      iconBg: 'bg-gray-600'
    }
  ];

  return (
    <div className="p-6 border-b border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`${card.bgColor} ${card.textColor} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.iconBg} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDashboard;