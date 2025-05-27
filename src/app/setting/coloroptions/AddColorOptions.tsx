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
import { Formik, Form } from "formik";
import useColorOptionsStore, {
  AddColorOption,
} from "@/store/useColorOptionsStore";
import { ColorOptionSchema } from "../../schema/ColorOptionSchema";
import { PantoneColor } from "./PantoneColorPicker";
import PantoneColorDropdown from "./PantoneColorPicker";

interface AddClientComponentProps {
  isOpen: boolean;
  isEdit: boolean;
  colorId: number;
  closeAddModal: () => void;
}

const AddColorOptions: React.FC<AddClientComponentProps> = ({
  isOpen,
  closeAddModal,
  isEdit,
  colorId,
}) => {
  const {
    colorOption,
    loading,
    addColorOption,
    updateColorOption,
    getColorOptionId,
  } = useColorOptionsStore();
  const [selectedColor, setSelectedColor] = useState<PantoneColor>();

  const InitialValues = {
    Name: isEdit && colorOption ? colorOption.Name : "",
    HexCode: isEdit && colorOption ? colorOption.HexCode : "",
  };

  const onCloseModal = () => {
    closeAddModal();
  };

  const handleAddColor = async (values: AddColorOption) => {
    values.HexCode = selectedColor?.hex || "";
    values.Name = selectedColor?.name || "";
    isEdit
      ? updateColorOption(colorId, values, () => {
          onCloseModal();
        })
      : addColorOption(values, () => {
          onCloseModal();
        });
  };

  useEffect(() => {
    if (colorId && isEdit) {
      getColorOptionId(colorId);
    }
  }, [colorId, isEdit]);

  const handleColorPicker = (selectedColor: PantoneColor) => {
    setSelectedColor(selectedColor);
  };

  return (
    <Modal isOpen={isOpen} size="full" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {!isEdit ? <> Add Color Option</> : <> Edit Color Option</>}
            </ModalHeader>
            <Formik
              validationSchema={ColorOptionSchema}
              initialValues={InitialValues}
              enableReinitialize
              onSubmit={handleAddColor}
            >
              {({ isSubmitting }) => (
                <Form>
                  <ModalBody>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="w-full">
                            <PantoneColorDropdown
                              onChange={(color) => handleColorPicker(color)}
                              initialHexCode={isEdit && colorOption ? colorOption.HexCode : undefined}
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
                      {isEdit ? "Edit" : "Add"} Color Option
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

export default AddColorOptions;
