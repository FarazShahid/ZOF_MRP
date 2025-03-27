import React from "react";
import { FaUsers } from "react-icons/fa";
const ClientWidget = () => {
  return (
    <div className="bg-white p-5 flex flex-col gap-2 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Total Clients</span>
        <div className="bg-yellow-600 rounded-full text-white p-2">
          <FaUsers />
        </div>
      </div>
      <div className='font-semibold text-4xl text-[#9747FF] font-mono'>1500</div>
    </div>
  );
};

export default ClientWidget;
