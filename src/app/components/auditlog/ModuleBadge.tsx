export const ModuleBadge: React.FC<{ module: string }> = ({ module }) => {
  const getModuleStyles = (module: string) => {
    switch (module) {
      case "Products":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Orders":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Inventory":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Shipments":
        return "bg-violet-50 text-violet-700 border-violet-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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