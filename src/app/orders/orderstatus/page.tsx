"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getKeyValue,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddButton from "../../components/common/AddButton";
import useOrderStatusStore from "@/store/useOrderStatusStore";
import AdminDashboardLayout from "../../components/common/AdminDashboardLayout";
import AddStatus from "./components/AddStatus";
import DeleteStatus from "./components/DeleteStatus";
import { IoCaretBackSharp } from "react-icons/io5";

const page = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedStatusId, setSelectedStatusId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { fetchStatuses, statuses, loading } = useOrderStatusStore();

  useEffect(() => {
    fetchStatuses();
  }, []);

  const rowsPerPage = 10;
  const pages = Math.ceil(statuses!.length / rowsPerPage);

  const openAddModal = () => setIsAddModalOpen(true);

  const handleOpenDeleteModal = (Id: number) => {
    setSelectedStatusId(Id);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (Id: number) => {
    setSelectedStatusId(Id);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return statuses?.slice(start, end);
  }, [page, statuses]);

  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link
              href={"/orders"}
              className="flex items-center gap-1 dark:text-gray-400 text-gray-900 hover:text-gray-900 dark:hover:text-white"
            >
              <IoCaretBackSharp />
              <h6 className="font-sans text-lg font-semibold">Status</h6>
            </Link>
          </div>

          <AddButton title="Add New" onClick={openAddModal} />
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Product Table with pagination"
          classNames={{
            wrapper: "min-h-[222px]",
            th: "tableHeaderWrapper",
          }}
          bottomContent={
            <div className="grid grid-cols-2 mt-5">
              <span className="w-[30%] text-small text-gray-500">
                Total: {statuses.length || 0}
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
        >
          <TableHeader>
            <TableColumn key="Sr" className="text-medium font-bold">
              Sr
            </TableColumn>
            <TableColumn key="StatusName" className="text-medium font-bold">
              Name
            </TableColumn>
            <TableColumn key="Description" className="text-medium font-bold">
              Description
            </TableColumn>

            <TableColumn key="action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(items ?? []).map((item: any, index: number) => (
              <TableRow key={item.Id}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleOpenDeleteModal(item.Id)}
                        >
                          <RiDeleteBin6Line color="red" />
                        </button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AddStatus
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          Id={selectedStatusId}
        />

        <DeleteStatus
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          Id={selectedStatusId}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default page;
