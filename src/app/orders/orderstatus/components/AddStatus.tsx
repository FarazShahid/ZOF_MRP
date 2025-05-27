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
import Label from "@/src/app/components/common/Label";
import { StatusSchema } from "@/src/app/schema";
import useOrderStatusStore, { AddOrUpdateOrderStatus } from "@/store/useOrderStatusStore";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

const AddStatus: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  
  
  const {getStatusById, addStatus, updateStatus, statusById,loading} = useOrderStatusStore();


  useEffect(() => {
    if (Id && isEdit) {
      getStatusById(Id);
    }
  }, [Id, isEdit]);


  const InitialValues = {
    Name: isEdit && statusById ? statusById.Name : "",
    Description: isEdit && statusById ? statusById.Description : "",
  };

  const handleAddSizeOption = async (values: AddOrUpdateOrderStatus) => {
    isEdit
      ? updateStatus(Id, values, () => {
          closeAddModal();
        })
      : addStatus(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? (
                <> Add</>
              ) : (
                <> Edit</>
              )} Status
            </ModalHeader>
            <Formik
              validationSchema={StatusSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddSizeOption}
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
                            <Label isRequired={true} label="Name" labelForm="Name" />
                            <Field
                              name="Name"
                              type="text"
                              placeholder="Enter Status Name"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="Name"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label isRequired={false} label="Name" labelForm="Name" />
                            <Field
                              name="Description"
                              as="textarea"
                              placeholder="Description"
                              className="formInputdefault"
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
                      {isEdit ? "Edit" : "Add"} Satus
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

export default AddStatus;
