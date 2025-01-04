import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

export interface Product {
  Id: number;
  Name: string;
  ProductCategoryId: number;
  ProductCategoryName: string;
  FabricTypeId: number;
  FabricTypeName: string;
  FabricName: string;
  FabricGSM: number;
  Description: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products:`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setProducts(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { isLoading, error, products };
};
