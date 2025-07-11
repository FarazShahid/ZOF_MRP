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
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import useClientStore, { GetClientsType } from "@/store/useClientStore";
import AddClients from "../components/AddClients";
import DeleteClient from "../components/DeleteClient";
import AdminDashboardLayout from "../components/common/AdminDashboardLayout";
import AddButton from "../components/common/AddButton";

const page = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<keyof GetClientsType>("Name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { fetchClients, clients, loading } = useClientStore();

  const rowsPerPage = 15;
  const pages = Math.ceil(clients?.length / rowsPerPage);

  const items = useMemo(() => {
    const sorted = [...(clients || [])].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // String sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Date sorting (for fields like CreatedOn)
      if (
        sortColumn === "CreatedOn" &&
        typeof aValue === "string" &&
        typeof bValue === "string"
      ) {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }

      return 0;
    });

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sorted.slice(start, end);
  }, [page, clients, sortColumn, sortDirection]);

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

  const handleSort = (column: keyof GetClientsType) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [sortColumn, sortDirection]);

  return (
    <AdminDashboardLayout>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-end">
          <AddButton title={"Add New"} onClick={openAddModal} />
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          selectionMode="single"
          bottomContent={
            <div className="grid grid-cols-2 mt-5">
              <span className="w-[30%] text-small text-gray-500">
                Total: {clients?.length || 0}
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
            <TableColumn
              key="Name"
              className="text-medium font-bold cursor-pointer"
              onClick={() => handleSort("Name")}
            >
              <div className="flex items-center gap-1">
                Business Name
                {sortColumn === "Name" &&
                  (sortDirection === "asc" ? (
                    <TiArrowSortedUp />
                  ) : (
                    <TiArrowSortedDown />
                  ))}
              </div>
            </TableColumn>
            <TableColumn
              key="Email"
              className="text-medium font-bold cursor-pointer"
              onClick={() => handleSort("Email")}
            >
              <div className="flex items-center gap-1">
                Business Email
                {sortColumn === "Email" &&
                  (sortDirection === "asc" ? (
                    <TiArrowSortedUp />
                  ) : (
                    <TiArrowSortedDown />
                  ))}
              </div>
            </TableColumn>
            <TableColumn key="POCName" className="text-medium font-bold">
              POC Name
            </TableColumn>
            <TableColumn
              key="Phone"
              className="text-medium font-bold cursor-pointer"
              onClick={() => handleSort("Phone")}
            >
              <div className="flex items-center gap-1">
                POC Phone
                {sortColumn === "Phone" &&
                  (sortDirection === "asc" ? (
                    <TiArrowSortedUp />
                  ) : (
                    <TiArrowSortedDown />
                  ))}
              </div>
            </TableColumn>

            <TableColumn key="POCEmail" className="text-medium font-bold">
              POC Email
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
                          onClick={() => handleOpenEditModal(item?.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(item?.Id)}
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
    </AdminDashboardLayout>
  );
};

export default page;
