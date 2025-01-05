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
      </div>
    </Layout>
  );
};

export default page;
