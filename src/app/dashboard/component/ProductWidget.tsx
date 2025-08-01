import Image from "next/image";
import TMock1 from "../../../../public/mockUps/tshirt1.png";
import TMock2 from "../../../../public/mockUps/tshirt2.png";
import HMock1 from "../../../../public/mockUps/hoodie.png";
import { MdCategory } from "react-icons/md";
import { TbNeedleThread } from "react-icons/tb";
import ProductSkeleton from "./ProductSkeleton";
import ViewMoreButton from "./ViewMoreButton";

const products = [
  {
    id: 1,
    name: "AT Jersey",
    type: "Tshirt",
    FabricType: "Scuba300_Woven_300",
    img: TMock1,
    color: "white",
  },
  {
    id: 2,
    name: "AT Jersey",
    type: "Tshirt",
    FabricType: "Scuba300_Woven_300",
    img: TMock2,
    color: "green",
  },
  {
    id: 4,
    name: "Hoodie",
    type: "Hoodie",
    FabricType: "Scuba300_Woven_300",
    img: HMock1,
    color: "green",
  },
];

const ProductWidget = ({ loading }: { loading: boolean }) => {
  return (
    <div className=" border border-gray-200 bg-white p-3 dark:border-[#1d2939] dark:bg-white/[0.03] shadow-md space-y-3 rounded-2xl">
      <div className="flex items-center justify-between">
        <span className="dark:text-white text-gray-800">Top products</span>
        <ViewMoreButton path="/product" />
      </div>
      <div className="space-y-2 h-[290px] overflow-x-auto px-2">
        {loading ? (
          <div className="flex flex-col gap-2">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : (
          products.map((item) => {
            return (
              <div
                className=" bg-gray-100 dark:bg-[#353535] w-full rounded-2xl p-2 flex items-center gap-4"
                key={item.id}
              >
                <Image
                  alt="product"
                  src={item.img}
                  className="w-16 h-16 rounded border-1 dark:border-gray-700 border-gray-300"
                />
                <div className="flex flex-col gap-1">
                  <h6 className="dark:text-white text-gray-800 text-lg">{item.name}</h6>
                  <div className="flex items-center gap-4">
                    <div
                      className="rounded h-5 w-10"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MdCategory size={14} />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <TbNeedleThread size={14} />
                      <span className="text-sm">{item.FabricType}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductWidget;
