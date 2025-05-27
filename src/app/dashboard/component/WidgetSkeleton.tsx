import { Skeleton } from "@heroui/react";
import React from "react";

const WidgetSkeleton = () => {
  return (
    <div className="bg-gray-950 rounded-lg p-4 shadow-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="rounded-lg">
          <div className="bg-gray-800 rounded-xl w-7 h-7"></div>
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="bg-gray-800 rounded-xl w-7 h-7"></div>
        </Skeleton>
      </div>
      <Skeleton className="rounded-lg w-20">
        <div className="rounded-xl h-4"></div>
      </Skeleton>
      <Skeleton className="rounded-lg w-32">
        <div className="rounded-xl h-6"></div>
      </Skeleton>
    </div>
  );
};

export default WidgetSkeleton;
