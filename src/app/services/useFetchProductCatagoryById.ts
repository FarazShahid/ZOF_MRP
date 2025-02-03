import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

export interface Client {
  type: string;
  createdBy: string;
  updatedBy: string;
}
interface fetchClientType {
    productIdCatagory: number;
}

export const useFetchProductCatagoryById = ({
    productIdCatagory,
}: fetchClientType) => {
  const [productCategory, setProductCategory] = useState<Client | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productIdCatagory) {
      setProductCategory(null);
      setError(null);
      return;
    }

    const fetchProductCategory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/product-category/${productIdCatagory}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch product category:`);
        }
        const data = await response.json();
        setProductCategory(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setProductCategory(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductCategory();
  }, [productIdCatagory]);

  return { isLoading, error, productCategory };
};
