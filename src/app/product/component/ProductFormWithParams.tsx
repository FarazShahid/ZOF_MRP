"use client";

import { useSearchParams } from "next/navigation";
import ProductForm from "./ProductForm";

export default function ProductFormWithParams({
  productId,
}: {
  productId?: string;
}) {
  const searchParams = useSearchParams();
  return (
    <ProductForm
      productId={productId}
      clientIdFromQuery={searchParams.get("clientId")}
    />
  );
}
