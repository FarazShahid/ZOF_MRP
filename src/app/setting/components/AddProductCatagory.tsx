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
import { fetchWithAuth } from "../../services/authservice";
import { useFetchProductCatagoryById } from "../../services/useFetchProductCatagoryById";
import { CatagorySchema } from "../../schema/CatagorySchema";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  productIdCatagory: number;
  closeAddModal: () => void;
  onOrderAdded: () => void;
}

const AddProductCatagory: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  onOrderAdded,
  isEdit,
  productIdCatagory,
}) => {
  interface AddClientType {
    type: string;
  }

  const { isLoading, productCategory } = useFetchProductCatagoryById({productIdCatagory});

  const InitialValues = {
    type: isEdit && productCategory ? productCategory.type : "",
    createdBy: isEdit && productCategory ? productCategory.createdBy : "admin",
    updatedBy: isEdit && productCategory ? productCategory.updatedBy : "admin",
  };

  const handleAddCatagory = async (values: AddClientType) => {
    debugger
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_API_URL}/product-category/${productIdCatagory}`
      : `${process.env.NEXT_PUBLIC_API_URL}/product-category`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetchWithAuth(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        console.log("Error creating Catagory");
        throw new Error("Failed to create Catagory");
      }
      const result = await response.json();
      closeAddModal();
      onOrderAdded();
    } catch (error) {
      console.error("Error creating Catagory:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Product Category</> : <> Edit Product Category</>}
            </ModalHeader>
            <Formik
              validationSchema={CatagorySchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddCatagory}
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
                              name="type"
                              type="text"
                              placeholder="Enter Name"
                              className="formInputdefault"
                            />
                            <ErrorMessage
                              name="type"
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
                      {isEdit ? "Edit" : "Add"} Catagory
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

export default AddProductCatagory;
