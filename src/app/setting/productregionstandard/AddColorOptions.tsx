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
import { ColorOptionSchema } from "../../schema/ColorOptionSchema";
import useProductRegionStore from "@/store/useProductRegionStore";
import Label from "../../components/common/Label";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  productRegionId: number;
  closeAddModal: () => void;
}

const AddProductRegion: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  productRegionId,
}) => {
  interface AddColorOptionType {
    Name: string;
    CreatedBy: string;
    UpdatedBy: string;
  }

  const {loading, getProductRegionId, updateProductRegion,addProductRegion,productRegion} = useProductRegionStore();

  useEffect(() => {
    if (productRegionId && isEdit) {
      getProductRegionId(productRegionId);
    }
  }, [productRegionId, isEdit]);

  const InitialValues = {
    Name: isEdit && productRegion ? productRegion.Name : "",
    CreatedBy: isEdit && productRegion ? productRegion.CreatedBy : "admin",
    UpdatedBy: isEdit && productRegion ? productRegion.UpdatedBy : "admin",
  };

  const handleAddFabric = async (values: AddColorOptionType) => {
    isEdit
      ? updateProductRegion(productRegionId, values, () => {
          closeAddModal();
        })
      : addProductRegion(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Product Region Standard</> : <> Edit Product Region Standard</>}
            </ModalHeader>
            <Formik
              validationSchema={ColorOptionSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddFabric}
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
                              placeholder="Enter Type"
                              className="formInputdefault bg-gray-100"
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
                      {isEdit ? "Edit" : "Add"}
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

export default AddProductRegion;
