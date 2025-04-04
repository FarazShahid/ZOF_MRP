"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusChip from "../../components/StatusChip";
import useOrderStore from "@/store/useOrderStore";
import { Spinner } from "@heroui/react";

const RecentOrders = () => {
  const { loading, Orders, fetchOrders } = useOrderStore();
  const router = useRouter();

  useEffect(() => {
    fetchOrders(0);
  }, [fetchOrders]);

  // Sort by CreatedOn date and get only 3 most recent orders
  const recentOrders = [...Orders]
    .sort(
      (a, b) =>
        new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime()
    )
    .slice(0, 3);

  const handleOrderRoute = () => {
    router.push("/orders");
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex items-center justify-between w-full">
        <span className="font-semibold">Recent Orders</span>
        <button
          type="button"
          onClick={handleOrderRoute}
          className="border-1 border-blue-400 text-blue-500 p-1 rounded-lg text-xs"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : (
          <table className="min-w-full border-separate [border-spacing:0_0.5em]">
            <thead className="">
              <tr>
                <th className="px-4 py-2 text-sm font-semibold text-justify">
                  Name
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-justify">
                  Order No.
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-justify">
                  Client
                </th>
                <th className="px-4 py-2 text-sm font-semibold cursor-pointer text-justify">
                  External Order Id
                </th>
                <th className="px-4 py-2 text-sm font-semibold cursor-pointer text-justify">
                  Status
                </th>
                <th className="px-4 py-2 text-sm font-semibold cursor-pointer text-justify">
                  Priority
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-justify">
                  Date Created
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-justify">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.Id} className="cursor-pointer">
                  <td className="px-4 py-1 border-b text-xs">
                    {order.OrderName}
                  </td>
                  <td className="px-4 py-1 border-b text-xs">
                    {order.OrderNumber}
                  </td>
                  <td className="px-4 py-1 border-b text-xs">
                    {order.ClientName}
                  </td>
                  <td className="px-4 py-1 border-b text-xs">
                    {order.ExternalOrderId}
                  </td>
                  <td className="px-4 py-1 border-b text-xs">
                    <StatusChip OrderStatus={order.StatusName} />
                  </td>
                  <td className="px-4 py-1 border-b text-xs">
                    {order.OrderPriority}
                  </td>
                  <td className="px-4 py-1 border-b text-xs">
                    {new Date(order.CreatedOn).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-1 border-b text-xs">
                    {new Date(order.Deadline).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;
