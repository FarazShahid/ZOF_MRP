import React from "react";

const OrderStatusLogs = [
  { id: 1, status_name: "Pending", date: "18 Aug 2025 09:10 AM" },
  { id: 2, status_name: "Production", date: "19 Aug 2025 10:30 AM" },
  { id: 3, status_name: "Printing", date: "20 Aug 2025 06:10 PM" },
  { id: 4, status_name: "QA", date: "24 Aug 2025 06:10 PM" },
  { id: 5, status_name: "Packing", date: "25 Aug 2025 07: 45 PM" },
];

const OrderStatusTimeline = () => {
  return (
    <div className="ml-5">
      <div className="space-y-6 border-l-2 border-dashed dark:border-gray-800 border-gray-300">
        {OrderStatusLogs.map((log, index) => {
          return (
            <div className="relative w-full" key={index}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute -top-0.5 z-10 -ml-3.5 h-7 w-7 rounded-full text-green-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-6">
                <h6 className="font-bold dark:text-gray-400 text-gray-600 text-sm">
                  {log.status_name}
                </h6>
                <span className="mt-1 block text-xs font-semibold text-gray-400">
                  {log.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
