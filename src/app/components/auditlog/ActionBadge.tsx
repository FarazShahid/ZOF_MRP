export const ActionBadge: React.FC<{ action: string }> = ({ action }) => {
  const getActionStyles = (action: string) => {
    switch (action) {
      case "Created":
        return "bg-green-100 text-green-800 border-green-200";
      case "Updated":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Deleted":
        return "bg-red-100 text-red-800 border-red-200";
      case "Status Changed":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Received":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionStyles(
        action
      )}`}
    >
      {action}
    </span>
  );
};