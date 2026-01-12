"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useEffect, useState, useRef } from "react";
import useClientStore, { AddProjectType } from "@/store/useClientStore";
import Label from "../../common/Label";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  isEdit?: boolean;
  projectId?: number | null;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, clientId, isEdit, projectId }) => {
  const { addProject, updateProject, getProjectById, projectById, loading } = useClientStore();
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  const initialValues: AddProjectType = {
    Name: isEdit && projectById ? projectById?.Name : "",
    ClientId: clientId,
    Description: isEdit && projectById ? projectById.Description : "",
  };

  // Fetch project data when opening in edit mode
  useEffect(() => {
    if (isEdit && projectId && isOpen) {
      setIsLoadingProject(true);
      getProjectById(projectId)
        .then(() => setIsLoadingProject(false))
        .catch(() => setIsLoadingProject(false));
    } else {
      setIsLoadingProject(false);
    }
  }, [isEdit, projectId, isOpen, getProjectById]);


  const handleSubmit = async (values: AddProjectType) => {
    if (isEdit && projectId) {
      await updateProject(projectId, values, onClose);
    } else {
      await addProject(values, onClose);
    }
  };

  const handleOpenChange = (open: boolean) => {
    // If modal is being closed (open = false) and it's currently open, close it
    // This handles user-initiated closes (clicking outside, pressing ESC, etc.)
    if (!open && isOpen) {
      onClose();
    }
    // If open = true, it means the modal is opening - we don't need to do anything
    // as the isOpen prop controls that
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="lg">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
             {isEdit ? 'Edit': 'Add'} Project
            </ModalHeader>
            {isEdit && isLoadingProject ? (
              <ModalBody>
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </ModalBody>
            ) : (
              <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                  <Form>
                    <ModalBody>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex flex-col gap-1">
                          <Label label="Project Name" isRequired />
                          <Field
                            name="Name"
                            type="text"
                            maxLength={100}
                            required
                            className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                          />
                          <ErrorMessage name="Name" component="div" className="text-red-500 text-sm" />
                        </div>


                        <div className="flex flex-col gap-1">
                          <Label label="Description" isRequired={false} />
                          <Field
                            name="Description"
                            as="textarea"
                            rows={3}
                            maxLength={200}
                            className="rounded-xl dark:text-gray-400 text-gray-800 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 dark:border-gray-400 border-gray-100"
                          />
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button color="primary" type="submit" isLoading={isSubmitting || loading}>
                        {isEdit ? "Update": "Save"}
                      </Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddProjectModal;


