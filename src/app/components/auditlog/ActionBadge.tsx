export const ActionBadge: React.FC<{ action: string }> = ({ action }) => {
  const getActionStyles = (action: string) => {
    switch (action) {
      case "Created":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
      case "Updated":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "Deleted":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
      case "Status Changed":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "Shipped":
        return "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30";
      case "Received":
        return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getActionStyles(
        action
      )}`}
    >
      {action}
    </span>
  );
};