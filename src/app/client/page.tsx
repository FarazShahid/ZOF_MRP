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
} from "@heroui/react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import useClientStore from "@/store/useClientStore";
import AddClients from "../components/AddClients";
import DeleteClient from "../components/DeleteClient";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import AdminLayout from "../adminDashboard/lauout";

const page = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { fetchClients, clients, loading } = useClientStore();

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

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <AdminLayout>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="flex items-center gap-2 text-white bg-[#584BDD] px-2 py-1 rounded-lg text-sm"
            onClick={openAddModal}
          >
            <FiPlus />
            Add New
          </button>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="grid grid-cols-2">
              <span className="w-[30%] text-small text-gray-500">
                Total: {items.length || 0}
              </span>
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
            th: "tableHeaderWrapper",
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
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(item.Id)}
                        >
                          <RiDeleteBin6Line color="red" />
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
    </AdminLayout>
  );
};

export default page;
