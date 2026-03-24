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

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Design Files / Attachments - same card style as reference */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <i className="ri-upload-cloud-2-line text-white w-4 h-4 flex items-center justify-center" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Design Files</h2>
            <p className="text-xs text-slate-400">Upload artwork, mockups, or documents for this order</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <Label isRequired={false} label="Document type" />
            <Field
              as="select"
              name="typeId"
              className="w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Select a document type</option>
              {FileTypesEnum.map((type, index) => (
                <option value={type.id} key={index}>
                  {type.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="typeId" component="div" className="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <DropZoneMultiple index={1} onFileSelect={onFileSelect} />

        {orderId && (
          <div className="mt-6">
            <RecentAttachmentsView
              referenceId={Number(orderId)}
              referenceType={DOCUMENT_REFERENCE_TYPE.ORDER}
            />
          </div>
        )}
      </div>

      {/* Description - same card style as reference */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ri-file-text-line text-white w-4 h-4 flex items-center justify-center" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Order Description</h2>
            <p className="text-xs text-slate-400">Add notes or description for this order</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label isRequired={false} label="Description" />
          <Field
            as="textarea"
            name="Description"
            maxLength={200}
            placeholder="Order description..."
            className="w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500 min-h-[120px] resize-none"
          />
          <span className="text-xs text-slate-500 mt-1">
            {values.Description?.length || 0}/200
          </span>
          <ErrorMessage
            name="Description"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderAttachments;
