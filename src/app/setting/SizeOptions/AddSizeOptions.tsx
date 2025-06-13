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
import useSizeOptionsStore from "@/store/useSizeOptionsStore";
import { SizeOptionSchema } from "../../schema/SizeOptionSchema";
import Label from "../../components/common/Label";
import useProductRegionStore from "@/store/useProductRegionStore";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  sizeOptionId: number;
  closeAddModal: () => void;
}

const AddSizeOptions: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  sizeOptionId,
}) => {
  interface AddSizeOptionsType {
    OptionSizeOptions: string;
  }

  const {
    getSizeOptionById,
    addSizeOption,
    updateSizeOption,
    sizeOptionsType,
    loading,
  } = useSizeOptionsStore();

  const {fetchProductRegions, productRegions} = useProductRegionStore();

  useEffect(() => {
    if (sizeOptionId && isEdit) {
      getSizeOptionById(sizeOptionId);
    }
  }, [sizeOptionId, isEdit]);

  useEffect(()=>{
    fetchProductRegions()
  },[])

  const InitialValues = {
    OptionSizeOptions:
      isEdit && sizeOptionsType ? sizeOptionsType.OptionSizeOptions : "",
  };

  const handleAddSizeOption = async (values: AddSizeOptionsType) => {
    isEdit
      ? updateSizeOption(sizeOptionId, values, () => {
          closeAddModal();
        })
      : addSizeOption(values, () => {
          closeAddModal();
        });
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Size Option</> : <> Edit Size Option</>}
            </ModalHeader>
            <Formik
              validationSchema={SizeOptionSchema}
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
                            <Label
                              isRequired={true}
                              label="Name"
                              labelForm="Name"
                            />
                            <Field
                              name="OptionSizeOptions"
                              type="text"
                              placeholder="Enter Size Option Name"
                              className="formInputdefault bg-gray-100"
                            />
                            <ErrorMessage
                              name="OptionSizeOptions"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="Product Region"
                              labelForm="ProductRegionId"
                            />
                            <Field
                              name="ProductRegionId"
                              as="select"
                              className="formInputdefault bg-gray-100"
                            >
                              <option value={""}>Select region</option>
                              {productRegions?.map((region, index)=>{
                                return(
                                  <option value={region.Id} key={index}>{region.Name}</option>
                                )
                              })}
                            </Field>
                            <ErrorMessage
                              name="OptionSizeOptions"
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
                      {isEdit ? "Edit" : "Add"} Size Option
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

export default AddSizeOptions;
