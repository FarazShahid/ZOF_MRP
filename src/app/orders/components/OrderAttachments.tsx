import React from "react";
import DropZoneMultiple from "../../components/DropZone/DropZoneMultiple";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";

type Step2Props = {
  onFileSelect: (file: File, index: number) => void;
  orderId?: string | null;
};

const OrderAttachments: React.FC<Step2Props> = ({ onFileSelect, orderId }) => {
  return (
    <div>
      <DropZoneMultiple index={1} onFileSelect={onFileSelect} />
      {orderId && (
        <div className="px-4">
          <RecentAttachmentsView
            referenceId={Number(orderId)}
            referenceType={DOCUMENT_REFERENCE_TYPE.ORDER}
          />
        </div>
      )}
    </div>
  );
};

export default OrderAttachments;
