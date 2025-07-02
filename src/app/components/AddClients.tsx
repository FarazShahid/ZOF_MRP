import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useEffect } from "react";
import { SchemaValidation } from "../schema/ClientSchema";
import Spinner from "./Spinner";
import useClientStore, { AddClientType } from "@/store/useClientStore";
import Label from "./common/Label";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  clientId: number;
  closeAddModal: () => void;
  onOrderAdded: () => void;
}

const AddClients: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  onOrderAdded,
  isEdit,
  clientId,
}) => {
  const { getClientById, addClient, updateClient, loading, clientById } =
    useClientStore();

  const InitialValues = {
    Name: isEdit && clientById ? clientById?.Name : "",
    Email: isEdit && clientById ? clientById?.Email : "",
    Phone: isEdit && clientById ? clientById?.Phone : "",
    Country: isEdit && clientById ? clientById?.Country : "",
    State: isEdit && clientById ? clientById?.State : "",
    City: isEdit && clientById ? clientById?.City : "",
    CompleteAddress: isEdit && clientById ? clientById?.CompleteAddress : "",
    ClientStatusId: isEdit && clientById ? clientById?.ClientStatusId : "",
  };

  const handleAddClient = async (values: AddClientType) => {
    isEdit
      ? updateClient(clientId, values, () => {
          closeAddModal();
        })
      : addClient(values, () => {
          closeAddModal();
        });
  };

  useEffect(() => {
    if (clientId) {
      getClientById(clientId);
    }
  }, [isEdit, clientId]);

  return (
    <Modal isOpen={isOpen} size="2xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Client</> : <> Edit Client</>}
            </ModalHeader>
            <Formik
              validationSchema={SchemaValidation}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddClient}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1 w-full">
                              <Label
                                label="Business Name"
                                labelForm="Business Name"
                                isRequired={true}
                              />
                              <Field
                                name="Name"
                                type="text"
                                placeholder="Enter Business Name"
                                className="formInputdefault border-1"
                              />
                              <ErrorMessage
                                name="Name"
                                component="div"
                                className="text-red-400 text-sm"
                              />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                              <Label
                                label="Business Email"
                                labelForm="Business Email"
                                isRequired={true}
                              />
                              <Field
                                type="text"
                                name="Email"
                                placeholder="Enter Business Email"
                                className="formInputdefault border-1"
                              />
                              <ErrorMessage
                                name="Email"
                                component="div"
                                className="text-red-400 text-sm"
                              />
                            </div>
                          </div>
                          <p>POC: (Person Of Contact):</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1 w-full">
                              <Label
                                label="Name"
                                labelForm="Name"
                                isRequired={true}
                              />
                              <Field
                                type="text"
                                name="POCName"
                                placeholder="Enter Name"
                                className="formInputdefault border-1"
                              />
                              <ErrorMessage
                                name="POCName"
                                component="div"
                                className="text-red-400 text-sm"
                              />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                              <Label
                                label="Phone Number"
                                labelForm="Phone Number"
                                isRequired={true}
                              />
                              <Field
                                type="text"
                                name="Phone"
                                placeholder="Enter Phone"
                                className="formInputdefault border-1"
                              />
                              <ErrorMessage
                                name="Phone"
                                component="div"
                                className="text-red-400 text-sm"
                              />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                              <Label
                                label="Email"
                                labelForm="Email"
                                isRequired={true}
                              />
                              <Field
                                type="text"
                                name="POCEmail"
                                placeholder="Enter Email"
                                className="formInputdefault border-1"
                              />
                              <ErrorMessage
                                name="POCEmail"
                                component="div"
                                className="text-red-400 text-sm"
                              />
                            </div>
                          </div>
                          <p>Business URLs:</p>
                          {/* <div className="flex flex-col gap-1 w-full">
                            <Label
                              label="Country"
                              labelForm="Country"
                              isRequired={true}
                            />
                            <Field
                              type="text"
                              name="Country"
                              placeholder="Enter Country"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="Country"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              label="State"
                              labelForm="State"
                              isRequired={true}
                            />
                            <Field
                              type="text"
                              name="State"
                              placeholder="Enter State"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="State"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              label="City"
                              labelForm="City"
                              isRequired={true}
                            />
                            <Field
                              type="text"
                              name="City"
                              placeholder="Enter City"
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="City"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div> */}
                        </div>
                        {/* <div className="flex flex-col gap-1">
                          <Label
                            label="Address"
                            labelForm="Address"
                            isRequired={true}
                          />
                          <Field
                            as="textarea"
                            name="CompleteAddress"
                            className="formInputdefault !h-auto border-1"
                            rows={4}
                            placeholder="Enter Adress"
                          />
                          <ErrorMessage
                            name="CompleteAddress"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div> */}
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
                      {isEdit ? "Edit" : "Add"} Client
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

export default AddClients;
