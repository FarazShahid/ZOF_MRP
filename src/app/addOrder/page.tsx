"use client";

import React, { useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import Layout from "../components/Layout";
import Stepper from "./components/Stepper";

const page = () => {
  const [orderSetps, setOrderSteps] = useState(0);

  
  const handleNext = () =>{
    setOrderSteps(1);
  }

  return (
    <Layout>
      <div className="flex flex-col gap-5 p-5 w-full">
        <button className="flex items-center gap-1" type="button">
          <IoCaretBack size={20} />
          <span>Back to Order list</span>
        </button>
        <div className="flex items-center gap-5 h-full w-full">
          <Stepper orderSetps={orderSetps} />
          <div className="w-[85%] h-full border-2 rounded-lg flex justify-center items-center flex-col gap-2 p-5">
            <div className="flex items-center flex-col gap-1">
              <span>Add New Order</span>
              <span className="font-bold text-2xl font-serif">
                Order Details
              </span>
            </div>
            <div className="bg-gray-100 h-full w-full rounded-md"></div>
            <div className="w-full flex justify-end">
              <button className="bg-gray-300 hover:bg-green-800 hover:text-white px-6 py-2 rounded-md font-semibold text-medium" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default page;
