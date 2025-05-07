import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { FiPackage } from "react-icons/fi";
import { FaWarehouse } from "react-icons/fa";
import { FaHandHoldingMedical } from "react-icons/fa";
import WidgetSkeleton from "./WidgetSkeleton";
import Widget from "./Widget";

const WidgetData = [
  {
    icon: <AiFillProduct />,
    percentage: 20,
    title: "total product in inventroy",
    number: "10,226",
  },
  {
    icon: <FaHandHoldingMedical />,
    percentage: 10.5,
    title: "total qunatity in hand",
    number: "20,636",
  },
  {
    icon: <FaWarehouse />,
    percentage: 10,
    title: "total product to be reciveved",
    number: "5,680",
  },
  {
    icon: <FiPackage />,
    percentage: 26,
    title: "total be packed",
    number: "878",
  },
];

const DashboardCardWidgets = ({ loading }: { loading: boolean }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading ? (
        <>
          <WidgetSkeleton />
          <WidgetSkeleton />
          <WidgetSkeleton />
          <WidgetSkeleton />
        </>
      ) : (
        WidgetData.map((item, index) => {
          return (
            <Widget
              key={index}
              icon={item.icon}
              number={item.number}
              percentage={item.percentage}
              title={item.title}
            />
          );
        })
      )}
    </div>
  );
};

export default DashboardCardWidgets;
