"use client";

import { useMemo, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  getKeyValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import Layout from "../components/Layout";
import InventoryItemChip from "../components/InventoryItemChip";

const page = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const inventoryItems = [
    {
      Id: "I-12",
      Name: "Item 1",
      Type: "type 1",
      Qunatity: 23,
      StatusName: "Out Of Stock",
      StatusId: "1",
      LastUpdated: "12/03/2024",
    },
    {
      Id: "I-13",
      Name: "Item 2",
      Type: "type 2",
      Qunatity: 30,
      StatusName: "In Stock",
      StatusId: "2",
      LastUpdated: "25/04/2024",
    },
    {
      Id: "I-14",
      Name: "Item 3",
      Type: "type 3",
      Qunatity: 500,
      StatusName: "Low Stock",
      StatusId: "3",
      LastUpdated: "25/04/2024",
    },
  ];
  const products = [{ Name: "Ali", Id: "1" }];

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const rowsPerPage = 15;
  const pages = Math.ceil(inventoryItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return inventoryItems?.slice(start, end);
  }, [page, inventoryItems]);

  return (
    <Layout>
      <div className="w-full flex flex-col gap-3 p-5">
        <div className="flex justify-between gap-2">
          <h1 className="text-2xl font-semibold headerFontFamily">Inventory</h1>
          <div className="flex items-center gap-2">
            <Button onPress={onOpen} color="primary" size="md">
              New Item
            </Button>
            <div className="flex w-[200px] flex-wrap md:flex-nowrap gap-4">
              <Autocomplete
                scrollShadowProps={{
                  isEnabled: false,
                }}
                startContent={<CiSearch size={40} />}
                defaultItems={products || []}
                itemHeight={40}
                variant="bordered"
                aria-label="items"
                labelPlacement="outside"
                maxListboxHeight={200}
                placeholder="Search Items.."
                // onInputChange={onInputChange}
                // onSelectionChange={onSelectionChange}
              >
                {(product) => (
                  <AutocompleteItem key={product.Id}>
                    {product.Name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex w-[200px] flex-wrap md:flex-nowrap gap-4">
            <Autocomplete
              scrollShadowProps={{
                isEnabled: false,
              }}
              defaultItems={products || []}
              itemHeight={40}
              variant="bordered"
              startContent={<CiSearch size={40} />}
              label="Clients"
              labelPlacement="outside"
              maxListboxHeight={200}
              // onInputChange={onInputChange}
              // onSelectionChange={onSelectionChange}
            >
              {(product) => (
                <AutocompleteItem key={product.Id}>
                  {product.Name}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
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
            <TableColumn key="Id" className="text-medium font-bold">
              Item Id
            </TableColumn>
            <TableColumn key="Name" className="text-medium font-bold">
              Item Name
            </TableColumn>
            <TableColumn key="Qunatity" className="text-medium font-bold">
              Qunatity
            </TableColumn>
            <TableColumn key="Type" className="text-medium font-bold">
              Category
            </TableColumn>
            <TableColumn key="StatusName" className="text-medium font-bold">
              Status
            </TableColumn>
            <TableColumn key="LastUpdated" className="text-medium font-bold">
              Last Updated
            </TableColumn>
            <TableColumn key="Action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={isLoading} items={items}>
            {(item) => (
              <TableRow key={item.Id}>
                {(columnKey) => {
                  switch (columnKey) {
                    case "Status":
                      return (
                        <TableCell>
                          <InventoryItemChip
                              Status={getKeyValue(item, columnKey)}
                          />
                        </TableCell>
                      );
                    case "Action":
                      return (
                        <TableCell>
                          <div className="flex gap-2">
                            <button type="button">
                              <FaEdit size={18} />
                            </button>
                            <button type="button">
                              <MdDelete size={20} />
                            </button>
                          </div>
                        </TableCell>
                      );
                    default:
                      return (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      );
                  }
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  New Item
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-sm text-[#181818]">
                        Name
                      </label>
                      <input
                        type="text"
                        name="Name"
                        className="formInputdefault"
                        placeholder="Enter Name"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-sm text-[#181818]">
                        Catagory
                      </label>
                      <select className="formInputdefault">
                        <option value="">Select Catagory</option>
                        <option value="1">Cat-1</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-sm text-[#181818]">
                        Qunatity
                      </label>
                      <input type="number" className="formInputdefault" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-medium text-sm text-[#181818]">
                        Status
                      </label>
                      <select className="formInputdefault">
                        <option value="">Select Status</option>
                        <option value="1">Out Of Stock</option>
                        <option value="2">In Stock</option>
                        <option value="3">Low Stock</option>
                      </select>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Add
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
};

export default page;
