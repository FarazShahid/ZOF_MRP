export const ModuleBadge: React.FC<{ module: string }> = ({ module }) => {
  const getModuleStyles = (module: string) => {
    switch (module) {
      case "Products":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30";
      case "Orders":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
      case "Inventory":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "Shipments":
        return "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30";
      case "Users":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "Carriers":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getModuleStyles(
        module
      )}`}
    >
      {module}
    </span>
  );
};