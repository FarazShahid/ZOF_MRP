"use client";

import { useEffect } from "react";
import useOrderStore from "@/store/useOrderStore";
import useClientStore from "@/store/useClientStore";
import OrderList from "../../components/order/OrderList";

const OrderTable = () => {
  const { fetchOrders, Orders } = useOrderStore();
  const { fetchClients, clients } = useClientStore();


  useEffect(() => {
     fetchClients();
      fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded">
      {/* <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <select
            className="p-1 rounded-lg border-1"
            onChange={(e) => handleClinetFilter(e.target.value)}
          >
            <option value={0}>View All</option>
            {clients?.map((client, index) => {
              return (
                <option value={client?.Id} key={index}>
                  {client?.Name}
                </option>
              );
            })}
          </select>

          <div className="flex items-center gap-2">
            <Link
              href={"/orders/addorder"}
              type="button"
              className="text-sm rounded-full dark:bg-blue-600 bg-blue-800 text-white font-semibold px-3 py-2 flex items-center gap-2"
            >
              <FiPlus />
              Add New
            </Link>
          </div>
        </div>
        <Table
          isStriped
          isHeaderSticky
          aria-label="Client Table with pagination"
          bottomContent={
            <div className="grid grid-cols-2">
              <span className="w-[30%] text-small text-gray-500">
                Total: {Orders?.length || 0}
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
            <TableColumn key="OrderName" className="text-medium font-bold">
              Order Name
            </TableColumn>
            <TableColumn key="OrderNumber" className="text-medium font-bold">
              Order No.
            </TableColumn>
            <TableColumn key="ClientName" className="text-medium font-bold">
              Client
            </TableColumn>
            <TableColumn key="EventName" className="text-medium font-bold">
              Event
            </TableColumn>
            <TableColumn key="StatusName" className="text-medium font-bold">
              Status
            </TableColumn>
            <TableColumn key="Deadline" className="text-medium font-bold">
              Deadline
            </TableColumn>
            <TableColumn key="Action" className="text-medium font-bold">
              Action
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} items={items}>
            {(item) => (
              <TableRow key={`${item?.Id}_${item?.OrderNumber}`}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "Deadline" ? (
                      formatDate(item[columnKey])
                    ) : columnKey === "StatusName" ? (
                      <StatusChip OrderStatus={item?.StatusName} />
                    ) : columnKey !== "Action" ? (
                      getKeyValue(item, columnKey)
                    ) : (
                      <div className="flex gap-2">
                        <ActionBtn
                          icon={<TbReorder size={20} />}
                          onClick={() => handleOpenReorderModal(item?.Id)}
                          title="Reorder"
                          className="dark:text-green-400 text-green-800"
                        />
                        <ActionBtn
                          icon={<FaRegEye />}
                          onClick={() => OpenViewModal(item?.Id)}
                          title="View Order"
                          className="dark:text-blue-300 text-blue-500"
                        />

                        <ActionBtn
                          icon={<GoPencil />}
                          className="dark:text-green-300 text-green-500"
                          onClick={() => editOrder(item?.Id)}
                          title="Edit Order"
                        />
                        <ActionBtn
                          icon={<RiDeleteBin6Line />}
                          className="dark:text-red-300 text-red-500"
                          onClick={() => openDeleteModal(item?.Id)}
                          title="Delete Order"
                        />
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div> */}

      <OrderList clients={clients} orders={Orders} />
    </div>
  );
};

export default OrderTable;
