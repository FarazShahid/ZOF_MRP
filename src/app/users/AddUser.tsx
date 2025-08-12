import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Field, Formik, Form, ErrorMessage, FieldProps } from "formik";
import { UserSchema } from "../schema/SupplierSchema";
import useUserStore, { AddUserType } from "@/store/useUserStore";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

const AddUser: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  const [showPwd, setShowPwd] = useState(false);
  const { loading, getUserById, updateUser, addUser, userById } =
    useUserStore();

  useEffect(() => {
    if (Id && isEdit) {
      getUserById(Id);
    }
  }, [Id, isEdit]);

  const InitialValues = {
    Email: isEdit && userById ? userById.Email : "",
    Password: isEdit && userById ? userById.Password : "",
    isActive: isEdit && userById ? userById.isActive : true,
  };

  const handleAdd = async (values: AddUserType) => {
    isEdit
      ? updateUser(Id, values, () => {
          closeAddModal();
        })
      : addUser(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add</> : <> Edit</>} User
            </ModalHeader>
            <Formik
              validationSchema={UserSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAdd}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Email
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="Email"
                              type="text"
                              placeholder="Enter Email"
                              className="formInputdefault  border-1"
                            />
                            <ErrorMessage
                              name="Email"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Password
                            </label>

                            <div className="relative formInputdefault border-1">
                              <Field name="Password">
                                {({ field }: FieldProps) => (
                                  <input
                                    {...field}
                                    type={showPwd ? "text" : "password"}
                                    placeholder="Enter Password"
                                    className="pr-8 w-full h-full outline-none"
                                    autoComplete="new-password"
                                  />
                                )}
                              </Field>

                              <button
                                type="button"
                                onClick={() => setShowPwd((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                aria-label={
                                  showPwd ? "Hide password" : "Show password"
                                }
                                title={
                                  showPwd ? "Hide password" : "Show password"
                                }
                              >
                                {showPwd ? <FaRegEyeSlash /> : <FaRegEye />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
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
