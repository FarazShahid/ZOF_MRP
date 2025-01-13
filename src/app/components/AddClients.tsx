import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Field, Formik } from "formik";
import React from "react";
import { SchemaValidation } from "../schema/ClientSchema";
import { fetchWithAuth } from "../services/authservice";

interface AddClientComponentProps {
  isOpen: boolean;
  refreshKey: number;
  closeAddModal: () => void;
  onOrderAdded: () => void;
}

const AddClients: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  refreshKey,
  onOrderAdded,
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

  const InitialValues = {
    Name: "",
    Email: "",
    Phone: "",
    Country: "",
    State: "",
    City: "",
    CompleteAddress: "",
    ClientStatusId: "",
  };
  const handleAddClient = async (values: AddClientType) => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/clients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        console.log("Error creating order");
        throw new Error("Failed to create order");
      }
      const result = await response.json();
      closeAddModal();
    //   onOrderAdded();
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
              Add Client
            </ModalHeader>
            <Formik
              validationSchema={SchemaValidation}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddClient}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  <ModalBody>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm text-gray-600 font-sans">
                          Name <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          name="Name"
                          type="text"
                          placeholder="Enter Name"
                          className="formInputdefault"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm text-gray-600 font-sans">
                          Email <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          type="text"
                          name="Email"
                          placeholder="Enter Email"
                          className="formInputdefault"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm text-gray-600 font-sans">
                          Phone Number
                          <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          type="text"
                          name="Phone"
                          placeholder="Enter Phone"
                          className="formInputdefault"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm text-gray-600 font-sans">
                          Country
                          <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          as="select"
                          name="Country"
                          className="formInputdefault"
                        >
                          <option>Select Country</option>
                          <option value={"USA"}>USA</option>
                          <option value={"Pakistan"}>Pakistan</option>
                          <option value={"UK"}>UK</option>
                        </Field>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm text-gray-600 font-sans">
                          State <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          as="select"
                          name="State"
                          className="formInputdefault"
                        >
                          <option>Select State</option>
                          <option value={"Alabama"}>Alabama</option>
                          <option value={" Alaska"}> Alaska</option>
                          <option value={" Arizona"}> Arizona</option>
                          <option value={"  California"}> California</option>
                        </Field>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm text-gray-600 font-sans">
                          City <span className="text-red-500 text-sm">*</span>
                        </label>
                        <Field
                          as="select"
                          name="City"
                          className="formInputdefault"
                        >
                          <option>Select City</option>
                          <option value={"Huntsville"}>Huntsville</option>
                          <option value={"Birmingham"}>Birmingham</option>
                          <option value={"Montgomery"}>Montgomery</option>
                          <option value={"Tuscaloosa"}>Tuscaloosa</option>
                        </Field>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-600 font-sans">
                        Address
                      </label>
                      <Field
                        as="textarea"
                        name="CompleteAddress"
                        className="formInputdefault !h-auto"
                        rows={4}
                        placeholder="Enter Adress"
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="flat"
                      
                      onPress={closeAddModal}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" type="submit">
                      Add Order
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
