"use client";

import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Button,
} from "@nextui-org/react";
import { useFetchProducts } from "../services/useFetchProducts";

const page = () => {
  const { products, isLoading } = useFetchProducts();

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  const pages = Math.ceil(products!.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products?.slice(start, end);
  }, [page, products]);

  return (
    <Layout>
      <div className="w-full flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Products</h1>
          {/* <Button color="primary" size="sm">
            Add Products
          </Button> */}
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Product Table with pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn
              key="Name"
              className="text-medium font-bold"
            >
              Name
            </TableColumn>
            {/* <TableColumn
              key="ProductCategoryId"
              className="text-medium font-bold"
            >
              Fabric Type
            </TableColumn> */}
            {/* <TableColumn
              key="FabricTypeId"
              className="text-medium font-bold"
            >
              Product Category
            </TableColumn> */}
            <TableColumn
              key="Description"
              className="text-medium font-bold"
            >
              Description
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={isLoading} items={items}>
            {(item) => (
              <TableRow key={item.Id}>
                {(columnKey) => (
                  <TableCell className="">
                    {getKeyValue(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default page;
