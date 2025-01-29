"use client"

import Layout from "../components/Layout";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import Products from "./components/Products";
import ProductCatagory from "./components/ProductCatagory";

const page = () => {
  return (
    <Layout>
      <div className="flex w-full flex-col p-5">
        <Tabs aria-label="Options">
          <Tab key="products" title="Products">
            <Products />
          </Tab>
          <Tab key="catagory" title="Product Catagory">
            <ProductCatagory />
          </Tab>
          <Tab key="sleevtype" title="Sleev Type">
            <Card>
              <CardBody>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </Layout>
  );
};

export default page;
