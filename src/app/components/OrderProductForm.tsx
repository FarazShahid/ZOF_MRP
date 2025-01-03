import React, { Fragment, useState } from "react";
import { Field } from "formik";
import { useFetchProducts } from "../services/useFetchProducts";

interface OrderProductFormProps {
  index: number;
  remove: (index: number) => void;
}

function OrderProductForm({ index, remove }: OrderProductFormProps) {

  const {products, isLoading} = useFetchProducts();

  return (
    <div className="flex flex-col w-full gap-3 px-5 py-2.5 rounded-md border border-gray-400">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Product</label>
          <Field
            as="select"
            name={`items[${index}].ProductId`}
            className="inputDefault p-[7px] rounded-md"
          >
            <option value="">Select</option>
            {products?.map((product)=>{
              return(
                <option value={product.Id}>{product.Name}</option>
              )
            })}
          </Field>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Fabric Type</label>
          <div className="w-full flex items-center gap-2">
            <Field
              as="select"
              name={`items[${index}].fabricType`}
              className="inputDefault p-[7px] rounded-md w-full"
            >
              <option value="">Select</option>
              <option value="Cotton">Cotton</option>
              <option value="Chenille">Chenille</option>
              <option value="Chiffon">Chiffon</option>
            </Field>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Color</label>
          <div className="w-full flex items-center gap-2">
            <Field
              as="select"
              name={`items[${index}].color`}
              className="inputDefault p-[7px] rounded-md flex-grow"
            >
              <option value="">Select</option>
              <option value="#000000">#000000</option>
              <option value="#ababab">#ababab</option>
              <option value="#cd5c5c">#cd5c5c</option>
              <option value="#f08080">#f08080</option>
              <option value="#f0906e">#f0906e</option>
              <option value="#6b5b4e">#6b5b4e</option>
              <option value="#fbb79a">#fbb79a</option>
              <option value="#ffa07a">#ffa07a</option>
            </Field>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Size</label>
          <Field
            as="select"
            name={`items[${index}].size`}
            className="inputDefault p-[7px] rounded-md"
          >
            <option value="">Select</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </Field>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Product Measure Cut</label>
          <div className="w-full flex items-center gap-2">
            <Field
              as="select"
              name={`items[${index}].measureCut`}
              className="inputDefault p-[7px] rounded-md w-full"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Field>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Printing Options</label>
          <div className="w-full flex items-center gap-2">
            <Field
              as="select"
              name={`items[${index}].printingOptions`}
              className="inputDefault p-[7px] rounded-md w-full"
            >
              <option value="">Select</option>
              <option value="Screen Printing">Screen Printing</option>
              <option value="Stamp Printing">Stamp Printing</option>
            </Field>
          </div>
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
