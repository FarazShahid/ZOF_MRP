import React from "react";
import DropZoneMultiple from "../../components/DropZone/DropZoneMultiple";

type Step2Props = {
  onFileSelect: (file: File, index: number) => void;
};

const OrderAttachments: React.FC<Step2Props> = ({ onFileSelect }) => {
  return (
    <div>
      <DropZoneMultiple index={1} onFileSelect={onFileSelect} />
    </div>
  );
};

export default OrderAttachments;
