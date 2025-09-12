import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";

interface ComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const QaSheet: React.FC<ComponentProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">QA Sheet</ModalHeader>
            <ModalBody>
              <div className="space-y-2">
                {/* --- Header --- */}
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order & Product Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Order Name:
                      </span>
                      <p className="text-gray-900 font-medium">RW%#$-5343</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Order Number:
                      </span>
                      <p className="text-gray-900 font-medium">RW%#$-5343</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Deadline:
                      </span>
                      <p className="text-gray-900 font-medium">12/04/2025</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Product Name:
                      </span>
                      <p className="text-gray-900 font-medium">
                        Shorts IC - U19
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-600">
                        Sheet Generated Date:
                      </span>
                      <p className="text-gray-900 font-medium">12/09/2025</p>
                    </div>
                  </div>
                </div>
                {/* --- QA Checklist --- */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    QA Checklist
                  </h3>

                  <div>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="border-1 border-gray-200">
                        <div className="bg-gray-200 text-center text-sm py-1 font-semibold">
                          Small
                        </div>
                        <ul className="w-full mt-1 pl-3">
                           <li className="grid grid-cols-3 gap-3">
                            <div className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4" />
                            <label htmlFor="">Upper Chest</label></div>
                            <span>21</span>
                            <span>21.5</span>
                          </li>
                          <li className="grid grid-cols-3 gap-3">
                            <div className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4" />
                            <label htmlFor="">Lower Chest</label></div>
                            <span>22</span>
                            <span>22</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Sign-Off Section --- */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Inspection Sign-Off
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Date of Inspection
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Inspection By
                        </label>
                        <input
                          type="text"
                          placeholder="Enter inspector name"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QaSheet;
