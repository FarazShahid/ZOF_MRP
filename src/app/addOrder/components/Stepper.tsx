import React from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { FaBook } from "react-icons/fa6";

const Stepper = ({ orderSetps }: { orderSetps: number }) => {
  const StepItems = [
    {
      id: 1,
      title: "step 1",
      Name: "Order Information",
      icon: <FaBook size={20} />,
    },
    {
      id: 2,
      title: "step 2",
      Name: "Order Items",
      icon: <AiOutlineProduct size={20} />,
    },
  ];

  return (
    <div className="w-[15%] h-full flex items-center flex-col pt-12">
      {StepItems.map((step) => {
        return (
          <div className="w-full">
            <div
              className={` ${
                orderSetps + 1 >= step.id ? "bg-green-700" : "bg-gray-100"
              } px-2 py-2 w-full flex flex-col rounded-lg cursor-pointer`}
            >
              <div
                className={`flex items-center gap-5 ${
                  orderSetps + 1 >= step.id ? "text-white" : "text-black"
                }`}
              >
                {step.icon}
                <div className="flex flex-col">
                  <span className="text-xs hover:font-bold uppercase">
                    {step.title}
                  </span>
                  <span className="text-medium">{step.Name}</span>
                </div>
              </div>
            </div>
            {step.id === 1 ? (
              <div className="flex items-center justify-center w-full">
                <div className="h-14 w-[5px] bg-green-700"></div>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
