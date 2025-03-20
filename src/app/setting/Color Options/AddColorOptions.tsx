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
import chroma from "chroma-js";
import useColorOptionsStore, {
  AddColorOption,
} from "@/store/useColorOptionsStore";
import { ColorOptionSchema } from "../../schema/ColorOptionSchema";

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
  const [color, setColor] = useState("#858585");
  const [colorRange, setColorRange] = useState(15);
  const [selectedColor, setSelectedColor] = useState<{
    hex: string;
    rgb: string;
    hsl: string;
    hsv: string;
  } | null>(null);

  const shades = chroma
    .scale([chroma(color).brighten(2), color, chroma(color).darken(2)])
    .colors(colorRange);

  const getColorFormats = (hex: string) => {
    const rgb = chroma(hex).rgb(); // [r, g, b]
    const hsl = chroma(hex).hsl(); // [h, s, l]
    const hsv = chroma(hex).hsv(); // [h, s, v]

    return {
      hex: hex,
      rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
      hsl: `hsl(${Math.round(hsl[0])}, ${Math.round(
        hsl[1] * 100
      )}%, ${Math.round(hsl[2] * 100)}%)`,
      hsv: `hsv(${Math.round(hsv[0])}, ${Math.round(
        hsv[1] * 100
      )}%, ${Math.round(hsv[2] * 100)}%)`,
    };
  };

  const InitialValues = {
    Name: isEdit && colorOption ? colorOption.Name : "",
    HexCode: isEdit && colorOption ? colorOption.HexCode : "",
  };

  const handleColorRange = (range: string) => {
    setColorRange(Number(range));
  };

  const onCloseModal = () => {
    setSelectedColor(null);
    setColor("#858585");
    closeAddModal();
  };

  const handleAddColor = async (values: AddColorOption) => {
    values.HexCode = selectedColor?.hex || color;
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

  useEffect(()=>{
    if(colorOption){
      setColor(colorOption.HexCode);
    }
  },[colorOption])

  return (
    <Modal isOpen={isOpen} size="5xl" onOpenChange={closeAddModal}>
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
                          <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-600 font-sans">
                              Name
                              <span className="text-red-500 text-sm">*</span>
                            </label>
                            <Field
                              name="Name"
                              type="text"
                              placeholder="Enter Name"
                              className="formInputdefault border-2"
                            />
                            <ErrorMessage
                              name="Name"
                              component="div"
                              className="text-red-400 text-sm"
                            />
                          </div>
                          <div className="flex justify-between gap-8">
                            <div className="flex flex-col justify-center w-full">
                              <label className="text-sm text-gray-600 font-sans">
                                Color Shades
                              </label>
                              <div className="flex items-center gap-1 w-full">
                                <input
                                  type="range"
                                  step={1}
                                  min={1}
                                  max={25}
                                  className="w-full"
                                  onChange={(e) =>
                                    handleColorRange(e.target.value)
                                  }
                                />
                                <div className="w-[40px] p-1 text-center bg-gray-200 rounded">
                                  {colorRange}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-center">
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-[100px] h-[100px]"
                              />
                              <label className="text-sm text-gray-600 font-sans">
                                Code Picker
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <ul className="flex items-stretch" id="color-shades">
                            {shades.map((shade, index) => (
                              <li key={index} className="flex-1">
                                <div
                                  className="color-shade"
                                  style={{ backgroundColor: shade }}
                                  onClick={() =>
                                    setSelectedColor(getColorFormats(shade))
                                  }
                                ></div>
                              </li>
                            ))}
                          </ul>
                          <label className="text-sm text-center">
                            Select the color shade above to get color code
                          </label>
                        </div>

                        {selectedColor && (
                          <div className="p-4 flex items-center justify-center gap-5 w-full">
                            <div className="flex flex-col gap-3 w-[240px]">
                              <div className="flex items-center gap-3 w-full">
                                <label className="font-bold">HEX</label>
                                <div className="p-1 bg-[#f6f6f6] border-1 w-full rounded">
                                  {selectedColor.hex}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 w-full">
                                <label className="font-bold">RGB</label>
                                <div className="p-1 bg-[#f6f6f6] border-1 w-full rounded">
                                  {selectedColor.rgb}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 w-full">
                                <label className="font-bold">HSL</label>
                                <div className="p-1 bg-[#f6f6f6] border-1 w-full rounded">
                                  {selectedColor.hsl}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 w-full">
                                <label className="font-bold">HSV</label>
                                <div className="p-1 bg-[#f6f6f6] border-1 w-full rounded">
                                  {selectedColor.hsv}
                                </div>
                              </div>
                            </div>
                            <div
                              className="w-[200px] h-[200px]"
                              style={{ backgroundColor: selectedColor.hex }}
                            ></div>
                          </div>
                        )}
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
