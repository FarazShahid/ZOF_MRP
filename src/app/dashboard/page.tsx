"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import SideNavigation from "../components/SideNavigation";
import OrderTable from "../components/OrderTable";
import BackIcon from "@/public/svgs/BackIcon";
import AddOrderForm from "../components/AddOrderForm";
import { Button } from "@nextui-org/react";
import AddOrderComponent from "../components/AddOrderComponent";

const page = () => {
  const [clientId, setClientId] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState("table");
  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);

  const openAddOrderModal = () => setIsAddOrderModalOpen(true);
  const closeAddOrderModal = () => setIsAddOrderModalOpen(false);

  const handleOrderAdded = () => {
    console.log("Order added successfully!");
    // Trigger a refresh or any other action needed
  };

  const handleToggle = (componentToRender: string) => {
    setSelectedComponent(componentToRender);
  };
  const handleRouteBack = () => {
    setSelectedComponent("table");
  };

  return (
    <Layout>
      <SideNavigation
        isSideNavOpen={isSideNavOpen}
        setIsSideNavOpen={setIsSideNavOpen}
        onClientSelect={(id: string) => setClientId(id)}
      />
      {clientId ? (
        <div className="w-full flex flex-col gap-3 p-5 max-h-full overflow-y-auto">
          <div className="flex items-center justify-between">
            {selectedComponent === "table" ? (
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
                <h1 className="text-2xl font-semibold headerFontFamily">
                  Orders
                </h1>
              </div>
            ) : (
              <div className="flex w-fit gap-3 items-center">
                <button
                  className="w-8 h-auto hover:opacity-80 active:scale-90 transition-all [&>svg]:w-8 [&>svg]:h-auto"
                   onClick={() => handleToggle("table")}
                  // onClick={openAddOrderModal}
                >
                  <BackIcon />
                </button>
                <h1 className="text-2xl font-semibold headerFontFamily">
                  Add Order
                </h1>
              </div>
            )}
            {selectedComponent === "table" && (
              <Button
                color="primary"
                size="sm"
                onPress={openAddOrderModal}
              >
                Create Order
              </Button>
            )}
          </div>
          {selectedComponent === "table" ? (
            <OrderTable clientId={clientId} />
          ) : (
            <AddOrderForm clientId={clientId} onRouteBack={handleRouteBack} />
          )}
        </div>
      ) : (
        <></>
      )}
      <AddOrderComponent
        isOpen={isAddOrderModalOpen}
        onClose={closeAddOrderModal}
        onOrderAdded={handleOrderAdded}
      />
    </Layout>
  );
};

export default page;
