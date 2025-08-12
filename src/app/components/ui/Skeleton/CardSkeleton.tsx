import Line from "./Line";

const CardSkeleton = () => (
  <div className="dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 p-4 shadow-lg">
    <div className="flex items-center gap-10">
      <Line w="w-28" />
      <Line w="w-20" />
      <Line w="w-40" />
    </div>
    <div className="mt-4 grid grid-cols-3 gap-8">
      <Line w="w-32" />
      <Line w="w-20" />
      <Line w="w-16" />
    </div>
  </div>
);

export default CardSkeleton;