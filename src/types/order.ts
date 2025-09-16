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