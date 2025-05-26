// src/interface/useHandleProductColors.ts
import useProductStore from "@/store/useProductStore";
import { useEffect } from "react";

export const useProductColorsByProductId = (productId: number | undefined) => {
  const fetchProductAvailableColors = useProductStore(state => state.fetchProductAvailableColors);
  const productColorMap = useProductStore(state => state.productColorMap);

  useEffect(() => {
    if (productId && !productColorMap[productId]) {
      fetchProductAvailableColors(productId);
    }
  }, [productId]);

  return productId ? productColorMap[productId] || [] : [];
};