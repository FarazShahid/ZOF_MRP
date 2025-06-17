import { Field } from "formik";
import Label from "../../components/common/Label";

export default function Step3({ formik }: any) {
  return (
    <div className="space-y-6 w-[500px]">
      <div className="flex flex-col gap-1">
        <Label isRequired={false} label="Description" />
        <Field
          as="textarea"
          name="Description"
          placeholder="Product Description..."
          className="rounded-xl dark:text-gray-400 text-gray-800 min-h-[105px] h-full text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"    
        />
      </div>
    </div>
  );
}
