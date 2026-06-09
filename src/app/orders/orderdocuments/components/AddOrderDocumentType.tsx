import { useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Switch,
} from "@heroui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Label from "@/src/app/components/common/Label";
import {
  normalizeSupportedExtensions,
  ORDER_DOCUMENT_EXTENSION_OPTIONS,
  OrderDocumentTypeSchema,
} from "@/src/app/schema/OrderDocumentTypeSchema";
import useOrderDocumentTypesStore, {
  AddOrUpdateOrderDocumentType,
} from "@/store/useOrderDocumentTypesStore";

interface AddOrderDocumentTypeProps {
  isOpen: boolean;
  isEdit: boolean;
  orderDocumentTypeId: number;
  closeAddModal: () => void;
}

interface OrderDocumentTypeFormValues {
  Name: string;
  IsRequired: boolean;
  SupportedExtensions: string[];
}

const AddOrderDocumentType: React.FC<AddOrderDocumentTypeProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  orderDocumentTypeId,
}) => {
  const {
    loading,
    orderDocumentTypeById,
    getOrderDocumentTypeById,
    addOrderDocumentType,
    updateOrderDocumentType,
    clearOrderDocumentType,
  } = useOrderDocumentTypesStore();

  useEffect(() => {
    if (!isOpen) return;

    if (orderDocumentTypeId && isEdit) {
      getOrderDocumentTypeById(orderDocumentTypeId);
    } else {
      clearOrderDocumentType();
    }
  }, [
    isOpen,
    orderDocumentTypeId,
    isEdit,
    getOrderDocumentTypeById,
    clearOrderDocumentType,
  ]);

  const selectedDocumentType =
    isEdit && orderDocumentTypeById?.Id === orderDocumentTypeId
      ? orderDocumentTypeById
      : null;

  const initialValues: OrderDocumentTypeFormValues = {
    Name: selectedDocumentType?.Name ?? "",
    IsRequired: selectedDocumentType?.IsRequired ?? false,
    SupportedExtensions: normalizeSupportedExtensions(
      selectedDocumentType?.SupportedExtensions
    ),
  };

  const handleSubmit = async (values: OrderDocumentTypeFormValues) => {
    const payload: AddOrUpdateOrderDocumentType = {
      Name: values.Name.trim(),
      IsRequired: values.IsRequired,
      SupportedExtensions: normalizeSupportedExtensions(
        values.SupportedExtensions
      ),
    };

    if (isEdit) {
      await updateOrderDocumentType(orderDocumentTypeId, payload, closeAddModal);
      return;
    }

    await addOrderDocumentType(payload, closeAddModal);
  };

  const showLoadingState = isEdit && loading && !selectedDocumentType;

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {isEdit ? "Edit Document Type" : "Add New"}
            </ModalHeader>
            <Formik
              validationSchema={OrderDocumentTypeSchema}
              initialValues={initialValues}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <ModalBody>
                    {showLoadingState ? (
                      <div className="flex justify-center py-8">
                        <Spinner />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-1 w-full">
                          <Label isRequired={true} label="Name" />
                          <Field
                            name="Name"
                            type="text"
                            maxLength={255}
                            placeholder="Enter order document name"
                            className="formInputdefault bg-gray-100"
                          />
                          <ErrorMessage
                            name="Name"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                          <Label
                            isRequired={false}
                            label="Supported Extensions"
                          />
                          <Select
                            aria-label="Supported Extensions"
                            className="rounded-xl text-gray-400 text-sm w-full outline-none dark:bg-slate-800 bg-gray-100"
                            name="SupportedExtensions"
                            placeholder="Select supported extensions"
                            selectedKeys={new Set(values.SupportedExtensions)}
                            selectionMode="multiple"
                            variant="bordered"
                            onSelectionChange={(keys) => {
                              const selected =
                                keys === "all"
                                  ? ORDER_DOCUMENT_EXTENSION_OPTIONS.map(
                                      (option) => option.key
                                    )
                                  : Array.from(keys).map(String);

                              setFieldValue(
                                "SupportedExtensions",
                                normalizeSupportedExtensions(selected)
                              );
                            }}
                          >
                            {ORDER_DOCUMENT_EXTENSION_OPTIONS.map((option) => (
                              <SelectItem key={option.key}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </Select>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Leave empty to allow any uploaded file type.
                          </span>
                          <ErrorMessage
                            name="SupportedExtensions"
                            component="div"
                            className="text-red-400 text-sm"
                          />
                          {values.SupportedExtensions.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {values.SupportedExtensions.map((extension) => (
                                <span
                                  key={extension}
                                  className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                                >
                                  .{extension}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col gap-1">
                            <Label
                              isRequired={false}
                              label="Required Document"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Include this type in order document completion
                              checks.
                            </span>
                          </div>
                          <Switch
                            isSelected={values.IsRequired}
                            onValueChange={(isSelected) =>
                              setFieldValue("IsRequired", isSelected)
                            }
                            aria-label="Required Document"
                          />
                        </div>
                      </div>
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

export default AddOrderDocumentType;
