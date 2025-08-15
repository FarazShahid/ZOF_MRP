import { useEffect, useState } from "react";
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
import useInventoryItemsStore, {
  AddInventoryItemOptions,
} from "@/store/useInventoryItemsStore";
import useInventorySubCategoryStore from "@/store/useInventorySubCategoryStore";
import useSupplierStore from "@/store/useSupplierStore";
import useUnitOfMeasureStore from "@/store/useUnitOfMeasureStore";
import { InventoryItemSchema } from "../schema/InventoryItemSchema";
import Label from "../components/common/Label";
import useInventoryCategoryStore from "@/store/useInventoryCategoryStore";
import DropZoneMultiple from "../components/DropZone/DropZoneMultiple";
import { useDocumentCenterStore } from "@/store/useDocumentCenterStore";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import DocumentCard from "../orders/components/DocumentCard";
import { useFileUploadStore } from "@/store/useFileUploadStore";
import RecentAttachmentsView from "../components/RecentAttachmentsView";

interface AddComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  Id: number;
  closeAddModal: () => void;
}

const AddItems: React.FC<AddComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  Id,
}) => {
  const [itemFiles, setItemFiles] = useState<Record<number, File | null>>({});

  const {
    loading,
    getInventoryItemById,
    inventoryItemById,
    updateInventoryItem,
    addInventoryItem,
  } = useInventoryItemsStore();

  const { fetchSubCategories, subCategories } = useInventorySubCategoryStore();
  const { fetchSuppliers, suppliers } = useSupplierStore();
  const { fetchUnitOfMeasures, unitMeasures } = useUnitOfMeasureStore();
  const { fetchInventoryCategories, inventoryCategories } =
    useInventoryCategoryStore();
  const { uploadDocument, loadingDoc } = useDocumentCenterStore();
  const { uploadedFilesByIndex, resetAllFiles } = useFileUploadStore();

  useEffect(() => {
    if (Id && isEdit) {
      getInventoryItemById(Id);
    }
  }, [Id, isEdit]);

  useEffect(() => {
    fetchSuppliers();
    fetchUnitOfMeasures();
    fetchInventoryCategories();
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetAllFiles();
    }
  }, [isOpen]);

  const InitialValues = {
    Name: isEdit && inventoryItemById ? inventoryItemById.Name : "",
    CategoryId: isEdit && inventoryItemById ? inventoryItemById.CategoryId : 0,
    SubCategoryId:
      isEdit && inventoryItemById ? inventoryItemById.SubCategoryId : 0,
    UnitOfMeasureId:
      isEdit && inventoryItemById ? inventoryItemById.UnitOfMeasureId : "",
    SupplierId: isEdit && inventoryItemById ? inventoryItemById.SupplierId : 0,
    ReorderLevel:
      isEdit && inventoryItemById ? Number(inventoryItemById.ReorderLevel) : 0,
    Stock: isEdit && inventoryItemById ? inventoryItemById.Stock : 0,
  };

  const handleAdd = async (values: AddInventoryItemOptions) => {
    const files = uploadedFilesByIndex[1] || [];

    if (isEdit) {
      const updatedItem = await updateInventoryItem(Id, values);

      if (updatedItem && files.length > 0) {
        for (const fileObj of files) {
          await uploadDocument(
            fileObj.file,
            DOCUMENT_REFERENCE_TYPE.INVENTORY_ITEMS,
            updatedItem.Id
          );
        }
      }

      resetAllFiles();
      closeAddModal();
    } else {
      const result = await addInventoryItem(values);

      if (result && files.length > 0) {
        for (const fileObj of files) {
          await uploadDocument(
            fileObj.file,
            DOCUMENT_REFERENCE_TYPE.INVENTORY_ITEMS,
            result.Id
          );
        }

        resetAllFiles();
        closeAddModal();
      }
    }
  };

  const handleFileSelect = (file: File, index: number) => {
    setItemFiles((prev) => ({ ...prev, [index]: file }));
  };

  return (
    <Modal isOpen={isOpen} size="3xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Item</> : <> Edit Item</>}
            </ModalHeader>
            <Formik
              validationSchema={InventoryItemSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAdd}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div className="max-h-[calc(100vh-285px)] overflow-x-auto">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="Name"
                              labelForm="Name"
                            />
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
                            <Label
                              isRequired={true}
                              label="Category"
                              labelForm="Category"
                            />
                            <Field
                              name="CategoryId"
                              as="select"
                              className="formInputdefault border-1"
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                              ) => {
                                const value = Number(e.target.value);
                                setFieldValue("CategoryId", value);
                                fetchSubCategories(value);
                              }}
                            >
                              <option value={""}>Select category</option>
                              {inventoryCategories?.map((category, index) => {
                                return (
                                  <option value={category?.Id} key={index}>
                                    {category?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="SubCategoryId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={false}
                              label="Sub Category"
                              labelForm="Sub Category"
                            />
                            <Field
                              name="SubCategoryId"
                              as="select"
                              className="formInputdefault border-1"
                            >
                              <option value={""}>Select sub category</option>
                              {subCategories?.map((category, index) => {
                                return (
                                  <option value={category?.Id} key={index}>
                                    {category?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="SubCategoryId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="Supplier"
                              labelForm="Supplier"
                            />
                            <Field
                              name="SupplierId"
                              as="select"
                              className="formInputdefault border-1"
                            >
                              <option value={0}>Select Supplier</option>
                              {suppliers?.map((supplier, index) => {
                                return (
                                  <option value={supplier?.Id} key={index}>
                                    {supplier?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="SupplierId"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="Unit Of Measure"
                              labelForm="Unit Of Measure"
                            />
                            <Field
                              name="UnitOfMeasureId"
                              as="select"
                              className="formInputdefault border-1"
                            >
                              <option value={0}>Select Unit of measure</option>
                              {unitMeasures?.map((unitMeasure, index) => {
                                return (
                                  <option value={unitMeasure?.Id} key={index}>
                                    {unitMeasure?.Name}
                                  </option>
                                );
                              })}
                            </Field>
                            <ErrorMessage
                              name="UnitOfMeasure"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <Label
                              isRequired={true}
                              label="Reorder Level"
                              labelForm="Reorder Level"
                            />
                            <Field
                              name="ReorderLevel"
                              type="number"
                              min={0}
                              className="formInputdefault border-1"
                            />
                            <ErrorMessage
                              name="ReorderLevel"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                        </div>
                        <DropZoneMultiple
                          index={1}
                          onFileSelect={handleFileSelect}
                        />
                        {Id && isEdit ? (
                          <RecentAttachmentsView
                            referenceId={Id}
                            referenceType={
                              DOCUMENT_REFERENCE_TYPE.INVENTORY_ITEMS
                            }
                          />
                        ) : (
                          <></>
                        )}
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
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {loading || loadingDoc ? (
                        <Spinner color="white" />
                      ) : (
                        <></>
                      )}
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

export default AddItems;
