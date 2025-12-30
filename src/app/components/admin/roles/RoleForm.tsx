"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Spinner,
} from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import useRoleRightsStore, { AddRoleType } from "@/store/useRoleRightsStore";
import { PERMISSIONS_ENUM } from "@/src/types/rightids";

/**
 * Reusable Modal for both Add & Edit Role.
 * - Pass `roleId` for edit; omit for add.
 * - Control visibility with `isOpen` / `onClose`.
 */
type RoleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roleId?: number;
};

const RoleFormModal: React.FC<RoleFormModalProps> = ({ isOpen, onClose, roleId }) => {
  const [selectedRights, setSelectedRights] = useState<number[]>([]);
  const [roleName, setRoleName] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const {
    fetchAssingedRights,
    updateRole,
    addRole,
    getRoleById,
    roleById,
    assingedRights,
  } = useRoleRightsStore();

  const isEdit = !!roleId;

  // Dependencies: selecting key permissions should also select their prerequisites
  const DEPENDENCIES: Record<number, number[]> = {
    // Products
    [PERMISSIONS_ENUM.PRODUCTS.VIEW]: [
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW,
    ],
    [PERMISSIONS_ENUM.PRODUCTS.ADD]: [
      PERMISSIONS_ENUM.PRODUCTS.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW,
    ],
    [PERMISSIONS_ENUM.PRODUCTS.UPDATE]: [
      PERMISSIONS_ENUM.PRODUCTS.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW,
    ],

    // Orders
    [PERMISSIONS_ENUM.ORDER.VIEW]: [
      PERMISSIONS_ENUM.PRODUCTS.VIEW,
      PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.EVENTS.VIEW,
    ],
    [PERMISSIONS_ENUM.ORDER.ADD]: [
      PERMISSIONS_ENUM.ORDER.VIEW,
      PERMISSIONS_ENUM.PRODUCTS.VIEW,
      PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.EVENTS.VIEW,
    ],
    [PERMISSIONS_ENUM.ORDER.UPDATE]: [
      PERMISSIONS_ENUM.ORDER.VIEW,
      PERMISSIONS_ENUM.PRODUCTS.VIEW,
      PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.EVENTS.VIEW,
    ],

    // Shipment
    [PERMISSIONS_ENUM.SHIPMENT.VIEW]: [
      PERMISSIONS_ENUM.ORDER.VIEW,
      PERMISSIONS_ENUM.CARRIERS.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
    ],
    [PERMISSIONS_ENUM.SHIPMENT.ADD]: [
      PERMISSIONS_ENUM.SHIPMENT.VIEW,
      PERMISSIONS_ENUM.ORDER.VIEW,
      PERMISSIONS_ENUM.CARRIERS.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
    ],
    [PERMISSIONS_ENUM.SHIPMENT.UPDATE]: [
      PERMISSIONS_ENUM.SHIPMENT.VIEW,
      PERMISSIONS_ENUM.ORDER.VIEW,
      PERMISSIONS_ENUM.CARRIERS.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
    ],

    // Inventory Items
    [PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW]: [
      PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW,
      PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
      PERMISSIONS_ENUM.SUPPLIERS.VIEW,
    ],
    [PERMISSIONS_ENUM.INVENTORY_ITEMS.ADD]: [
      PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW,
      PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW,
      PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
      PERMISSIONS_ENUM.SUPPLIERS.VIEW,
    ],
    [PERMISSIONS_ENUM.INVENTORY_ITEMS.UPDATE]: [
      PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW,
      PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW,
      PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
      PERMISSIONS_ENUM.SUPPLIERS.VIEW,
    ],

    [PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW]: [
      PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.VIEW,
      PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW,
      PERMISSIONS_ENUM.SUPPLIERS.VIEW,
    ],

    // Inventory Sub Category depends on Inventory Category
    [PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.VIEW]: [
      PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW,
    ],

    // Inventory Transactions
    [PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.VIEW]: [
      PERMISSIONS_ENUM.ORDER.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.SUPPLIERS.VIEW,
      PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW,
      // Flattened dependencies of inventory items to avoid recursion
      PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW,
      PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
    ],
    [PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.ADD]: [
      PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.VIEW,
      PERMISSIONS_ENUM.ORDER.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.SUPPLIERS.VIEW,
      PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW,
      PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW,
      PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
    ],
    [PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.UPDATE]: [
      PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.VIEW,
      PERMISSIONS_ENUM.ORDER.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.SUPPLIERS.VIEW,
      PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW,
      PERMISSIONS_ENUM.INVENTORY_CATEGORY.VIEW,
      PERMISSIONS_ENUM.INVENTORY_SUB_CATEGORY.VIEW,
      PERMISSIONS_ENUM.UNIT_OF_MEASURE.VIEW,
    ],

    // Users
    [PERMISSIONS_ENUM.USERS.VIEW]: [
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.ROLES_AND_RIGHTS.VIEW,
    ],
    [PERMISSIONS_ENUM.USERS.ADD]: [
      PERMISSIONS_ENUM.USERS.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.ROLES_AND_RIGHTS.VIEW,
    ],
    [PERMISSIONS_ENUM.USERS.UPDATE]: [
      PERMISSIONS_ENUM.USERS.VIEW,
      PERMISSIONS_ENUM.CLIENTS.VIEW,
      PERMISSIONS_ENUM.ROLES_AND_RIGHTS.VIEW,
    ],
  };

  // Fetch base data
  useEffect(() => {
    fetchAssingedRights();
  }, [fetchAssingedRights]);

  // Load role if editing
  useEffect(() => {
    if (isEdit) getRoleById(roleId!);
  }, [isEdit, roleId, getRoleById]);

  // Hydrate state when roleById arrives (edit)
  useEffect(() => {
    if (isEdit && roleById) {
      setRoleName(roleById.name || "");
      setSelectedRights(roleById.rightIds || []);
    }
  }, [isEdit, roleById]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRoleName("");
      setSelectedRights([]);
      setBusy(false);
    }
  }, [isOpen]);

  const groupAllChecked = useMemo(() => {
    // For quick lookup
    const set = new Set(selectedRights);
    return (ids: number[]) => ids.every((id) => set.has(id));
  }, [selectedRights]);

  // Map DELETE -> its corresponding VIEW id
  const getViewForDelete = (id: number): number | undefined => {
    const groups = Object.values(PERMISSIONS_ENUM) as Array<Record<string, number>>;
    for (const group of groups) {
      if (group && typeof group === "object" && group.DELETE === id && typeof group.VIEW === "number") {
        return group.VIEW;
      }
    }
    return undefined;
  };

  // Expand dependencies for any selected id(s), including:
  // - direct DEPENDENCIES[id]
  // - if id is a DELETE, include its VIEW and that VIEW's dependencies
  // - recursively expand dependencies of dependencies
  const expandDependencies = (baseIds: number[]): number[] => {
    const result = new Set<number>();
    const queue: number[] = [];

    const enqueueDeps = (sourceId: number) => {
      const direct = DEPENDENCIES[sourceId] || [];
      for (const d of direct) {
        if (!result.has(d)) {
          result.add(d);
          queue.push(d);
        }
      }
    };

    for (const id of baseIds) {
      // If it's a DELETE, add its VIEW and expand its deps too
      const viewId = getViewForDelete(id);
      if (typeof viewId === "number") {
        if (!result.has(viewId)) {
          result.add(viewId);
          queue.push(viewId);
        }
      }

      // Add direct deps of the id
      enqueueDeps(id);
    }

    // BFS expand transitive dependencies
    while (queue.length > 0) {
      const current = queue.shift()!;
      enqueueDeps(current);
    }

    return Array.from(result);
  };

  const toggleRight = (id: number) => {
    setSelectedRights((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        // Only remove the clicked permission; keep any dependents user may still want
        return prev.filter((x) => x !== id);
      }
      const toAdd = [id, ...expandDependencies([id])];
      return [...new Set([...prev, ...toAdd])];
    });
  };

  const toggleGroup = (ids: number[]) => {
    const allSelected = groupAllChecked(ids);
    setSelectedRights((prev) => {
      if (allSelected) {
        return prev.filter((id) => !ids.includes(id));
      }
      const next = new Set(prev);
      ids.forEach((id) => {
        next.add(id);
        expandDependencies([id]).forEach((depId) => next.add(depId));
      });
      return Array.from(next);
    });
  };

  const save = async () => {
    if (!roleName.trim()) {
      toast.error("Role name is required.");
      return;
    }
    if (selectedRights.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }

    const payload: AddRoleType = {
      name: roleName.trim(),
      rightIds: [...selectedRights],
    };

    try {
      setBusy(true);
      if (isEdit) {
        await updateRole(roleId!, payload, () => onClose());
      } else {
        await addRole(payload, () => onClose());
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] sm:max-h-[92vh]",
        header: "border-b border-content3/20",
        footer: "border-t border-content3/20",
      }}
      // Fullscreen on very small screens:
      isDismissable={!busy}
      hideCloseButton={busy}
      backdrop="opaque"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            {isEdit ? "Edit Role" : "Add Role"}
          </ModalHeader>

          <ModalBody>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <label className="text-sm font-medium min-w-[65px] text-foreground-600">
                  Name <span className="text-danger">*</span>
                </label>
                <Input
                  size="md"
                  radius="md"
                  variant="bordered"
                  placeholder="Enter Role Name"
                  value={roleName}
                  isDisabled={busy}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="sm:flex-1"
                />
              </div>

              {/* Permissions */}
              <div className="rounded-xl border border-default-200 p-4">
                <h4 className="text-sm font-semibold mb-3">Permissions</h4>

                {/* Responsive grid: 1 / 2 / 3 cols */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {assingedRights?.map((group, idx) => {
                    const ids = group.permissions.map((p: { id: number }) => p.id);
                    const groupChecked = groupAllChecked(ids);

                    return (
                      <div
                        key={`${group?.group}-${idx}`}
                        className="rounded-lg border border-default-200 p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{group?.group}</div>
                          <Checkbox
                            isSelected={groupChecked}
                            onValueChange={() => toggleGroup(ids)}
                            isDisabled={busy}
                          >
                            All
                          </Checkbox>
                        </div>

                        <div className="mt-2">
                          <CheckboxGroup
                            // purely visual; we still toggle manually for fine control
                            value={selectedRights
                              .filter((id) => ids.includes(id))
                              .map(String)}
                          >
                            <div className="flex flex-col gap-2">
                              {group.permissions.map(
                                (
                                  permission: { id: number; name: string },
                                  pIdx: number
                                ) => {
                                  const checked = selectedRights.includes(permission.id);
                                  return (
                                    <Checkbox
                                      key={`${permission.id}-${pIdx}`}
                                      value={String(permission.id)}
                                      isSelected={checked}
                                      onValueChange={() => toggleRight(permission.id)}
                                      isDisabled={busy}
                                    >
                                      <span className="text-sm">{permission.name}</span>
                                    </Checkbox>
                                  );
                                }
                              )}
                            </div>
                          </CheckboxGroup>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="sticky bottom-0 bg-background">
            <Button variant="flat" onPress={onClose} isDisabled={busy}>
              Cancel
            </Button>
            <Button
              color="primary"
              startContent={!busy ? <FiPlus /> : <Spinner size="sm" />}
              onPress={save}
              isDisabled={busy}
            >
              {isEdit ? "Update Role" : "Save Role"}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default RoleFormModal;
