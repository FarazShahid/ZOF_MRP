import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Field, ErrorMessage, FieldArray } from "formik";
import { MdDelete } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import useSleeveType from "@/store/useSleeveType";
import useCutOptionsStore from "@/store/useCutOptionsStore";
import useSizeOptionsStore from "@/store/useSizeOptionsStore";


export default function Step2({ formik }: any) {
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>([]);

  const { fetchcutOptions, cutOptions } = useCutOptionsStore();
  const { fetchSleeveType, sleeveTypeData } = useSleeveType();
  const { fetchsizeOptions, sizeOptions } = useSizeOptionsStore();

  //  const handleSizeOptionChange = (
  //   keys:
  //     | "all"
  //     | Set<React.Key>
  //     | (Set<React.Key> & { anchorKey?: string; currentKey?: string })
  // ) => {
  //   if (keys === "all") {
  //     const allKeys = sizeOptions?.map((sizeOption) =>
  //       String(sizeOption.Id)
  //     );
  //     setSelectedSizeOptions(allKeys || []);
  //     formik.setFieldValue(
  //       "productSizes",
  //       allKeys.map((colorId, idx) => ({
  //         Id: idx,
  //         colorId: Number(colorId),
  //         ImageId: "1",
  //       }))
  //     );
  //   } else {
  //     const keyArray = Array.from(keys).map(String);
  //     setSelectedSizeOptions(keyArray);
  //     formik.setFieldValue(
  //       "productSizes",
  //       keyArray.map((colorId, idx) => ({
  //         Id: idx,
  //         colorId: Number(colorId),
  //         ImageId: "1",
  //       }))
  //     );
  //   }
  // };

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

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchcutOptions(),
        fetchSleeveType(),
        fetchsizeOptions(),
      ]);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 w-[500px]">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-400">
          Size Options
        </label>
        <Select
          className="rounded-xl text-gray-400 text-sm w-full outline-none"
          name="SizeOptions"
          placeholder="Select Size Options"
          variant="bordered"
          selectionMode="multiple"
          aria-label="Size Options"
          selectedKeys={new Set(selectedSizeIds)}
          onSelectionChange={(keys) => handleSizeChange(keys)}
        >
          {sizeOptions!.map((sizeOption) => (
            <SelectItem key={sizeOption?.Id}>
              {sizeOption.OptionSizeOptions}
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
                  className="border-1 border-gray-800 space-y-6 rounded p-4"
                  id="productDetails"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-400">
                        Cut Options
                      </label>
                      <Field
                        as="select"
                        name={`productDetails[${index}].ProductCutOptionId`}
                        className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
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
                      <label className="text-xs font-semibold text-gray-400">
                        Sleeve Type
                      </label>
                      <Field
                        as="select"
                        name={`productDetails[${index}].SleeveTypeId`}
                        className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
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
