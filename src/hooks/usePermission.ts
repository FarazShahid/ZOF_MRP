import usePermissionStore from "@/store/usePermissionStore";

const usePermission = (permission: number | number[]) => {
  const permissions = usePermissionStore((state) => state.permissions);
  return Array.isArray(permission)
    ? permission.some((id) => permissions.includes(id))
    : permissions.includes(permission);
};

export default usePermission;