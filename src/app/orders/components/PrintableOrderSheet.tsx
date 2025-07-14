// components/PrintableOrderSheet.tsx
import React, { useEffect } from "react";
import { formatDate } from "../../interfaces";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { GetOrderByIdType } from "../../interfaces/OrderStoreInterface";
import PrintAbleSizeMeasurementView from "./PrintAbleSizeMeasurementView";

interface PrintableOrderSheetProps {
  order: GetOrderByIdType;
}

const PrintableOrderSheet: React.FC<PrintableOrderSheetProps> = ({ order }) => {
  if (!order) return null;

  return (
    <div
      id="print-section"
      className="hidden print:block p-10 text-black bg-white"
    >
      <h1 className="text-2xl font-bold mb-6">Order Specification Sheet</h1>
      <p>
        <strong>Order Number:</strong> {order.OrderNumber}
      </p>
      <p>
        <strong>Client Name:</strong> {order.ClientName}
      </p>
      <p>
        <strong>Event:</strong> {order.EventName}
      </p>
      <p>
        <strong>Deadline:</strong> {formatDate(order.Deadline)}
      </p>
      <hr className="my-4" />
      {order.items?.map((item, index) => (
        <div key={index} className="mb-4">
          <h2 className="font-semibold text-lg mb-1">
            {item.ProductCategoryName} - {item.ProductFabricName} (
            {item.ProductFabricGSM} GSM)
          </h2>
          {item.orderItemDetails?.map((detail, j: number) => (
            <div key={j} className="text-sm pl-4 mb-1">
              <p>
                • Color: {detail.ColorOptionName} ({detail.HexCode})
              </p>
              <p>• Quantity: {detail.Quantity}</p>
              <p>• Size: {detail.SizeOptionName}</p>
              <p>• Priority: {detail.Priority}</p>
              <p>• Size Chart:</p>
              <PrintAbleSizeMeasurementView
                MeasurementId={detail.MeasurementId}
                ProductCategoryId={item.ProductCategoryId}
              />
            </div>
          ))}
          <p className="text-sm pl-4">
            <strong>Printing:</strong>
            {item.printingOptions
              ?.map((opt: any) => opt.PrintingOptionName)
              .join(", ")}
          </p>
          <RecentAttachmentsView
          isPrintable={true}
            referenceId={item.ProductId}
            referenceType={DOCUMENT_REFERENCE_TYPE.PRODUCT}
          />
        </div>
      ))}
    </div>
  );
};

export default PrintableOrderSheet;
