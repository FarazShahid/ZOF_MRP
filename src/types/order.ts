import { QAChecklistItem } from "@/store/useQAchecklistStore";

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


 export  const getDeadlineColor = (deadline: string) => {
    const status = getDeadlineStatus(deadline);
    switch (status) {
      case "overdue":
        return "text-red-600 border-red-200";
      case "upcoming":
        return "text-orange-600 border-orange-200";
      default:
        return "text-slate-600 border-slate-200";
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

export type MeasurementGroup = {
  measurementId: number;
  /** First row in the group whose expected is NOT numeric, e.g. "Small", "Large", "Small T-Shirt Mao Mao" */
  label: string | null;
  /** Rows to render (excluding the label row if one was used) */
  items: QAChecklistItem[];
};

export const groupByMeasurementId = (rows: QAChecklistItem[]): MeasurementGroup[] => {
  const byId = new Map<number, QAChecklistItem[]>();

  for (const r of rows) {
    if (r.measurementId == null) continue;
    if (!byId.has(r.measurementId)) byId.set(r.measurementId, []);
    byId.get(r.measurementId)!.push(r);
  }

  const groups: MeasurementGroup[] = [];
  for (const [measurementId, items] of byId.entries()) {
    // Find first non-numeric expected text to use as a group label
    const labelRow = items.find(
      (x) => x.expected != null && !isNumericString(x.expected)
    );
    const label = (labelRow?.expected as string) ?? null;

    // Optionally hide the labelRow from the table body to avoid duplication
    const body = labelRow ? items.filter((x) => x.id !== labelRow.id) : items;

    groups.push({ measurementId, label, items: body });
  }

  groups.sort((a, b) => a.measurementId - b.measurementId);
  return groups;
};

export type RowEdits = Record<number, { observed: string; remarks: string }>;

export type RowVals = { observed: string; remarks: string };
export type RowMap = Record<number, RowVals>;