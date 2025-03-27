"use client"

import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import StatusChip from "../../components/StatusChip";

const RecentOrders = () => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex items-center justify-between w-full">
        <span className="font-semibold">Recent Orders</span>
        <button className="border-1 border-blue-400 text-blue-500 p-1 rounded-lg text-xs">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate [border-spacing:0_0.5em]">
          <thead className="">
            <tr>
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
                Deadline
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-justify">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className=" cursor-pointer">
              <td className="px-4 border-b-1 text-xs">
              COHJ9859 
              </td>
              <td className="px-4 py-1 border-b-1 text-xs">Comprehensive Spine Center</td>
              <td className="px-4 py-1 border-b-1 text-xs">1</td>
              <td className="px-4 py-1 border-b-1 text-xs">
                <StatusChip OrderStatus="Pending" />
              </td>
              <td className="px-4 py-1 border-b-1 text-xs">1</td>
              <td className="px-4 py-1 border-b-1 text-xs">03/02/2025</td>
              <td
                className="px-4 py-1 border-b-1 text-xs"
              >
                <div className="flex items-center gap-2 w-full">
                  <button type="button">
                    <GoPencil color="green" />
                  </button>
                  <button type="button">
                    <RiDeleteBin6Line color="red" />
                  </button>
                </div>
              </td>
            </tr>
            <tr className=" cursor-pointer">
              <td className="px-4 truncate max-w-28 border-b-1 text-xs">
              COHJ9859 
              </td>
              <td className="px-4 py-1 border-b-1 text-xs">CRFC</td>
              <td className="px-4 py-1 border-b-1 text-xs">1</td>
              <td className="px-4 py-1 border-b-1 text-xs">
                <StatusChip OrderStatus="Completed" />
              </td>
              <td className="px-4 py-1 border-b-1 text-xs">1</td>
              <td className="px-4 py-1 border-b-1 text-xs">03/02/2025</td>
              <td
                className="px-4 py-1 border-b-1 text-xs"
              >
                <div className="flex items-center gap-2 w-full">
                  <button type="button">
                    <GoPencil color="green" />
                  </button>
                  <button type="button">
                    <RiDeleteBin6Line color="red" />
                  </button>
                </div>
              </td>
            </tr>
            <tr className=" cursor-pointer">
              <td className="px-4 truncate max-w-28 border-b-1 text-xs">
              COHJ9859 
              </td>
              <td className="px-4 py-1 border-b-1 text-xs">Comprehensive Spine Center</td>
              <td className="px-4 py-1 border-b-1 text-xs">1</td>
              <td className="px-4 py-1 border-b-1 text-xs">
                <StatusChip OrderStatus="Pending" />
              </td>
              <td className="px-4 py-1 border-b-1 text-xs">1</td>
              <td className="px-4 py-1 border-b-1 text-xs">03/02/2025</td>
              <td
                className="px-4 py-1 border-b-1 text-xs"
              >
                <div className="flex items-center gap-2 w-full">
                  <button type="button">
                    <GoPencil color="green" />
                  </button>
                  <button type="button">
                    <RiDeleteBin6Line color="red" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
