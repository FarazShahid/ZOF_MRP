import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

export interface ProductCatagory {
    id: number;
    type: string;
    createdOn: string;
    createdBy: string;
    updatedOn: string;
    updatedBy: string;
}

interface fetchProductCatagoryType{
  refreshKey?: number;
}


export const useFetchProductCatagory = ({refreshKey}: fetchProductCatagoryType) => {
  const [productCatagory, setProductCatagory] = useState<ProductCatagory[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductCatagory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/product-category`);
        if (!response.ok) {
          throw new Error(`Failed to fetch Product Catagory:`);
        }
        const data = await response.json();
        setProductCatagory(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setProductCatagory(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductCatagory();
  }, [refreshKey]);

  return { isLoading, error, productCatagory };
};
