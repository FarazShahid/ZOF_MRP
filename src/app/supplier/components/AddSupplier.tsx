import { useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { SupplierSchema } from "../../schema/SupplierSchema";
import useSupplierStore, { AddSupplierOptions } from "@/store/useSupplierStore";
import Label from "../../components/common/Label";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  supplierId: number;
  closeAddModal: () => void;
}

const AddSupplier: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  supplierId,
}) => {
  const {
    loading,
    supplierById,
    getSupplierById,
    updateSupplier,
    addSupplier,
  } = useSupplierStore();

  useEffect(() => {
    if (supplierId && isEdit) {
      getSupplierById(supplierId);
    }
  }, [supplierId, isEdit]);

  const InitialValues = {
    Name: isEdit && supplierById ? supplierById.Name : "",
    Phone: isEdit && supplierById ? supplierById?.Phone : "",
    Country: isEdit && supplierById ? supplierById?.Country : "",
    Email: isEdit && supplierById ? supplierById?.Email : "",
    State: isEdit && supplierById ? supplierById?.State : "",
    City: isEdit && supplierById ? supplierById?.City : "",
    CompleteAddress:
      isEdit && supplierById ? supplierById?.CompleteAddress : "",
  };

  const handleAdd = async (values: AddSupplierOptions) => {
    isEdit
      ? updateSupplier(supplierId, values, () => {
          closeAddModal();
        })
      : addSupplier(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="2xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Supplier</> : <> Edit Supplier</>}
            </ModalHeader>
            <Formik
              validationSchema={SupplierSchema}
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
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true} label="Name" />
                            <Field
                              name="Name"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Name"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="Name"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="Phone" />
                            <Field
                              name="Phone"
                              type="text"
                              // inputMode="numeric"
                              // pattern="[0-9]*"
                              maxLength={100}
                              placeholder="Enter Phone No."
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="Phone"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={true} label="Email" />
                            <Field
                              name="Email"
                              type="email"
                              maxLength={100}
                              placeholder="Enter Email"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="Email"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="Country" />
                            <Field
                              name="Country"
                              type="text"
                              maxLength={100}
                              placeholder="Enter Country"
                              className="formInputdefault border-1"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="State" />
                            <Field
                              name="State"
                              type="text"
                              maxLength={100}
                              placeholder="Enter State"
                              className="formInputdefault border-1"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="City" />
                            <Field
                              name="City"
                              type="text"
                              maxLength={100}
                              placeholder="Enter City"
                              className="formInputdefault border-1"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <Label isRequired={false} label="Address" />
                          <Field
                            name="CompleteAddress"
                            as="textarea"
                            placeholder="Enter Address"
                            className="formInputdefault border-1"
                          />
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

export default AddSupplier;
