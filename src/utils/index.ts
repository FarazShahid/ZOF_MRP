export const normalize = (v: unknown) =>
  (v ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();