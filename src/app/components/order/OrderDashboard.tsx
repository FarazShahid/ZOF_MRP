import React from 'react';
import { ShoppingCart, Factory, Truck, Package, Archive } from 'lucide-react';
import Image from 'next/image';
import { GetOrdersType } from '../../interfaces/OrderStoreInterface';
import { OrderStatus } from '@/src/types/admin';

interface OrderDashboardProps {
  orders: GetOrdersType[];
  statusFilter: OrderStatus | 'all';
  onStatusChange: (status: OrderStatus | 'all') => void;
}

const OrderDashboard: React.FC<OrderDashboardProps> = ({ orders, statusFilter, onStatusChange }) => {
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
      bgColor: 'bg-slate-400',
      textColor: 'text-white',
      iconBg: 'bg-slate-600',
      status: 'all' as const,
      seal: '/Seal 1.png'
    },
    {
      title: 'In Production',
      value: stats.production,
      icon: Factory,
      bgColor: 'bg-orange-400',
      textColor: 'text-white',
      iconBg: 'bg-orange-600',
      status: 'Production' as OrderStatus,
      seal: '/Seal 2.png'
    },
    {
      title: 'Shipped',
      value: stats.shipped,
      icon: Truck,
      bgColor: 'bg-green-400',
      textColor: 'text-white',
      iconBg: 'bg-green-600',
      status: 'Shipped' as OrderStatus,
      seal: '/Seal 3.png'
    },
    {
      title: 'Packing',
      value: stats.packing,
      icon: Package,
      bgColor: 'bg-blue-400',
      textColor: 'text-white',
      iconBg: 'bg-blue-600',
      status: 'Packing' as OrderStatus,
      seal: '/Seal 4.png'
    },
    {
      title: 'Kept in Stock',
      value: stats.kept_in_stock,
      icon: Archive,
      bgColor: 'bg-gray-400',
      textColor: 'text-white',
      iconBg: 'bg-gray-600',
      status: 'Kept in Stock' as OrderStatus,
      seal: '/Seal 5.png'
    }
  ];

  return (
    <div className="p-6 border-b border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const active = statusFilter === card.status;
          return (
            <div
              key={card.title}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => onStatusChange(card.status)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onStatusChange(card.status);
              }}
              className={`${card.bgColor} ${card.textColor} rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden ${active ? 'ring-2 ring-offset-2 ring-white/80' : ''}`}
            >
              {/* Decorative seal image */}
              <div className="pointer-events-none absolute -right-4 -bottom-6 group-hover:opacity-30 transition-opacity duration-300">
                <div className="relative w-28 h-28 transform group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300 ease-out">
                  <Image src={card.seal} alt="decorative seal" fill className="object-contain" sizes="112px" />
                </div>
              </div>
              {/* Soft radial highlight on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden>
                <div className="absolute -inset-16 rounded-full bg-white/5 blur-2xl group-hover:scale-105 transition-transform" />
              </div>

              <div className="relative z-10 flex items-center gap-3">
              <div className={`${card.iconBg} p-3 rounded-lg transform group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-90">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDashboard;