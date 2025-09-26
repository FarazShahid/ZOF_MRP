import React from 'react';
import { X, Mail, Phone, Calendar, ShoppingCart, TrendingUp, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Customer } from '@/src/types/admin';
import { GetClientsType } from '@/store/useClientStore';

interface CustomerDetailSidebarProps {
  customer: GetClientsType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailSidebar: React.FC<CustomerDetailSidebarProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  if (!customer || !isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-950 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          {/* Customer Info */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {customer.Name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{customer.Name}</h3>
                <StatusBadge status={customer.status || 'Active'} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{customer.Phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{customer.Email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Customer since {formatDate(customer.CreatedOn)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          {/* <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Orders</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  0
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  0
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Completed</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                   0
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                  <span className="text-sm font-medium text-purple-900">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                   100%
                </p>
              </div>
            </div>
          </div> */}

          {/* Last Order Summary TODO */}
          {/* {customer.lastOrderDate && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Last Order Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Order Date</span>
                  <span className="text-sm text-gray-600">{formatDate(customer.lastOrderDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Order Amount</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {customer.lastOrderAmount ? formatCurrency(customer.lastOrderAmount) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )} */}

           {/* <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Last Order Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Order Date</span>
                  <span className="text-sm text-gray-600">{formatDate(customer.CreatedOn)}</span>
                </div>
              </div>
            </div> */}

          {/* Actions */}
          {/* <div className="space-y-3">
            <button type='button' className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              View All Orders
            </button>
            <button type='' className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              Edit Customer
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};