import React, { useMemo, useState } from "react";
import {
  getKeyValue,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { productComponentProp } from "./ProductGrid";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbStatusChange } from "react-icons/tb";
import DeleteProduct from "../../products/DeleteProduct";
import { useRouter } from "next/navigation";
import ProductStatusChip from "./ProductStatusChip";
import ChangeProductStatus from "./ChangeProductStatus";
import { bool, boolean } from "yup";

const ProductsTable: React.FC<productComponentProp> = ({ products }) => {
  const [isOpenDeletModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [OpenChangeStatusModal, setOpenChangeStatusModal] =
    useState<boolean>(false);
  const [statusModalTitle, setStatusModalTitle] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<boolean>(false);

  const router = useRouter();

  const rowsPerPage = 13;
  const pages = Math.ceil(products?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products?.slice(start, end);
  }, [page, products]);

  const openEditModal = (productId: number) => {
    router.push(`product/editproduct/${productId}`);
  };
  const handleOpenDeleteModal = (productId: number) => {
    setSelectedProductId(productId);
    setIsOpenDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const handleChangeStatus = (id: number, status: boolean) => {
    setSelectedProductId(id);
    setCurrentStatus(status);
    if (status) {
      setStatusModalTitle("Are you sure you want to Unarchive this product?");
    } else {
      setStatusModalTitle("Are you sure you want to Archive this product?");
    }
    setOpenChangeStatusModal(true);
  };
  const closeChangeStatusModal = () => {
    setOpenChangeStatusModal(false);
  };

  return (
    <>
      <Table
        isStriped
        isHeaderSticky
        aria-label="Product Table with pagination"
        classNames={{
          wrapper: "min-h-[222px]",
          th: "tableHeaderWrapper",
        }}
        bottomContent={
          <div className="grid grid-cols-3">
            <span className="w-[20%] text-small text-gray-500">
              Total: {products?.length || 0}
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
            <div></div>
          </div>
        }
      >
        <TableHeader>
          <TableColumn key="Sr" className="text-medium font-bold">
            Sr
          </TableColumn>
          <TableColumn key="Name" className="text-medium font-bold">
            Name
          </TableColumn>
          <TableColumn
            key="ProductCategoryName"
            className="text-medium font-bold"
          >
            Product Category
          </TableColumn>
          <TableColumn key="ClientName" className="text-medium font-bold">
            Client Name
          </TableColumn>

          <TableColumn key="FabricName" className="text-medium font-bold">
            Fabric
          </TableColumn>
          <TableColumn key="FabricType" className="text-medium font-bold">
            Fabric Type
          </TableColumn>
          <TableColumn key="GSM" className="text-medium font-bold">
            GSM
          </TableColumn>
          <TableColumn key="productStatus" className="text-medium font-bold">
            Status
          </TableColumn>
          <TableColumn key="isArchived" className="text-medium font-bold">
            Archived
          </TableColumn>
          <TableColumn key="action" className="text-medium font-bold">
            Action
          </TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(items ?? [])?.map((item: any, index: number) => (
            <TableRow key={item?.Id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "Sr" ? (
                    index + 1
                  ) : columnKey === "productStatus" ? (
                    <ProductStatusChip status={item?.productStatus} />
                  ) : columnKey === "isArchived" ? (
                    <div
                      className={`border-1 rounded-lg text-center w-fit px-2 ${
                        item.isArchived
                          ? " border-red-500 text-red-600"
                          : "border-green-500 text-green-600"
                      }`}
                    >
                      {item.isArchived ? "Archived" : "Unarchived"}
                    </div>
                  ) : columnKey !== "action" ? (
                    getKeyValue(item, columnKey)
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleChangeStatus(item?.Id, item?.isArchived)
                        }
                      >
                        <TbStatusChange />
                      </button>
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

      <DeleteProduct
        isOpen={isOpenDeletModal}
        onClose={closeDeleteModal}
        productId={selectedProductId}
      />

      <ChangeProductStatus
        isOpen={OpenChangeStatusModal}
        onClose={closeChangeStatusModal}
        productId={selectedProductId}
        title={statusModalTitle}
        currentStatus={currentStatus}
      />
    </>
  );
};

export default ProductsTable;
