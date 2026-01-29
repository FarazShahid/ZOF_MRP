import React, { Suspense } from "react";
import ProductFormWithParams from "../component/ProductFormWithParams";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          Loading...
        </div>
      }
    >
      <ProductFormWithParams />
    </Suspense>
  );
}