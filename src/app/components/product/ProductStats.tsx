import React from "react";
import { Package, CheckCircle, FlaskConical, Archive, XCircle } from "lucide-react";
import { Product } from "@/store/useProductStore";

interface Props {
  products: Product[];
}

const ProductStats: React.FC<Props> = ({ products }) => {
  const approved = products.filter(p => (p.productStatus || "").toLowerCase() === "approved").length;
  const sample = products.filter(p => (p.productStatus || "").toLowerCase() === "sample").length;
  const emptyStatus = products.filter(p => !p.productStatus).length;
  const archived = products.filter(p => p.isArchived).length;

  const cards = [
    { title: "Total Products", value: products.length, icon: Package, bg: "bg-slate-500" },
    { title: "Approved", value: approved, icon: CheckCircle, bg: "bg-green-600" },
    { title: "Samples", value: sample, icon: FlaskConical, bg: "bg-blue-600" },
    { title: "No Status", value: emptyStatus, icon: XCircle, bg: "bg-yellow-600" },
    { title: "Archived", value: archived, icon: Archive, bg: "bg-red-600" },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(card => (
          <div key={card.title} className={`${card.bg} text-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className="bg-white/15 p-3 rounded-lg">
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductStats;
