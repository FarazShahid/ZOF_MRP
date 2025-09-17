import { GetClientsType } from "@/store/useClientStore";
import React from "react";

interface StatProp {
  customers: GetClientsType[];
}

const CustomerStats: React.FC<StatProp> = ({ customers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className=" p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">
              {customers.length}
            </p>
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className=" p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Clients</p>
            <p className="text-2xl font-bold text-green-600">
              {customers.filter((c) => c.status === "Active").length}
            </p>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className=" p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-purple-600">
              {/* {customers.reduce((sum, c) => sum + c.totalOrders, 0)} */}
            </p>
          </div>
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className=" p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Orders in Progress
            </p>
            <p className="text-2xl font-bold text-orange-600">
              {/* {customers.reduce((sum, c) => sum + c.ordersInProgress, 0)} */}
            </p>
          </div>
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStats;
