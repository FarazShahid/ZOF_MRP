import React from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";

import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import Label from "../../components/common/Label";
import OrderDocumentUploadPicker, {
  OrderDocumentFilesByType,
} from "./OrderDocumentUploadPicker";
import type { UploadedFile } from "@/store/useFileUploadStore";

export type { OrderDocumentFilesByType } from "./OrderDocumentUploadPicker";

type OrderAttachmentsProps = {
  orderId?: string | null;
  documentFiles: OrderDocumentFilesByType;
  onDocumentFilesChange: (typeId: number, files: UploadedFile[]) => void;
  onRemoveDocumentFile: (typeId: number, fileIndex: number) => void;
  onSelectedDocumentTypesChange: (typeIds: number[]) => void;
};

const OrderAttachments: React.FC<OrderAttachmentsProps> = ({
  orderId,
  documentFiles,
  onDocumentFilesChange,
  onRemoveDocumentFile,
  onSelectedDocumentTypesChange,
}) => {
  const { values } = useFormikContext<any>();

  return (
    <div className="flex w-full max-w-full flex-col gap-5 md:w-[760px]">
      <OrderDocumentUploadPicker
        documentFiles={documentFiles}
        onDocumentFilesChange={onDocumentFilesChange}
        onRemoveDocumentFile={onRemoveDocumentFile}
        onSelectedDocumentTypesChange={onSelectedDocumentTypesChange}
      />

      {orderId && (
        <div className="px-4">
          <RecentAttachmentsView
            referenceId={Number(orderId)}
            referenceType={DOCUMENT_REFERENCE_TYPE.ORDER}
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Description" />
        <Field
          as="textarea"
          name="Description"
          maxLength={200}
          placeholder="Order Description..."
          className="rounded-xl dark:text-gray-400 text-gray-800 min-h-[105px] h-full text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        />
        <span className="text-xs text-gray-500">
          {values.Description?.length || 0}/200
        </span>
        <ErrorMessage
          name="Description"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
};

export default OrderAttachments;
