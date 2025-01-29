"use client"

import Layout from "../components/Layout";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import Products from "./components/Products";
import ProductCatagory from "./components/ProductCatagory";

const page = () => {
  return (
    <Layout>
      <div className="flex w-full flex-col p-5">
        <Tabs aria-label="Options" color="primary">
          <Tab key="products" title="Products">
            <Products />
          </Tab>
          <Tab key="catagory" title="Product Catagory">
            <ProductCatagory />
          </Tab>
        </Tabs>
      </div>
    </Layout>
  );
};

export default page;
