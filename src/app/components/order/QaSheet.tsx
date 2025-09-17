"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import React from "react";

interface ComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const QaSheet: React.FC<ComponentProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">QA Checklist</ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* --- Header Info --- */}
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Order & Product Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><b>Order Name:</b> Practice Jersy</div>
                    <div><b>Client Name:</b> CRGC</div>
                    <div><b>Deadline:</b> 20/09/2025</div>
                    <div><b>Product Name:</b> Golblin Green</div>
                  </div>
                </div>

                {/* --- Tabs --- */}

                <Tabs
                  aria-label="QA Sections"
                  variant="underlined"
                  color="primary"
                  defaultSelectedKey="size"
                  className="w-full"
                >
                  {/* --- Size Based Tables Tab --- */}
                  <Tab key="size" title="Size Based Tables">
                    <div className="space-y-4">
                      {(["Large", "Small"] as const).map((size) => (
                        <div key={size} className="dark:bg-gray-900 shadow rounded-lg border">
                          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-gray-700">
                            Size: {size}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th className="p-2 border">Parameter</th>
                                  <th className="p-2 border">Expected</th>
                                  <th className="p-2 border">Observed</th>
                                  <th className="p-2 border">Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  { param: "Length", expected: size === "Large" ? 27 : 17 },
                                  { param: "Shoulder", expected: size === "Large" ? 17.5 : 13.5 },
                                  { param: "Chest", expected: 20.5 },
                                ].map((row, i) => (
                                  <tr key={i} className="text-center">
                                    <td className="border p-2 font-medium">{row.param}</td>
                                    <td className="border p-2">{row.expected}</td>
                                    <td className="border p-2">
                                      <input
                                        type="text"
                                        defaultValue={row.expected as number}
                                        className="w-full px-2 py-1 border rounded"
                                      />
                                    </td>
                                    <td className="border p-2">
                                      <input
                                        type="text"
                                        placeholder="Remarks"
                                        className="w-full px-2 py-1 border rounded"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tab>
                  {/* --- General QA List Tab --- */}
                  <Tab key="general" title="General QA List">
                    <div className="shadow rounded-lg border">
                      <div className="px-3 py-2 font-semibold text-gray-700">General QA Checklist</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr>
                              <th className="p-2 border">Parameter</th>
                              <th className="p-2 border">Expected</th>
                              <th className="p-2 border">Observed</th>
                              <th className="p-2 border">Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { param: "Fabric", expected: "Adidas" },
                              { param: "Neck", expected: "Round" },
                              { param: "Stitching Quality", expected: "Good" },
                              { param: "QR Code", expected: "Yes" },
                            ].map((row, i) => (
                              <tr key={i} className="text-center">
                                <td className="border p-2 font-medium">{row.param}</td>
                                <td className="border p-2">{row.expected}</td>
                                <td className="border p-2">
                                  <input
                                    type="text"
                                    placeholder="Observed"
                                    className="w-full px-2 py-1 border rounded"
                                  />
                                </td>
                                <td className="border p-2">
                                  <input
                                    type="text"
                                    placeholder="Remarks"
                                    className="w-full px-2 py-1 border rounded"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
                {/* --- Size Based Tables --- */}
                {/* {["Large", "Small"].map((size) => (
                  <div key={size} className=" dark:bg-gray-900 shadow rounded-lg border">
                    <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-gray-700">
                      Size: {size}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="p-2 border">Parameter</th>
                            <th className="p-2 border">Expected</th>
                            <th className="p-2 border">Observed</th>
                            <th className="p-2 border">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { param: "Length", expected: size === "Large" ? 27 : 17 },
                            { param: "Shoulder", expected: size === "Large" ? 17.5 : 13.5 },
                            { param: "Chest", expected: 20.5 },
                          ].map((row, i) => (
                            <tr key={i} className="text-center">
                              <td className="border p-2 font-medium">{row.param}</td>
                              <td className="border p-2">{row.expected}</td>
                              <td className="border p-2">
                                <input
                                  type="text"
                                  defaultValue={row.expected}
                                  className="w-full px-2 py-1 border rounded"
                                />
                              </td>
                              <td className="border p-2">
                                <input
                                  type="text"
                                  placeholder="Remarks"
                                  className="w-full px-2 py-1 border rounded"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))} */}

                {/* --- General QA List --- */}
                {/* <div className="shadow rounded-lg border">
                  <div className=" px-3 py-2 font-semibold text-gray-700">
                    General QA Checklist
                  </div>
                  <table className="w-full text-sm border-collapse">
                    <thead className="">
                      <tr>
                        <th className="p-2 border">Parameter</th>
                        <th className="p-2 border">Expected</th>
                        <th className="p-2 border">Observed</th>
                        <th className="p-2 border">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { param: "Fabric", expected: "Adidas" },
                        { param: "Neck", expected: "Round" },
                        { param: "Stitching Quality", expected: "Good" },
                        { param: "QR Code", expected: "Yes" },
                      ].map((row, i) => (
                        <tr key={i} className="text-center">
                          <td className="border p-2 font-medium">{row.param}</td>
                          <td className="border p-2">{row.expected}</td>
                          <td className="border p-2">
                            <input
                              type="text"
                              placeholder="Observed"
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              type="text"
                              placeholder="Remarks"
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}

                {/* --- Sign-Off Section --- */}
                {/* <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Inspection Sign-Off
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Date of Inspection
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Inspection By
                      </label>
                      <input
                        type="text"
                        placeholder="Enter inspector name"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary">Save</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QaSheet;
