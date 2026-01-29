"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import ProductFormWithParams from "../../component/ProductFormWithParams";

export default function Page() {
  const params = useParams();
  const id = params?.id;

  if (!id || typeof id !== "string") {
    return <div>Invalid Product ID</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          Loading...
        </div>
      }
    >
      <ProductFormWithParams productId={id} />
    </Suspense>
  );
}
