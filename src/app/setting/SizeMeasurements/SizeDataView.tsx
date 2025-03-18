import React from "react";

const SizeDataView = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center w-full">
      <div className="bg-[#3f3f3f] text-white text-center h-8 px-2 flex items-center justify-center w-2/4">
        {label}
      </div>
      <div className="text-center bg-[#bdbdbd] h-8 px-2 flex items-center justify-center w-2/4">
        {value}
      </div>
    </div>
  );
};

export default SizeDataView;
