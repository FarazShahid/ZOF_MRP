import React from "react";
import ViewMoreButton from "./ViewMoreButton";

const rows = [
  { id: 1, orderNo: "CR-52-FD", client: "CRFC", dueDate: "2025-10-09", status: "Production", daysLate: 2 },
  { id: 2, orderNo: "HM-18-QA", client: "H&M", dueDate: "2025-10-08", status: "QA", daysLate: 1 },
  { id: 3, orderNo: "NK-44-SH", client: "Nike", dueDate: "2025-10-01", status: "Ready", daysLate: 7 },
  { id: 4, orderNo: "AD-11-PR", client: "Adidas", dueDate: "2025-09-29", status: "Production", daysLate: 10 },
];

const LateOrdersTable: React.FC = () => {
  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 dark:border-[#1d2939] dark:from-white/[0.05] dark:to-transparent shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="dark:text-white text-gray-900 font-medium">Late / At-risk Orders</span>
        <ViewMoreButton path="/orders?status=overdue" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left p-2">Order</th>
              <th className="text-left p-2">Client</th>
              <th className="text-left p-2">Due date</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Days late</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-100 dark:border-[#1d2939] hover:bg-gray-50/60 dark:hover:bg-white/[0.03]">
                <td className="p-2 dark:text-white text-gray-900 font-medium">{r.orderNo}</td>
                <td className="p-2 text-gray-500">{r.client}</td>
                <td className="p-2 text-gray-500">{r.dueDate}</td>
                <td className="p-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200 dark:bg-white/[0.06] dark:text-yellow-300 dark:ring-white/10">
                    {r.status}
                  </span>
                </td>
                <td className="p-2 text-red-600 font-medium">{r.daysLate}</td>
                <td className="p-2">
                  <button className="text-blue-600 text-sm hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LateOrdersTable;


