"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";

import Layout from "../components/Layout";
import SideNavigation from "../components/SideNavigation";
import OrderTable from "../components/OrderTable";
import AddOrderComponent from "../components/AddOrderComponent";

const page = () => {
  const [clientId, setClientId] = useState<string>("");
  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [refreshTableData, setRefreshTableData] = useState<number>(0);

  // Function to refresh the OrderTable by updating the refreshKey
  const handleOrderAdded = () => {
    setRefreshTableData((prev) => prev + 1);
  };
  const openAddOrderModal = () => setIsAddOrderModalOpen(true);
  const closeAddOrderModal = () => setIsAddOrderModalOpen(false);

  return (
    <Layout>
      <SideNavigation
        isSideNavOpen={isSideNavOpen}
        setIsSideNavOpen={setIsSideNavOpen}
        onClientSelect={(id: string) => setClientId(id)}
      />
      <div className="w-full flex flex-col gap-3 p-5 max-h-full overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex w-fit items-center">
            <button
              className="xl:hidden pt-1 mr-2.5 rounded-md focus:outline-none hover:bg-gray-700"
              onClick={() => {
                setIsSideNavOpen(true);
              }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1 className="text-2xl font-semibold headerFontFamily">Orders</h1>
          </div>
          {clientId && (
            <Button color="primary" size="sm" onPress={openAddOrderModal}>
              Create Order
            </Button>
          )}
        </div>
        {clientId && (
          <OrderTable refreshTableData={refreshTableData} clientId={clientId} />
        )}
      </div>

      <AddOrderComponent
        isOpen={isAddOrderModalOpen}
        clientId={clientId}
        onClose={closeAddOrderModal}
        onOrderAdded={handleOrderAdded}
      />
    </Layout>
  );
};

export default page;
