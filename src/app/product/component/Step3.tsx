import { Field } from "formik";

export default function Step3({ formik }: any) {
  return (
    <div className="space-y-6 w-[500px]">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-400">
          Description
        </label>
        <Field
          as="textarea"
          name="Description"
          placeholder="Product Description..."
          className="rounded-xl text-gray-400 min-h-[105px] h-full text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
        />
      </div>
    </div>
  );
}
