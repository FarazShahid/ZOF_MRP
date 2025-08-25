// Normalize for consistent case/diacritic insensitive matching
export const normalize = (v: unknown) =>
  (v ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

// Build an index string from object fields
export const buildSearchIndex = (item: any, fields: string[]) => {
  return normalize(fields.map((f) => item?.[f] ?? "").join(" "));
};
