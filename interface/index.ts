export const UNITTYPES = [
  { id: 1, name: "Top Unit" },
  { id: 2, name: "Bottom Unit" },
];

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "";
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
}


export const MEASUREMENT_UNIT_TYPE = [
  {id: 1, name: "Top Unit"},
  {id: 2, name: "Bottom Unit"},
  {id: 3, name: "Both"}
]

export const PRODUCT_STATUS_ENUM = [
  {id: 1, name: "Approved"},
  {id: 2, name: "Rejected"},
  {id: 3, name: "Sample"}
]