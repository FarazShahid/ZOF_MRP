import React from 'react'
import { Card, Skeleton } from "@heroui/react";

export const OrderInfoSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Order Details Skeleton */}
      <Card className="border-0 shadow-xl p-6 space-y-4" radius="lg">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-default-100"
            >
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>

      {/* Client Info Skeleton */}
      <Card className="border-0 shadow-xl p-6 space-y-4" radius="lg">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/5 rounded-lg" />
          <Skeleton className="h-4 w-4/5 rounded-lg" />
          <Skeleton className="h-4 w-2/5 rounded-lg" />
        </div>
      </Card>

      {/* Order Description Skeleton */}
      <Card className="border-0 shadow-xl p-6 space-y-4" radius="lg">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-5 w-40 rounded-lg" />
        </div>
        <Skeleton className="h-20 w-full rounded-lg" />
      </Card>

      {/* Status Logs Skeleton */}
      <Card className="border-0 shadow-xl p-6 space-y-4" radius="lg">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
