import { useState, useEffect } from "react";
import { fetchWithAuth } from "./authservice";

interface PrintingOption {
  Id: number;
  Type: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

export const useFetchPrintingOptions = () => {
  const [printingoptions, setPrintingOptions] = useState<PrintingOption[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrintingOptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/printingoptions`);
        if (!response.ok) {
          throw new Error(`Failed to fetch printing options:`);
        }
        const data = await response.json();
        setPrintingOptions(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        setPrintingOptions(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrintingOptions();
  }, []);

  return { isLoading, error, printingoptions };
};
