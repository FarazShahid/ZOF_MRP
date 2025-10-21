export interface QASheetOrderInfo {
  orderId: number;
  orderName: string;
  clientId: number;
  clientName: string;
  eventName: string;
  orderItemId: string;
  productId: number;
  productName: string;
  sizeMeasurementId: number;
}

export const getDeadlineStatus = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "upcoming";
  return "normal";
};

export const getDeadlineColor = (deadline: string) => {
  const status = getDeadlineStatus(deadline);
  switch (status) {
    case "overdue":
      return "text-red-600 border-red-200";
    case "upcoming":
      return "text-orange-600 border-orange-200";
    default:
      return "text-gray-900 border-slate-200";
  }
};

// QA CHECK LIST

export interface QaInfo {
  orderName: string;
  clientName: string;
  deadline: string;
  productName: string;
  productId: number;
  orderItemId: number;
}

// strict numeric check
const isNumericString = (v: unknown): boolean => {
  if (typeof v !== "string") return false;
  const s = v.trim();
  if (!s) return false;
  return /^[+-]?\d+(?:\.\d+)?$/.test(s);
};

export type RowEdits = Record<number, { observed: string; remarks: string }>;

export type RowVals = { observed: string; remarks: string };
export type RowMap = Record<number, RowVals>;

export interface FormValues {
  OrderName: string;
  OrderNumber: string;
  ClientId: string;
  OrderEventId?: string;
  Description: string;
  Deadline: string;
  OrderPriority: string;
  items: any[];
  typeId?: string;
}

// order Steps
export const steps = ["Order Details", "Order Items"];

// order document_types
export const FileTypesEnum = [
  { id: 1, name: "Design File" },
  { id: 2, name: "Mockup File" },
  { id: 3, name: "Product Requirement File" },
  {id: 4, name: "QA Sheet"}
];
