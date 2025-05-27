"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Tooltip } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FiRefreshCw, FiSettings } from "react-icons/fi";
import { MdOutlineFilterAlt } from "react-icons/md";
import useProductStore from "@/store/useProductStore";
import useCategoryStore from "@/store/useCategoryStore";
import ProductsTable from "./component/ProductsTable";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import AddButton from "../components/common/AddButton";
import { Product } from "../services/useFetchProducts";
import useFabricStore from "@/store/useFabricStore";

const page = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFabricType, setSelectedFabricType] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const { fetchCategories, productCategories } = useCategoryStore();
  const { fetchProducts, products } = useProductStore();
  const { fetchFabricType, fabricTypeData } = useFabricStore();
  const router = useRouter();

  const handleClick = () => {
    router.push("/product/productform");
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFabricType();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.ProductCategoryId === parseInt(selectedCategory)
      );
    }

    if (selectedFabricType !== "All") {
      filtered = filtered.filter(
        (product) => product.FabricTypeId === parseInt(selectedFabricType)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedFabricType, products]);

  return (
    <AdminDashboardLayout>
      <div className="space-x-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-5">
            <h6 className="text-white text-xl font-semibold">Product</h6>
            <div className="border-1 border-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="text-white text-xs">
                {products?.length || 0}
              </span>
              <span className="text-gray-500 text-[10px]">total products</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Tooltip content="Product Definition">
              <Link
                href={"/product/productdefination"}
                className="bg-gray-700 rounded-lg p-2"
              >
                <FiSettings size={20} />
              </Link>
            </Tooltip>
            {/* <div className="flex items-center bg-gray-700 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedListType(1)}
                className={`p-2 rounded-lg text-gray-200 ${
                  selectedListType === 1 ? "activeListing" : ""
                }`}
              >
                <FaList />
              </button>
              <button
                type="button"
                onClick={() => setSelectedListType(2)}
                className={`p-2 rounded-lg text-gray-200 ${
                  selectedListType === 2 ? "activeListing" : ""
                }`}
              >
                <AiFillProduct />
              </button>
            </div> */}
            <AddButton title={"Add Product"} onClick={handleClick} />
          </div>
        </div>
        <div className="flex gap-7 w-full mt-5 h-full">
          <div className="bg-gray-900 p-5 h-full rounded-lg flex flex-col gap-6">
            <span className="text-gray-50 uppercase text-sm flex items-center gap-2">
              <MdOutlineFilterAlt size={19} /> Filters
            </span>
            <div className="flex flex-col gap-2">
              <label className="text-gray-50 uppercase text-xs">category</label>
              <div className="w-[200px]">
                <select
                  className="border-gray-600 bg-gray-800 text-gray-50 rounded-xl w-full text-sm px-1 py-2 outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value={"All"}>All Categories</option>
                  {productCategories?.map((category, index) => {
                    return (
                      <option value={category?.id} key={index}>
                        {category?.type}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-50 uppercase text-xs">
                fabric type
              </label>
              <div className="w-[200px]">
                <select
                  value={selectedFabricType}
                  onChange={(e) => setSelectedFabricType(e.target.value)}
                  className="border-gray-600 bg-gray-800 text-gray-50 rounded-xl w-full text-sm px-1 py-2 outline-none"
                >
                  <option value={"All"}>All types</option>
                  {fabricTypeData?.map((fabric, index) => {
                    return (
                      <option value={fabric?.id} key={index}>
                        {fabric?.type}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedFabricType("All");
              }}
              className="flex items-center justify-center gap-3 py-2  text-base text-gray-50 rounded-lg border-gray-600 bg-gray-800"
            >
              <FiRefreshCw /> Reset Filters
            </button>
          </div>
          <ProductsTable products={filteredProducts} />
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default page;
