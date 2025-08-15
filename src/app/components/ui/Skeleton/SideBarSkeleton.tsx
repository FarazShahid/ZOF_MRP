import Line from "./Line";

const SidebarSkeleton = () => (
  <div className="p-3 dark:bg-[#161616] bg-gray-100 rounded-2xl border-1 dark:border-slate-700 border-slate-300 shadow-lg">
    <Line w="w-32" />
    <div className="mt-4 space-y-2">
      <Line w="w-full" />
      <Line w="w-2/3" />
      <Line w="w-1/2" />
    </div>
  </div>
);


export default SidebarSkeleton;
