import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Field, ErrorMessage, FieldArray } from "formik";
import { MdDelete } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import useSleeveType from "@/store/useSleeveType";
import useCutOptionsStore from "@/store/useCutOptionsStore";
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import Label from "../../components/common/Label";
import usePrintingOptionsStore from "@/store/usePrintingOptionsStore";

export default function Step2({ formik }: any) {
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>([]);
  const [selectedPrintingIds, setSelectedPrintingIds] = useState<string[]>([])

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

    if(keys === "all"){
      PrintingOptionId = printingOptions.map((po) => String(po.Id));
    }else{
      PrintingOptionId = Array.from(keys).map(String);
    }

    setSelectedPrintingIds(PrintingOptionId);

    formik.setFieldValue(
      "printingOptions",
      PrintingOptionId.map((id) => ({
        PrintingOptionId: Number(id),
      }))
    );
  }

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

  return (
    <div className="space-y-6 w-[500px]">
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Size Options" />
        <Select
          className="rounded-xl text-gray-400 text-sm w-full outline-none dark:bg-slate-800 bg-gray-100"
          name="SizeOptions"
          placeholder="Select Size Options"
          variant="bordered"
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
        <ErrorMessage
          name="productSizes"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label isRequired={true} label="Printing Option" />
        <Select
          className="rounded-xl text-gray-400 text-sm w-full outline-none dark:bg-slate-800 bg-gray-100"
          name="PrintingOptions"
          placeholder="Select Printing Options"
          variant="bordered"
          selectionMode="multiple"
          required
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
      <FieldArray name="productDetails">
        {({ push, remove, form }) => (
          <>
            {form?.values?.productDetails?.map((_: any, index: number) => {
              return (
                <div
                  key={index}
                  className="border-1 dark:border-gray-800 border-gray-400 space-y-6 rounded-lg p-4"
                  id="productDetails"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <Label isRequired={true} label="Cut Options" />
                      <Field
                        as="select"
                        name={`productDetails[${index}].ProductCutOptionId`}
                        className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
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
                      <Label isRequired={false} label=" Sleeve Type" />
                      <Field
                        as="select"
                        name={`productDetails[${index}].SleeveTypeId`}
                        className="rounded-xl dark:text-gray-400 text-gray-800 dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none"
                      >
                        <option value={""}>Select an option</option>
                        {sleeveTypeData?.map((sleeve, index) => (
                          <option key={index} value={sleeve?.id}>
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

                  <div className="flex justify-end items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          ProductCutOptionId: "",
                          ClientId: "",
                          ProductSizeMeasurementId: "",
                        })
                      }
                    >
                      <FaCirclePlus className="text-green-500 text-lg" />
                    </button>
                    {form.values.productDetails.length > 1 && (
                      <button type="button" onClick={() => remove(index)}>
                        <MdDelete className="text-red-500 text-lg" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </FieldArray>
    </div>
  );
}
