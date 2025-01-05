import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

interface Size {
  Id: number;
  OptionSizeOptions: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export const useFetchSize = () => {
  const [sizes, setSizes] = useState<Size[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSize = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/sizeoptions`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products:`);
        }
        const data = await response.json();
        setSizes(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setSizes(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSize();
  }, []);

  return { isLoading, error, sizes };
};
