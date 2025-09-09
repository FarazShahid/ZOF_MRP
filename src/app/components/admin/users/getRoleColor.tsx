export const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Manager":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "User":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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