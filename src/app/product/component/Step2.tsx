import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Field, ErrorMessage, FieldArray } from "formik";
import { MdDelete } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { Settings2 } from "lucide-react";
import { PRODUCT_STATUS_ENUM } from "@/interface";
import useSleeveType from "@/store/useSleeveType";
import useCutOptionsStore from "@/store/useCutOptionsStore";
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import Label from "../../components/common/Label";
import usePrintingOptionsStore from "@/store/usePrintingOptionsStore";

export default function Step2({ formik }: any) {
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>([]);
  const [selectedPrintingIds, setSelectedPrintingIds] = useState<string[]>([]);

  const { fetchcutOptions, cutOptions } = useCutOptionsStore();
  const { fetchSleeveType, sleeveTypeData } = useSleeveType();
  const { fetchsizeOptions, sizeOptions } = useSizeOptionsStore();
  const { fetchprintingOptions, printingOptions } = usePrintingOptionsStore();

  const handleSizeChange = (keys: Set<React.Key> | "all") => {
    let sizeIds: string[] = [];

    if (keys === "all") {
      sizeIds = sizeOptions.map((sz) => String(sz.Id));
    } else {
      sizeIds = Array.from(keys).map(String);
    }

    setSelectedSizeIds(sizeIds);

    formik.setFieldValue(
      "productSizes",
      sizeIds.map((id) => ({
        Id: 0,
        sizeId: Number(id),
      }))
    );
  };

  const handlePrintingOptionChange = (keys: Set<React.Key> | "all") => {
    let PrintingOptionId: string[] = [];

    if (keys === "all") {
      PrintingOptionId = printingOptions.map((po) => String(po.Id));
    } else {
      PrintingOptionId = Array.from(keys).map(String);
    }

    setSelectedPrintingIds(PrintingOptionId);

    formik.setFieldValue(
      "printingOptions",
      PrintingOptionId.map((id) => ({
        PrintingOptionId: Number(id),
      }))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchcutOptions(),
        fetchSleeveType(),
        fetchsizeOptions(),
        fetchprintingOptions(),
      ]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const initialSizeIds = formik.values.productSizes?.map((s: any) =>
      String(s.sizeId)
    );
    setSelectedSizeIds(initialSizeIds || []);

    const initialPrintingIds = formik.values.printingOptions?.map((p: any) =>
      String(p.PrintingOptionId)
    );
    setSelectedPrintingIds(initialPrintingIds || []);
  }, [formik.values.productSizes, formik.values.printingOptions]);

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
          <Settings2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Product Specifications</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Define sizes, printing options, cut and sleeve combinations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label isRequired={false} label="Size Options" />
          <Select
            className="rounded-xl text-white text-sm w-full outline-none dark:bg-slate-800 bg-gray-100"
            classNames={{
              helperWrapper: "!dark:bg-slate-800 !bg-gray-100",
            }}
            name="SizeOptions"
            placeholder="Select Size Options"
            variant="bordered"
            isRequired
            selectionMode="multiple"
            aria-label="Size Options"
            selectedKeys={new Set(selectedSizeIds)}
            onSelectionChange={(keys) => handleSizeChange(keys)}
          >
            {sizeOptions?.map((sizeOption) => (
              <SelectItem key={sizeOption?.Id}>
                {sizeOption.OptionSizeOptions}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label isRequired={false} label="Printing Option" />
          <Select
            className="rounded-xl text-white text-sm w-full outline-none dark:bg-slate-800 bg-gray-100"
            name="PrintingOptions"
            placeholder="Select Printing Options"
            variant="bordered"
            selectionMode="multiple"
            aria-label="Printing Options"
            selectedKeys={new Set(selectedPrintingIds)}
            onSelectionChange={(keys) => handlePrintingOptionChange(keys)}
          >
            {printingOptions?.map((printingOption) => (
              <SelectItem key={printingOption?.Id}>
                {printingOption?.Type}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <FieldArray name="productDetails">
        {({ push, remove, form }) => {
          const details = form?.values?.productDetails ?? [];
          const canRemove = details.length > 1;
          return (
            <>
              {details.map((_: any, index: number) => (
                <div
                  key={index}
                  className="flex items-end gap-4 flex-wrap"
                  id="productDetails"
                >
                  <div className="grid grid-cols-2 gap-4 flex-1 min-w-0">
                    <div className="flex flex-col gap-1">
                      <Label isRequired={false} label="Cut Options" />
                      <Field
                        as="select"
                        required
                        name={`productDetails[${index}].ProductCutOptionId`}
                        className="rounded-xl text-white text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                      >
                        <option value={""}>Select an option</option>
                        {cutOptions?.map((cutOption, i) => (
                          <option key={i} value={cutOption?.Id}>
                            {cutOption?.OptionProductCutOptions}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name={`productDetails[${index}].ProductCutOptionId`}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label isRequired={false} label="Sleeve Type" />
                      <Field
                        as="select"
                        name={`productDetails[${index}].SleeveTypeId`}
                        className="rounded-xl text-white text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                      >
                        <option value={""}>Select an option</option>
                        {sleeveTypeData?.map((sleeve, sleeveIdx) => (
                          <option key={sleeveIdx} value={sleeve?.id}>
                            {sleeve?.sleeveTypeName}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name={`productDetails[${index}].SleeveTypeId`}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    push({
                      ProductCutOptionId: "",
                      ClientId: "",
                      ProductSizeMeasurementId: "",
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors border border-green-500/30"
                  title="Add another cut / sleeve combination"
                >
                  <FaCirclePlus className="w-4 h-4 shrink-0" />
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => remove(details.length - 1)}
                  disabled={!canRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title="Remove last combination"
                >
                  <MdDelete className="w-4 h-4 shrink-0" />
                  Remove
                </button>
              </div>
            </>
          );
        }}
      </FieldArray>

      <div className="flex flex-col gap-1">
        <Label isRequired={false} label="Product Status" />
        <Field
          as="select"
          name="productStatus"
          className="rounded-xl text-white text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
        >
          <option value={""}>Select an option</option>
          {PRODUCT_STATUS_ENUM?.map((status, index) => (
            <option key={index} value={status?.name}>
              {status?.name}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="productStatus"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
}
