"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { Field, Formik, Form, ErrorMessage, FieldProps } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

import Label from "../../common/Label";
import { UserSchema } from "../../../schema/SupplierSchema";
import useUserStore, { AddUserType } from "@/store/useUserStore";
import useRoleRightsStore from "@/store/useRoleRightsStore";
import useClientStore from "@/store/useClientStore";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

type FormValues = {
  firstName: string;
  lastName: string;
  Email: string;
  Password: string;
  roleId: number | "";
  isActive: boolean;
  assignedClients: { clientId: number }[];
};

const AddUser: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  const [showPwd, setShowPwd] = useState(false);

  const { loading, getUserById, updateUser, addUser, userById } =
    useUserStore();
  const { fetchRoles, loading: loadingRoles, roles } = useRoleRightsStore();
  const { fetchClients, loading: loadingClients, clients } = useClientStore();

  // Local UI state to mirror your "size" multi-select example
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  // Fetch lookups and (if editing) fetch the user
  useEffect(() => {
    if (!isOpen) return;
    fetchRoles();
    fetchClients();
  }, [isOpen, fetchRoles, fetchClients]);

  useEffect(() => {
    if (isOpen && isEdit && Id) {
      getUserById(Id);
    }
  }, [isOpen, isEdit, Id, getUserById]);

  // Initialize local selected keys for clients when editing
  useEffect(() => {
    if (isEdit && userById?.assignedClients?.length) {
      setSelectedClientIds(
        userById.assignedClients.map((c: { clientId: number }) =>
          String(c.clientId)
        )
      );
    } else if (!isEdit) {
      setSelectedClientIds([]);
    }
  }, [isEdit, userById]);

  const initialValues: FormValues = useMemo(
    () => ({
      firstName: isEdit && userById ? userById.firstName ?? "" : "",
      lastName: isEdit && userById ? userById.lastName ?? "" : "",
      Email: isEdit && userById ? userById.Email ?? "" : "",
      Password: isEdit && userById ? userById.Password ?? "" : "",
      roleId: isEdit && userById ? Number(userById.roleId) : "",
      isActive: isEdit && userById ? Boolean(userById.isActive) : true,
      assignedClients:
        isEdit && userById
          ? (userById.assignedClients ?? []).map((x: { clientId: number }) => ({
              clientId: Number(x.clientId),
            }))
          : [],
    }),
    [isEdit, userById]
  );

  const onSubmit = async (values: FormValues) => {
    const payload: AddUserType = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      Email: values.Email.trim(),
      Password: values.Password,
      roleId:
        typeof values.roleId === "string"
          ? Number(values.roleId)
          : values.roleId,
      isActive: values.isActive,
      assignedClients: values.assignedClients.map((c) => ({
        clientId: Number(c.clientId),
      })),
    };

    try {
      if (isEdit) {
        await updateUser(Id, payload, () => {
          closeAddModal();
        });
      } else {
        await addUser(payload, () => {
          closeAddModal();
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving the user.");
    }
  };

  const handleClientChange = (
    keys: Set<React.Key> | "all",
    setFieldValue: (field: string, value: any) => void
  ) => {
    let ids: string[] = [];

    if (keys === "all") {
      ids = (clients ?? []).map((c: any) => String(c.id));
    } else {
      ids = Array.from(keys).map(String);
    }

    setSelectedClientIds(ids);

    setFieldValue(
      "assignedClients",
      ids.map((id) => ({
        clientId: Number(id),
      }))
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      size="3xl"
      onOpenChange={closeAddModal}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "Edit" : "Add"} User
            </ModalHeader>

            <Formik<FormValues>
              validationSchema={UserSchema}
              initialValues={initialValues}
              enableReinitialize
              onSubmit={onSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <div className="flex items-center justify-center py-14">
                        <Spinner />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div className="flex flex-col gap-1 w-full">
                          <Label isRequired label="First Name" />
                          <Field name="firstName">
                            {({ field }: FieldProps) => (
                              <Input
                                {...field}
                                variant="bordered"
                                radius="md"
                                placeholder="Enter first name"
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col gap-1 w-full">
                          <Label isRequired label="Last Name" />
                          <Field name="lastName">
                            {({ field }: FieldProps) => (
                              <Input
                                {...field}
                                variant="bordered"
                                radius="md"
                                placeholder="Enter last name"
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1 w-full">
                          <Label isRequired label="Email" />
                          <Field name="Email">
                            {({ field }: FieldProps) => (
                              <Input
                                {...field}
                                type="email"
                                variant="bordered"
                                radius="md"
                                placeholder="Enter email"
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="Email"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div>

                        {/* Password (required in edit & add) */}
                        <div className="flex flex-col gap-1 w-full">
                          <Label isRequired label="Password" />
                          <div className="relative">
                            <Field name="Password">
                              {({ field }: FieldProps) => (
                                <Input
                                  {...field}
                                  type={showPwd ? "text" : "password"}
                                  variant="bordered"
                                  radius="md"
                                  placeholder="Enter password"
                                  endContent={
                                    <button
                                      type="button"
                                      onClick={() => setShowPwd((s) => !s)}
                                      className="text-default-500 hover:text-default-700"
                                      aria-label={
                                        showPwd
                                          ? "Hide password"
                                          : "Show password"
                                      }
                                      title={
                                        showPwd
                                          ? "Hide password"
                                          : "Show password"
                                      }
                                    >
                                      {showPwd ? (
                                        <FaRegEyeSlash />
                                      ) : (
                                        <FaRegEye />
                                      )}
                                    </button>
                                  }
                                />
                              )}
                            </Field>
                          </div>
                          <ErrorMessage
                            name="Password"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div>

                        {/* Role (single select) */}
                        <div className="flex flex-col gap-1 w-full">
                          <Label isRequired label="Role" />
                          {loadingRoles ? (
                            <div className="h-10 rounded-md border border-default-200 px-3 flex items-center">
                              Loading roles…
                            </div>
                          ) : (
                            <Select
                              aria-label="Select role"
                              variant="bordered"
                              radius="md"
                              placeholder="Select role"
                              selectedKeys={
                                values.roleId
                                  ? new Set([String(values.roleId)])
                                  : new Set([])
                              }
                              onSelectionChange={(keys) => {
                                if (keys === "all") return;
                                const id = Array.from(
                                  keys as Set<React.Key>
                                )[0];
                                setFieldValue("roleId", id ? Number(id) : "");
                              }}
                              className="w-full"
                            >
                              {(roles ?? []).map((r: any) => (
                                <SelectItem
                                  key={String(r.id)}
                                  value={String(r.id)}
                                >
                                  {r.name}
                                </SelectItem>
                              ))}
                            </Select>
                          )}
                          <ErrorMessage
                            name="roleId"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div>

                        {/* Is Active */}
                        <div className="flex flex-col gap-1 w-full">
                          <Label isRequired={true} label="Status" />
                          <Switch
                            isSelected={values.isActive}
                            onValueChange={(v) => setFieldValue("isActive", v)}
                          >
                            {values.isActive ? "Active" : "Inactive"}
                          </Switch>
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1 w-full">
                          <Label isRequired label="Clients" />
                          {loadingClients ? (
                            <div className="h-10 rounded-md border border-default-200 px-3 flex items-center">
                              Loading clients…
                            </div>
                          ) : (
                            <Select
                              className="rounded-xl text-gray-400 text-sm w-full outline-none dark:bg-slate-800 bg-gray-100"
                              classNames={{
                                helperWrapper:
                                  "!dark:bg-slate-800 !bg-gray-100",
                              }}
                              name="assignedClients"
                              placeholder="Select Clients"
                              variant="bordered"
                              isRequired
                              selectionMode="multiple"
                              aria-label="Clients"
                              selectedKeys={new Set(selectedClientIds)}
                              onSelectionChange={(keys) =>
                                handleClientChange(keys, setFieldValue)
                              }
                            >
                              {clients.map((client) => {
                                return (
                                  <SelectItem key={client.Id}>
                                    {client.Name}
                                  </SelectItem>
                                );
                              })}
                            </Select>
                          )}
                          <ErrorMessage
                            name="assignedClients"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={closeAddModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      color="primary"
                      type="submit"
                    >
                      {isEdit ? "Update" : "Save"}
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddUser;
