import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

interface ProductCutOptions {
  Id: number;
  OptionProductCutOptions: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export const useFetchProductCutOptions = () => {
  const [productCutOptions, setProductCutOptions] = useState<ProductCutOptions[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSize = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/productcutoptions`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products:`);
        }
        const data = await response.json();
        setProductCutOptions(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setProductCutOptions(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSize();
  }, []);

  return { isLoading, error, productCutOptions };
};
