const Line = ({ w = "w-24" }: { w?: string }) => (
  <div className={`h-3 ${w} bg-gray-300/60 dark:bg-gray-700/60 rounded animate-pulse`} />
);

export default Line;