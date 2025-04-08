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


  const {loading,supplierById ,getSupplierById, updateSupplier, addSupplier} = useSupplierStore();

  useEffect(() => {
    if (supplierId && isEdit) {
        getSupplierById(supplierId);
    }
  }, [supplierId, isEdit]);

  const InitialValues = {
    Name: isEdit && supplierById ? supplierById.Name : "",
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
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
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
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Name
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="Name"
                              type="text"
                              placeholder="Enter Name"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="Name"
                              component="div"
                              className="text-red-400 text-sm"
                            />
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

export default AddSupplier;
