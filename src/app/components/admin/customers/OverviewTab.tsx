"use client";

import React from "react";
import { Calendar, Package, ShoppingCart, User } from "lucide-react";
import { GetClientsType } from "@/store/useClientStore";
import { formatDate } from "./clientHelpers";

interface Props {
  client: GetClientsType;
  ordersCount: number;
  activeProductsCount: number;
  completedOrdersCount: number;
}

const OverviewTab: React.FC<Props> = ({
  client,
  ordersCount,
  activeProductsCount,
  completedOrdersCount,
}) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{ordersCount}</p>
            </div>
            <ShoppingCart className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
				<div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Products</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {activeProductsCount}
              </p>
            </div>
            <Package className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
				<div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Shipped Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {completedOrdersCount}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Primary Contact
          </h3>
          <div className="space-y-3">
            {client.POCName && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{client.POCName}</p>
              </div>
            )}
            {client.POCEmail && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{client.POCEmail}</p>
              </div>
            )}
          </div>
        </div>

				<div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Account Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created On</p>
              <p className="text-gray-900 dark:text-white font-medium">{formatDate(client.CreatedOn)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
              <p className="text-gray-900 dark:text-white font-medium">{client.CreatedBy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;


