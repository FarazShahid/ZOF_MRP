import React, { Fragment, useState } from "react";

function OrderProductForm() {
  const [selectedColor, setselectedcolor] = useState("");
  return (
    <Fragment>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Product Category</label>
          <select className="inputDefault p-[7px] rounded-md">
            <option value="">Select</option>
            <option value="sample">T-shirt</option>
            <option value="giveaway">Shorts</option>
            <option value="event">Hoodie</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Fabric Type</label>
          <div className="w-full flex items-center gap-2">
            <select className="inputDefault p-[7px] rounded-md w-full">
              <option value="">Select</option>
              <option value="Cotton">Cotton</option>
              <option value="Chenille">Chenille</option>
              <option value="Chiffon">Chiffon</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Color</label>
          <div className="w-full flex items-center gap-2">
            <select
              className="inputDefault p-[7px] rounded-md flex-grow"
              onChange={(e) => setselectedcolor(e.target.value)}
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
            </select>
            <div className="flex inputDefault  items-center justify-center rounded-lg w-[40px] aspect-square">
              <span
                className="w-[30px] aspect-square rounded-lg block"
                style={{ background: selectedColor }}
              ></span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Size</label>
          <select className="inputDefault p-[7px] rounded-md">
            <option value="">Select</option>
            <option value="s">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Product Measure Cut</label>
          <div className="w-full flex items-center gap-2">
            <select className="inputDefault p-[7px] rounded-md w-full">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 text-lg">Printing Options</label>
          <div className="w-full flex items-center gap-2">
            <select className="inputDefault p-[7px] rounded-md w-full">
              <option value="">Select</option>
              <option value="male">Screen Printing</option>
              <option value="female">Stamp Printing</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-600 text-lg">Product Image</label>
        <input className="inputDefault p-[7px] rounded-md" type="file" />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-600 text-lg">Order Details</label>
        <textarea rows={5} className="inputDefault p-[7px] rounded-md" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button className="bg-slate-300 text-black px-2 py-1 w-[100px] rounded-md" type="submit">Add</button>
        <button  className="bg-slate-300 text-black px-2 py-1 w-[100px] rounded-md" type="button">Cancel</button>
      </div>
    </Fragment>
  );
}

export default OrderProductForm;