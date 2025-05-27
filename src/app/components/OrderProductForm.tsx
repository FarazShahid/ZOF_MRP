import React, { useState } from "react";
import { Field } from "formik";
import { useFetchProducts } from "../services/useFetchProducts";
import { useFetchPrintingOptions } from "../services/useFetchPrintingOptions";
import { fetchWithAuth } from "../services/authservice";
import {
  AvailableColor,
  formatedProductName,
  OrderProductFormProps,
} from "../interfaces";

function OrderProductForm({ index, remove }: OrderProductFormProps) {
  const [availableColors, setAvailableColors] = useState<AvailableColor[]>([]);
  const { products } = useFetchProducts();
  const { printingoptions } = useFetchPrintingOptions();

  const handleProductChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const productId = event.target.value;
    const formikField = document.querySelector(
      `[name="items[${index}].ProductId"]`
    ) as HTMLInputElement;
    if (formikField) {
      formikField.value = productId;
    }

    if (productId) {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/products/availablecolors/${productId}`
        );
        if (response.ok) {
          const colors = await response.json();
          setAvailableColors(colors);
        } else {
          setAvailableColors([]);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
        setAvailableColors([]);
      }
    } else {
      setAvailableColors([]);
    }
  };

  return (
    <div className="flex flex-col w-full gap-3 px-5 py-2.5 rounded-md border border-gray-400">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Product</label>
          <Field
            as="select"
            name={`items[${index}].ProductId`}
            className="inputDefault p-[7px] rounded-md"
            onChange={handleProductChange}
          >
            <option value="">Select</option>
            {products?.map((product) => {
              return (
                <option key={product.Id} value={product.Id}>
                  {formatedProductName(
                    product.Name,
                  )}
                </option>
              );
            })}
          </Field>
        </div>
        {availableColors.length > 0 && (
          <div className="flex flex-col">
            <label className="text-gray-600 text-lg">Available Colors</label>
            <Field
              as="select"
              name={`items[${index}].color`}
              className="inputDefault p-[7px] rounded-md"
            >
              <option value="">Select Color</option>
              {availableColors?.map((color) => (
                <option key={color.Id} value={color.Id}>
                  {color.ColorName}
                </option>
              ))}
            </Field>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Printing Options</label>
          <div className="w-full flex items-center gap-2">
            <Field
              as="select"
              name={`items[${index}].printingOptions`}
              className="inputDefault p-[7px] rounded-md w-full"
            >
              <option value="">Select printing options</option>
              {printingoptions?.map((printingOption) => {
                return (
                  <option value={printingOption.Id}>
                    {printingOption.Type}
                  </option>
                );
              })}
            </Field>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Details</label>
          <Field
            as="textarea"
            name="description"
            rows={1}
            className="inputDefault p-[7px] rounded-md"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-600 text-lg">Product Image</label>
        <Field
          name={`items[${index}].productImage`}
          type="file"
          className="inputDefault p-[7px] rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-600 text-lg">Order Details</label>
        <Field
          as="textarea"
          name={`items[${index}].Description`}
          rows={5}
          className="inputDefault p-[7px] rounded-md"
        />
      </div>
    </div>
  );
}

export default OrderProductForm;
