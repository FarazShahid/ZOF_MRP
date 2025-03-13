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
import { FaTshirt } from "react-icons/fa";
import { TbNeedleThread } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { IoMdCut, IoMdColorFill } from "react-icons/io";
import { TbRulerMeasure2 } from "react-icons/tb";
import { FaFlag } from "react-icons/fa";

const page = () => {
  return (
    <Layout>
      <div className="flex w-full flex-col p-5">
        <Tabs
          aria-label="Options"
          color="secondary"
          placement="top"
          variant="solid"
        >
          <Tab
            key="products"
            title={
              <div className="flex items-center space-x-2">
                <AiFillProduct />
                <span>Products</span>
              </div>
            }
            className="w-full"
          >
            <Products />
          </Tab>

          <Tab
            key="fabricTypes"
            title={
              <div className="flex items-center space-x-2">
                <TbNeedleThread />
                <span>Fabric Types</span>
              </div>
            }
            className="w-full"
          >
            <FabricType />
          </Tab>
          <Tab
            key="sleeveType"
            title={
              <div className="flex items-center space-x-2">
                <FaTshirt />
                <span>Sleeve Type</span>
              </div>
            }
            className="w-full"
          >
            <SleeveType />
          </Tab>
          <Tab
            key="catagory"
            title={
              <div className="flex items-center space-x-2">
                <MdOutlineCategory />
                <span>Product Category</span>
              </div>
            }
            className="w-full"
          >
            <ProductCatagory />
          </Tab>
          <Tab
            key="cutOptions"
            title={
              <div className="flex items-center space-x-2">
                <IoMdCut />
                <span>Cut Options</span>
              </div>
            }
            className="w-full"
          >
            <CutOptions />
          </Tab>
          <Tab
            key="sizeMeasurement"
            title={
              <div className="flex items-center space-x-2">
                <TbRulerMeasure2 />
                <span>Size Options</span>
              </div>
            }
            className="w-full"
          >
            <SizeOptions />
          </Tab>
          <Tab
            key="colorOptions"
            title={
              <div className="flex items-center space-x-2">
                <IoMdColorFill  />
                <span>Color Options</span>
              </div>
            }
            className="w-full"
          >
            <ColorOptions />
          </Tab>
          <Tab
            key="productRegionStandard"
            title={
              <div className="flex items-center space-x-2">
                <FaFlag   />
                <span>Product Region Standard</span>
              </div>
            }
            className="w-full"
          >
            <ProductRegionStandard />
          </Tab>
        </Tabs>
      </div>
    </Layout>
  );
};

export default page;
