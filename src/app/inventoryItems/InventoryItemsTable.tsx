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
  Input,
} from "@heroui/react";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import useInventoryItemsStore from "@/store/useInventoryItemsStore";
import DeleteInventoryItem from "./DeleteInventoryItem";
import AddItems from "./AddItems";
import StockDataVisulizer from "./StockDataVisulizer";
import AddButton from "../components/common/AddButton";
import { formatDate } from "../interfaces";
import ViewItem from "./ViewItem";
import { CiSearch } from "react-icons/ci";
import ActionBtn from "../components/ui/button/ActionBtn";
import { FaRegEye } from "react-icons/fa";
import { useSearch } from "@/src/hooks/useSearch";

const InventoryItemsTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { loading, fetchInventoryItems, inventoryItems } =
    useInventoryItemsStore();

  // Search on 4 fields
  const filtered = useSearch(inventoryItems, query, [
    "Name",
    "CategoryName",
    "SubCategoryName",
    "SupplierName",
  ]);

  // Pagination
  const rowsPerPage = 10;
  const total = filtered?.length ?? 0;
  const rawPages = Math.ceil(total / rowsPerPage);
  const pages = Math.max(1, rawPages);

  const items = useMemo(() => {
    const safePage = Math.min(page, pages);
    const start = (safePage - 1) * rowsPerPage; 
    return filtered?.slice(start, start + rowsPerPage) ?? [];
  }, [filtered, page, pages]);

  // reset page on new search
  useEffect(() => setPage(1), [query]);

  // also clamp page whenever filtered changes (e.g., after search)
  useEffect(() => {
    if (page > pages) setPage(pages);
    if (page < 1) setPage(1);  
  }, [pages, page]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const handleOpenDeleteModal = (Id: number) => {
    setSelectedItemId(Id);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const handleOpenEditModal = (Id: number) => {
    setSelectedItemId(Id);
    setIsEdit(true);
    setIsAddModalOpen(true);
  };

  const handleViewModal = (Id: number) => {
    setSelectedItemId(Id);
    setIsOpenViewModal(true);
  };
  const closeViewModal = () => {
    setIsOpenViewModal(false);
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">Inventory Items</h6>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              classNames={{
                base: "max-w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              startContent={<CiSearch />}
              variant="bordered"
            />
            <AddButton title="Add New" onClick={openAddModal} />
          </div>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="grid grid-cols-2">
              <span className="w-[30%] text-small text-gray-500">
                Total: {items?.length || 0}
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
            <TableColumn key="CategoryName" className="text-medium font-bold">
              Category
            </TableColumn>
            <TableColumn
              key="SubCategoryName"
              className="text-medium font-bold"
            >
              Sub Category
            </TableColumn>
            <TableColumn key="SupplierName" className="text-medium font-bold">
              Supplier
            </TableColumn>
            <TableColumn
              key="UnitOfMeasureName"
              className="text-medium font-bold"
            >
              Unit Of Measure
            </TableColumn>
            <TableColumn key="ReorderLevel" className="text-medium font-bold">
              Reorder Level
            </TableColumn>
            <TableColumn key="Stock" className="text-medium font-bold">
              Stock
            </TableColumn>
            <TableColumn key="StockLevel" className="text-medium font-bold">
              Stock Lavel
            </TableColumn>
            <TableColumn key="CreatedOn" className="text-medium font-bold">
              Created On
            </TableColumn>
            <TableColumn key="UpdatedOn" className="text-medium font-bold">
              Updated On
            </TableColumn>
            <TableColumn key="action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(items ?? [])?.map((item: any, index: number) => (
              <TableRow key={index}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "CreatedOn" || columnKey === "UpdatedOn" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "Sr" ? (
                      index + 1
                    ) : columnKey === "StockLevel" ? (
                      <StockDataVisulizer
                        stock={item?.Stock}
                        reorderLevel={item?.ReorderLevel}
                        itemCode={item?.ItemCode}
                      />
                    ) : columnKey !== "action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <ActionBtn
                          title="View"
                          icon={<FaRegEye size={20} />}
                          onClick={() => handleViewModal(item?.Id)}
                          className="dark:text-blue-300 text-blue-500"
                        />

                        <ActionBtn
                          title="Edit"
                          icon={<GoPencil />}
                          className="dark:text-green-300 text-green-500"
                          onClick={() => handleOpenEditModal(item?.Id)}
                        />
                        <ActionBtn
                          title="Delete"
                          icon={<RiDeleteBin6Line />}
                          className="dark:text-red-300 text-red-500"
                          onClick={() => handleOpenDeleteModal(item?.Id)}
                        />
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {isAddModalOpen ? (
        <AddItems
          isOpen={isAddModalOpen}
          closeAddModal={closeAddModal}
          isEdit={isEdit}
          Id={selectedItemId}
        />
      ) : (
        <></>
      )}

      {isOpenViewModal && (
        <ViewItem
          Id={selectedItemId}
          isOpen={isOpenViewModal}
          closeAddModal={closeViewModal}
        />
      )}

      <DeleteInventoryItem
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        Id={selectedItemId}
      />
    </>
  );
};

export default InventoryItemsTable;
