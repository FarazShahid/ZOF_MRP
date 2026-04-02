export const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-300 dark:border-violet-500/30";
    case "Manager":
      return "bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/30";
    case "Operator":
      return "bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30";
    case "Viewer":
      return "bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30";
    case "User":
      return "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30";
    default:
      return "bg-gray-100 dark:bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30";
  }
};


 export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };


  export  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };