"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "@heroui/react";

import AddClients from "../components/AddClients";
import DeleteClient from "../components/DeleteClient";
import Layout from "../components/Layout";
import useClientStore from "@/store/useClientStore";

const page = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {fetchClients, clients, loading} = useClientStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(clients!.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return clients?.slice(start, end);
  }, [page, clients]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const handleOpenDeleteModal = (clientId: number) => {
    setSelectedClientId(clientId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const handleOpenEditModal = (clientId: number) => {
    setSelectedClientId(clientId);
    setIsEdit(true);
    setIsAddModalOpen(true);
  };
  const refetchData = () => {
    setRefreshKey((prev) => prev + 1);
  };

useEffect(()=>{
  fetchClients();
},[])

  return (
    <Layout>
      <div className="w-full flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <Button color="primary" size="sm" onPress={openAddModal}>
            Add Client
          </Button>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
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
             th:"tableHeaderWrapper"
          }}
        >
          <TableHeader>
            <TableColumn key="Name" className="text-medium font-bold">
              Name
            </TableColumn>
            <TableColumn key="Email" className="text-medium font-bold">
              Email
            </TableColumn>
            <TableColumn key="Phone" className="text-medium font-bold">
              Phone
            </TableColumn>
            <TableColumn key="City" className="text-medium font-bold">
              City
            </TableColumn>
            <TableColumn key="State" className="text-medium font-bold">
              State
            </TableColumn>
            <TableColumn key="Country" className="text-medium font-bold">
              Country
            </TableColumn>
            <TableColumn
              key="CompleteAddress"
              className="text-medium font-bold"
            >
              Address
            </TableColumn>
            <TableColumn key="Action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(item) => (
              <TableRow key={item.Id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey !== "Action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item.Id)}
                        >
                          <img src="/EditIcon.svg" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(item.Id)}
                        >
                          <img src="/DeleteIcon.svg" />
                        </button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <AddClients
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          onOrderAdded={refetchData}
          isEdit={isEdit}
          clientId={selectedClientId}
        />

        <DeleteClient
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          clientId={selectedClientId}
          onDeleteSuccess={refetchData}
        />
      </div>
    </Layout>
  );
};

export default page;
