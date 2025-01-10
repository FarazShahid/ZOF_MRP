"use client"

import {Button} from "@nextui-org/react";
import Layout from "../components/Layout";

const page = () => {
  return (
    <Layout>
      <div className="w-full flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold headerFontFamily">Inventory</h1>
          <Button color="primary" size="sm">Create Order</Button>
        </div>
        <div className="grid grid-flow-col gap-1">
            <div className="flex flex-col">
              <div className="bg-gray-200 text-center">BlOCK</div>
              <div className="border-1 h-[calc(100vh-160px)] overflow-auto"></div>
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-200 text-center">TODO</div>
              <div className="border-1 h-[calc(100vh-160px)] overflow-auto"></div>
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-200 text-center">IN PROGRESS</div>
              <div className="border-1 h-[calc(100vh-160px)] overflow-auto"></div>
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-200 text-center">QA</div>
              <div className="border-1 h-[calc(100vh-160px)] overflow-auto"></div>
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-200 text-center">DONE</div>
              <div className="border-1 h-[calc(100vh-160px)] overflow-auto"></div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default page;
