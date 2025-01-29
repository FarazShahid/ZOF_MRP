import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import React from "react";
import { useFetchClientById } from "../../services/useFetchClientById";
import { fetchWithAuth } from "../../services/authservice";
import { SchemaValidation } from "../../schema/ClientSchema";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  clientId: number;
  closeAddModal: () => void;
  onOrderAdded: () => void;
}

const AddProduct: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  onOrderAdded,
  isEdit,
  clientId,
}) => {
  interface AddClientType {
    Name: string;
    Email: string;
    Phone: string;
    Country: string;
    State: string;
    City: string;
    CompleteAddress: string;
    ClientStatusId: string;
  }

  const { clientbyId, isLoading } = useFetchClientById({ clientId });

  const InitialValues = {
    Name: isEdit && clientbyId ? clientbyId.Name : "",
    Email: isEdit && clientbyId ? clientbyId?.Email : "",
    Phone: isEdit && clientbyId ? clientbyId?.Phone : "",
    Country: isEdit && clientbyId ? clientbyId?.Country : "",
    State: isEdit && clientbyId ? clientbyId?.State : "",
    City: isEdit && clientbyId ? clientbyId?.City : "",
    CompleteAddress: isEdit && clientbyId ? clientbyId?.CompleteAddress : "",
    ClientStatusId: isEdit && clientbyId ? clientbyId?.ClientStatusId : "",
  };
  const handleAddClient = async (values: AddClientType) => {
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/clients`;
    const method = isEdit ? "PATCH" : "POST";

    try {
      const response = await fetchWithAuth(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        console.log("Error creating order");
        throw new Error("Failed to create order");
      }
      const result = await response.json();
      closeAddModal();
      onOrderAdded();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Product</> : <> Edit Product</>}
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
                    {isLoading ? (
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
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Product Category
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              as="select"
                              name="productCatagory"
                              className="formInputdefault"
                            >
                              <option value={""}>Select</option>
                              <option value={1}>T-shirt</option>
                            </Field>
                            <ErrorMessage
                              name="Email"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Fabric Type
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              type="text"
                              name="Phone"
                              placeholder="Enter Phone"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="Phone"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-600 font-sans">
                            Description
                            <span className="text-red-500 text-sm">*</span>
                          </label>
                          <Field
                            as="textarea"
                            name="CompleteAddress"
                            className="formInputdefault !h-auto"
                            rows={4}
                            placeholder="Enter Adress"
                          />
                          <ErrorMessage
                            name="CompleteAddress"
                            component="div"
                            className="text-red-400 text-sm"
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
                      {isEdit ? "Edit" : "Add"} Product
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

export default AddProduct;
