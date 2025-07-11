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
  { id: 1, status: "PENDING", label: "Pending" },
  { id: 2, status: "AWAITING_PICKUP", label: "Awaiting Pickup" },
  { id: 3, status: "PICKED_UP", label: "Picked Up" },
  { id: 4, status: "DISPATCHED", label: "Dispatched" },
  { id: 5, status: "IN_TRANSIT", label: "In Transit" },
  { id: 6, status: "ARRIVED_AT_HUB", label: "Arrived at Hub" },
  { id: 7, status: "CUSTOMS_HOLD", label: "Customs Hold" },
  { id: 8, status: "CUSTOMS_CLEARED", label: "Customs Cleared" },
  { id: 9, status: "DELAYED", label: "Delayed" },
  { id: 10, status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { id: 11, status: "DELIVERY_ATTEMPT_FAILED", label: "Delivery Attempt Failed" },
  { id: 12, status: "DELIVERED", label: "Delivered" },
  { id: 13, status: "RETURNED_TO_SENDER", label: "Returned to Sender" },
  { id: 14, status: "CANCELLED", label: "Cancelled" },
  { id: 15, status: "LOST", label: "Lost" },
  { id: 16, status: "DAMAGED", label: "Damaged" },
];
