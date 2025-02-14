"use client";

import Layout from "../components/Layout";
import { Tab, Tabs } from "@heroui/react";
import ProductCatagory from "./Product Catagory/ProductCatagory";
import SleeveType from "./Sleeve Type/SleeveType";
import FabricType from "./Fabric Type/FabricType";
import Products from "./Products/Products";

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

          <Tab key="cutOptions" title="Cut Options" className="w-full"></Tab>
          <Tab
            key="sizeMeasurement"
            title="Product Size Measurement"
            className="w-full"
          ></Tab>
          <Tab
            key="Region"
            title="Product Region Standard"
            className="w-full"
          ></Tab>
          <Tab key="Colors" title="Available Colors" className="w-full"></Tab>
        </Tabs>
      </div>
    </Layout>
  );
};

export default page;
