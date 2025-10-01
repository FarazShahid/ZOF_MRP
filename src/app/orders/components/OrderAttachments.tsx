import React from "react";
import DropZoneMultiple from "../../components/DropZone/DropZoneMultiple";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { FileTypesEnum } from "@/src/types/order";
import Label from "../../components/common/Label";

type Step2Props = {
  onFileSelect: (file: File, index: number) => void;
  orderId?: string | null;
};

const OrderAttachments: React.FC<Step2Props> = ({ onFileSelect, orderId }) => {
  const { values } = useFormikContext<any>();
  const selectedTypeId = values?.typeId ? Number(values.typeId) : undefined
  return (
    <div>
      <div className="flex flex-col gap-1">
        <Label isRequired={false} label="Document type" />
        <Field
          as="select"
          name="typeId"
          className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        >
          <option value={""}>Select a document type</option>
          {FileTypesEnum.map((type, index) => {
            return (
              <option value={type.id} key={index}>
                {type.name}
              </option>
            );
          })}
        </Field>
        <ErrorMessage
          name="typeId"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

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
