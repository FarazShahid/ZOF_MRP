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
import { useFetchClients } from "../services/useFetchClients";
import AddClients from "../components/AddClients";

const page = () => {
  const { client, isLoading } = useFetchClients();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  const pages = Math.ceil(client!.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return client?.slice(start, end);
  }, [page, client]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const refetchData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Layout>
      <div className="w-full flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Clients</h1>
          {/* <Button color="primary" size="sm" onPress={openAddModal}>
            Add Client
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
            <TableColumn
              key="Email"
              className="text-medium font-bold"
            >
              Email
            </TableColumn>
            <TableColumn
              key="Phone"
              className="text-medium font-bold"
            >
              Phone
            </TableColumn>
            <TableColumn
              key="Country"
              className="text-medium font-bold"
            >
              Country
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={isLoading} items={items}>
            {(item) => (
              <TableRow key={item.Id}>
                {(columnKey) => (
                  <TableCell>
                    {getKeyValue(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <AddClients
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          refreshKey={refreshKey}
          onOrderAdded={refetchData}
        />
      </div>
    </Layout>
  );
};

export default page;
