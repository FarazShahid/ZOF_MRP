"use client";

import { Tab, Tabs } from "@heroui/react";
import Layout from "../components/Layout";
import ProductCatagory from "./Product Catagory/ProductCatagory";
import SleeveType from "./Sleeve Type/SleeveType";
import FabricType from "./Fabric Type/FabricType";
import Products from "./Products/Products";
import CutOptions from "./Cut Options/CutOptions";
import SizeOptions from "./SizeOptions/SizeOptions";
import ColorOptions from "./Color Options/ColorOptions";
import ProductRegionStandard from "./Product Region Standard/ProductRegionStandard";

const page = () => {
  return (
    <Layout>
      <div className="flex w-full flex-col p-5">
        <Tabs
          aria-label="Options"
          color="primary"
          placement="start"
          variant="solid"
          classNames={{ tab: "DefaultTabBorder" }}
        >
          <Tab key="products" title="Products" className="w-full">
            <Products />
          </Tab>
          <Tab key="catagory" title="Product Category" className="w-full">
            <ProductCatagory />
          </Tab>
          <Tab key="fabricTypes" title="Fabric Types" className="w-full">
            <FabricType />
          </Tab>
          <Tab key="sleeveType" title="Sleeve Type" className="w-full">
            <SleeveType />
          </Tab>
          <Tab key="cutOptions" title="Cut Options" className="w-full">
            <CutOptions />
          </Tab>
          <Tab key="sizeMeasurement" title="Size Options" className="w-full">
            <SizeOptions />
          </Tab>
          <Tab key="colorOptions" title="Color Options" className="w-full">
            <ColorOptions />
          </Tab>
          <Tab key="productRegionStandard" title="Product Region Standard" className="w-full">
            <ProductRegionStandard />
          </Tab>
        </Tabs>
      </div>
    </Layout>
  );
};

export default page;
