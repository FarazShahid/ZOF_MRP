import { ErrorMessage, Field } from "formik";
import Label from "../../components/common/Label";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import DropZoneMultiple from "../../components/DropZone/DropZoneMultiple";
import RecentAttachmentsView from "../../components/RecentAttachmentsView";
import { FileUp, FileText } from "lucide-react";

export default function Step3({ formik, handleFileSelect, productId }: any) {
  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <FileUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Design Files</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload design files (e.g. images, documents, zip) for this product
            </p>
          </div>
        </div>
        <DropZoneMultiple index={1} onFileSelect={handleFileSelect} />
      </div>
      {productId && productId > 0 ? (
        <RecentAttachmentsView
          referenceId={productId}
          referenceType={DOCUMENT_REFERENCE_TYPE.PRODUCT}
        />
      ) : (
        <></>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Description</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a product description or notes
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Field
            as="textarea"
            name="Description"
            placeholder="Product Description..."
            className="rounded-xl text-white min-h-[105px] h-full text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}
