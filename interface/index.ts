import dayjs from "dayjs";

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




export function formatDateToReadableDate(dateString: string): string {
  return dayjs(dateString).format("DD MMM YYYY hh:mm A");
}

export const DOCUMENT_REFERENCE_TYPE = {
  INVENTORY_ITEMS: "inventory_item",
  ORDER: 'order',
  SHIPMENT: 'shipment',
  PRODUCT: 'product'
}

export const ShipmentStatus = [
  { id: 1, status: "In Transit", label: "In Transit" },
  { id: 2, status: "Damaged", label: "Damaged" },
  { id: 3, status: "Delivered", label: "Delivered" },
    { id: 4, status: "Cancelled", label: "Cancelled" },

];


export const OrderItemShipmentEnum  ={
  PENDING: 'Pending',
  SHIPPED: 'Shipped',
  PARTIALLY_SHIPPED: 'Partially Shipped',
}