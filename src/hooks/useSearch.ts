import { useEffect, useMemo, useState } from "react";
import { buildSearchIndex, normalize } from "../utils/search";

export const useDebouncedValue = (value: string, delay = 250) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

/**
 * Generic client-side search hook
 * @param data - array of objects
 * @param query - search query
 * @param fields - which fields to search on
 */
export function useSearch<T extends object>(
  data: T[] = [],
  query: string,
  fields: string[]
): T[] {
  const debounced = useDebouncedValue(query, 250);

  // Precompute index
  const indexed = useMemo(() => {
    return data.map((item) => ({
      ...item,
      __search: buildSearchIndex(item, fields as string[]),
    }));
  }, [data, fields]);

  return useMemo(() => {
    const q = normalize(debounced);
    if (!q) return indexed;
    return indexed.filter((it) => it.__search.includes(q));
  }, [indexed, debounced]);
}
