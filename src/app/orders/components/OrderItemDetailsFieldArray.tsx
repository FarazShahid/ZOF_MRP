import { ErrorMessage, Field, FieldArray } from "formik";
import React, { useEffect, useState } from "react";
import { PRIORITY_ENUM } from "@/interface/GetFileType";
import Label from "../../components/common/Label";
import useProductSubCategoryStore from "@/store/useProductSubCategoryStore";
import useSizeMeasurementsStore, {
  SizeMeasurements,
} from "@/store/useSizeMeasurementsStore";

const fieldClassName =
  "rounded-xl dark:text-gray-400 text-black text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100";

const OrderItemDetailsFieldArray = ({
  index,
  item,
  values,
  sizeOptions,
  setFieldValue,
}: {
  index: number;
  item: any;
  values: any;
  sizeOptions: any[];
  productAvailableColors: any[];
  setFieldValue: (field: string, value: any) => void;
}) => {
  const { fetchProductSubCategories, productSubCategories } =
    useProductSubCategoryStore();
  const { getMeasurementsBySizeOption } = useSizeMeasurementsStore();
  const [measurementsByQueryKey, setMeasurementsByQueryKey] = useState<
    Record<string, SizeMeasurements[]>
  >({});
  const [loadingMeasurementQueryKeys, setLoadingMeasurementQueryKeys] = useState<
    Record<string, boolean>
  >({});
  const productCategoryId = Number(item?.ProductCategoryId);

  useEffect(() => {
    fetchProductSubCategories({ limit: 100, sortBy: "name", sortOrder: "ASC" });
  }, [fetchProductSubCategories]);

  useEffect(() => {
    if (!item.orderItemDetails || item.orderItemDetails.length === 0) {
      setFieldValue(`items[${index}].orderItemDetails`, [
        {
          ColorOptionId: null,
          SizeOption: 0,
          MeasurementId: 0,
          ProductSubCategoryId: "",
          StyleNumber: "",
          Quantity: 1,
          Priority: 0,
        },
      ]);
    }
  }, [index, item.orderItemDetails, setFieldValue]);

  const getMeasurementQueryKey = (
    sizeOptionId: unknown,
    productSubCategoryId?: unknown
  ) =>
    [
      Number(sizeOptionId) || "",
      Number(productSubCategoryId) || "",
      productCategoryId || "",
      values?.ClientId || "",
    ].join("|");

  const loadMeasurementsBySizeOption = async (
    sizeOptionId: unknown,
    productSubCategoryId?: unknown
  ) => {
    const parsedSizeOptionId = Number(sizeOptionId);
    const parsedProductSubCategoryId = Number(productSubCategoryId);
    const queryKey = getMeasurementQueryKey(
      parsedSizeOptionId,
      parsedProductSubCategoryId
    );

    if (
      !Number.isFinite(parsedSizeOptionId) ||
      parsedSizeOptionId <= 0 ||
      measurementsByQueryKey[queryKey] ||
      loadingMeasurementQueryKeys[queryKey]
    ) {
      return;
    }

    setLoadingMeasurementQueryKeys((prev) => ({
      ...prev,
      [queryKey]: true,
    }));

    const measurements = await getMeasurementsBySizeOption(parsedSizeOptionId, {
      ProductSubCategoryId:
        Number.isFinite(parsedProductSubCategoryId) &&
        parsedProductSubCategoryId > 0
          ? parsedProductSubCategoryId
          : undefined,
      ProductCategoryId:
        Number.isFinite(productCategoryId) && productCategoryId > 0
          ? productCategoryId
          : undefined,
      ClientId: values?.ClientId || undefined,
    });

    setMeasurementsByQueryKey((prev) => ({
      ...prev,
      [queryKey]: measurements,
    }));
    setLoadingMeasurementQueryKeys((prev) => ({
      ...prev,
      [queryKey]: false,
    }));
  };

  useEffect(() => {
    (item.orderItemDetails || []).forEach((detail: any) => {
      if (Number(detail?.SizeOption) > 0) {
        void loadMeasurementsBySizeOption(
          detail.SizeOption,
          detail.ProductSubCategoryId
        );
      }
    });
  }, [
    item.orderItemDetails,
    measurementsByQueryKey,
    loadingMeasurementQueryKeys,
    values?.ClientId,
    productCategoryId,
  ]);

  const resetMeasurementId = (detailIndex: number) => {
    setFieldValue(
      `items[${index}].orderItemDetails[${detailIndex}].MeasurementId`,
      0
    );
  };

  const handleSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    detailIndex: number
  ) => {
    setFieldValue(
      `items[${index}].orderItemDetails[${detailIndex}].SizeOption`,
      Number(e.target.value)
    );
    setFieldValue(
      `items[${index}].orderItemDetails[${detailIndex}].StyleNumber`,
      ""
    );
    resetMeasurementId(detailIndex);
    void loadMeasurementsBySizeOption(
      e.target.value,
      item.orderItemDetails?.[detailIndex]?.ProductSubCategoryId
    );
  };

  const handleSubCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    detailIndex: number
  ) => {
    setFieldValue(
      `items[${index}].orderItemDetails[${detailIndex}].ProductSubCategoryId`,
      e.target.value
    );
    setFieldValue(
      `items[${index}].orderItemDetails[${detailIndex}].StyleNumber`,
      ""
    );
    resetMeasurementId(detailIndex);
    void loadMeasurementsBySizeOption(
      item.orderItemDetails?.[detailIndex]?.SizeOption,
      e.target.value
    );
  };

  const handleStyleNumberChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    detailIndex: number
  ) => {
    setFieldValue(
      `items[${index}].orderItemDetails[${detailIndex}].StyleNumber`,
      e.target.value
    );
    resetMeasurementId(detailIndex);
  };

  const filteredSubCategories = productSubCategories.filter(
    (subCategory) =>
      Number(subCategory.productCategoryId) === productCategoryId
  );

  const getStyleNumberOptions = (detail: any) => {
    const selectedSizeOptionId = Number(detail?.SizeOption);
    const selectedSubCategoryId = Number(detail?.ProductSubCategoryId);
    const selectedClientId = Number(values?.ClientId);

    if (
      !Number.isFinite(selectedSizeOptionId) ||
      selectedSizeOptionId <= 0 ||
      !Number.isFinite(selectedSubCategoryId) ||
      selectedSubCategoryId <= 0
    ) {
      return [];
    }

    const queryKey = getMeasurementQueryKey(
      selectedSizeOptionId,
      selectedSubCategoryId
    );

    const styleNumbers = (measurementsByQueryKey[queryKey] || [])
      .filter((measurement) => {
        const styleNumber = String(measurement.StyleNumber ?? "").trim();

        if (!styleNumber) {
          return false;
        }

        if (
          productCategoryId &&
          Number(measurement.ProductCategoryId) !== productCategoryId
        ) {
          return false;
        }

        if (Number(measurement.ProductSubCategoryId) !== selectedSubCategoryId) {
          return false;
        }

        if (
          selectedClientId &&
          measurement.ClientId !== null &&
          measurement.ClientId !== undefined &&
          Number(measurement.ClientId) !== selectedClientId
        ) {
          return false;
        }

        return true;
      })
      .map((measurement) => String(measurement.StyleNumber).trim());

    const uniqueStyleNumbers = Array.from(new Set(styleNumbers)).sort();
    const selectedStyleNumber = String(detail?.StyleNumber ?? "").trim();

    if (
      selectedStyleNumber &&
      !uniqueStyleNumbers.includes(selectedStyleNumber)
    ) {
      uniqueStyleNumbers.unshift(selectedStyleNumber);
    }

    return uniqueStyleNumbers;
  };

  return (
    <FieldArray name={`items[${index}].orderItemDetails`}>
      {(detailsHelpers) => (
        <div className="mb-4">
          {item.orderItemDetails && item.orderItemDetails.length > 0 ? (
            item.orderItemDetails.map((detail: any, detailIndex: number) => (
              <div className="" key={detailIndex}>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <Label isRequired label="Quantity" />
                    <Field
                      type="number"
                      name={`items[${index}].orderItemDetails[${detailIndex}].Quantity`}
                      className={fieldClassName}
                      min={1}
                      step="1"
                      onKeyDown={(e: {
                        key: string;
                        preventDefault: () => void;
                      }) => {
                        if (
                          e.key === "." ||
                          e.key === "e" ||
                          e.key === "-" ||
                          e.key === "+"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <ErrorMessage
                      name={`items[${index}].orderItemDetails[${detailIndex}].Quantity`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Label isRequired label="Priority" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].Priority`}
                      className={fieldClassName}
                    >
                      <option value="">Select Priority</option>
                      {PRIORITY_ENUM.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name={`items[${index}].orderItemDetails[${detailIndex}].Priority`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Label isRequired label="Size Options" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].SizeOption`}
                      className={fieldClassName}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleSizeChange(e, detailIndex)
                      }
                    >
                      <option value="">Select a size option</option>
                      {sizeOptions?.map((size, idx) => (
                        <option value={size?.SizeId} key={idx}>
                          {size?.SizeName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name={`items[${index}].orderItemDetails[${detailIndex}].SizeOption`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Label isRequired={false} label="Product Sub Category" />
                    <Field
                      as="select"
                      name={`items[${index}].orderItemDetails[${detailIndex}].ProductSubCategoryId`}
                      className={fieldClassName}
                      disabled={!productCategoryId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleSubCategoryChange(e, detailIndex)
                      }
                    >
                      <option value="">
                        {productCategoryId
                          ? "Select sub category"
                          : "Select product first"}
                      </option>
                      {filteredSubCategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name={`items[${index}].orderItemDetails[${detailIndex}].ProductSubCategoryId`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Label isRequired={false} label="Style Number" />
                    {(() => {
                      const selectedSizeOptionId = Number(detail.SizeOption);
                      const selectedSubCategoryId = Number(
                        detail.ProductSubCategoryId
                      );
                      const styleNumberOptions = getStyleNumberOptions(detail);
                      const queryKey = getMeasurementQueryKey(
                        selectedSizeOptionId,
                        selectedSubCategoryId
                      );
                      const isLoadingStyleNumbers =
                        Boolean(loadingMeasurementQueryKeys[queryKey]);

                      return (
                        <Field
                          as="select"
                          name={`items[${index}].orderItemDetails[${detailIndex}].StyleNumber`}
                          className={fieldClassName}
                          disabled={
                            !selectedSizeOptionId ||
                            !selectedSubCategoryId ||
                            isLoadingStyleNumbers ||
                            styleNumberOptions.length === 0
                          }
                          onFocus={() =>
                            loadMeasurementsBySizeOption(
                              selectedSizeOptionId,
                              selectedSubCategoryId
                            )
                          }
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => handleStyleNumberChange(e, detailIndex)}
                        >
                          <option value="">
                            {!selectedSizeOptionId
                              ? "Select size first"
                              : !selectedSubCategoryId
                              ? "Select sub category first"
                              : isLoadingStyleNumbers
                              ? "Loading style numbers..."
                              : styleNumberOptions.length > 0
                              ? "Select style number"
                              : "No style numbers available"}
                          </option>
                          {styleNumberOptions.map((styleNumber) => (
                            <option key={styleNumber} value={styleNumber}>
                              {styleNumber}
                            </option>
                          ))}
                        </Field>
                      );
                    })()}
                    <ErrorMessage
                      name={`items[${index}].orderItemDetails[${detailIndex}].StyleNumber`}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end w-full space-x-2">
                  {item.orderItemDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => detailsHelpers.remove(detailIndex)}
                      className="bg-red-500 hover:bg-red-700 text-white rounded-lg px-2 font-bold"
                      aria-label="Remove order item detail"
                    >
                      &minus;
                    </button>
                  )}
                  {detailIndex === item.orderItemDetails.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        detailsHelpers.push({
                          ColorOptionId: null,
                          Quantity: 1,
                          Priority: 0,
                          SizeOption: 0,
                          MeasurementId: 0,
                          ProductSubCategoryId: "",
                          StyleNumber: "",
                        })
                      }
                      className="bg-green-600 hover:bg-green-800 text-white rounded-lg px-2 font-bold"
                      aria-label="Add order item detail"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      )}
    </FieldArray>
  );
};

export default OrderItemDetailsFieldArray;
