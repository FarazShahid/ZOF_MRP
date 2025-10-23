import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { FiPackage, FiShoppingCart, FiUsers } from "react-icons/fi";
import { RiAlertLine } from "react-icons/ri";
import Widget from "./Widget";

const KpiTiles: React.FC = () => {
  const data = [
    { icon: <FiShoppingCart />, title: "orders (range)", number: "1,248", percentage: 12.4 },
    { icon: <AiFillProduct />, title: "active products", number: "642", percentage: 5.2 },
    { icon: <FiPackage />, title: "shipments (range)", number: "318", percentage: 8.9 },
    { icon: <FiUsers />, title: "active clients", number: "92", percentage: 3.1 },
    { icon: <RiAlertLine />, title: "open events", number: "17", percentage: -6.0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {data.map((d, i) => (
        <Widget key={i} icon={d.icon} percentage={d.percentage} title={d.title} number={d.number} />
      ))}
    </div>
  );
};

export default KpiTiles;


