import { Skeleton } from "@heroui/react";
import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="bg-gray-800 w-full rounded-lg p-2 flex items-center gap-4">
      <Skeleton className="rounded-lg">
        <div className="w-16 h-16 rounded border-1 border-gray-700" />
      </Skeleton>
      <div className="flex flex-col gap-1">
        <Skeleton className="rounded-lg">
          <div className="h-2 w-5"></div>
        </Skeleton>
        <div className="flex items-center gap-4">
          <Skeleton className="rounded-lg">
            <div className="rounded h-5 w-10"></div>
          </Skeleton>
          <Skeleton className="rounded-lg">
            <div className="h-1 w-6"></div>
          </Skeleton>
          <Skeleton className="rounded-lg">
            <div className="h-1 w-6"></div>
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
