"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getKeyValue,
  Input,
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
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import AddSizeOptions from "./AddSizeOptions";
import DeleteSizeOptions from "./DeleteSizeOptions";
import AddButton from "../../components/common/AddButton";
import { useSearch } from "@/src/hooks/useSearch";
import { CiSearch } from "react-icons/ci";

const ProductSizeOptions = () => {
  const [page, setPage] = useState<number>(1);
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedSizeOptionId, setSelectedSizeOptionId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const { fetchsizeOptions, sizeOptions, loading } = useSizeOptionsStore();

  // Search on 2 fields
  const filtered = useSearch(sizeOptions, query, [
    "OptionSizeOptions",
    "ProductRegionName",
  ]);
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

  useEffect(() => {
    fetchsizeOptions();
  }, []);

  const openAddModal = () => setIsAddModalOpen(true);

  const handleOpenDeleteModal = (sizeOptionId: number) => {
    setSelectedSizeOptionId(sizeOptionId);
    setIsOpenDeleteModal(true);
  };
  const closeDeleteModal = () => setIsOpenDeleteModal(false);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsEdit(false);
  };
  const openEditModal = (sizeId: number) => {
    setSelectedSizeOptionId(sizeId);
    setIsAddModalOpen(true);
    setIsEdit(true);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h6 className="font-sans text-lg font-semibold">Size Options</h6>
          <div className="flex justify-end gap-3">
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
          aria-label="Product Table with pagination"
          classNames={{
            wrapper: "min-h-[222px]",
            th: "tableHeaderWrapper",
          }}
          bottomContent={
            <div className="grid grid-cols-2 mt-5">
              <span className="w-[30%] text-small text-gray-500">
                Total: {sizeOptions?.length || 0}
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
            <TableColumn
              key="OptionSizeOptions"
              className="text-medium font-bold"
            >
              Size Option
            </TableColumn>
            <TableColumn
              key="ProductRegionName"
              className="text-medium font-bold"
            >
              Region
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
                          onClick={() => openEditModal(item?.Id)}
                        >
                          <GoPencil color="green" />
                        </button>
                        <button
                          type="button"
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleOpenDeleteModal(item?.Id)}
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

        {isAddModalOpen ? (
          <AddSizeOptions
            isOpen={isAddModalOpen}
            closeAddModal={closeAddModal}
            isEdit={isEdit}
            sizeOptionId={selectedSizeOptionId}
          />
        ) : (
          <></>
        )}

        <DeleteSizeOptions
          isOpen={isOpenDeletModal}
          onClose={closeDeleteModal}
          sizeOptionId={selectedSizeOptionId}
        />
      </div>
    </>
  );
};

export default ProductSizeOptions;
