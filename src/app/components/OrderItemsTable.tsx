"use client";

import { useFetchOrderItems } from "../services/useFetchOrderItems";
import Spinner from "./Spinner";
import { formatDate } from "../interfaces";

const OrderItemsTable = ({ orderId }: { orderId: number }) => {
  const { isLoading, orderItems } = useFetchOrderItems(orderId);
  return (
    <>
      <tr>
        <td colSpan={6} className="px-4 py-2">
          {isLoading ? (
            <Spinner />
          ) : (
            <table className="min-w-full bg-gray-100 border border-gray-200">
              <thead>
                <tr className="bg-gray-300">
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Product ID
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Product Name
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Created On
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Updated On
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems?.map((item) => {
                  return (
                    <tr>
                      <td className="px-4 py-2 border text-center">
                        {item.ProductId}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.ProductName}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {formatDate(item.CreatedOn)}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {formatDate(item.UpdatedOn)}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {item.Description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </td>
      </tr>
    </>
  );
};

export default OrderItemsTable;
