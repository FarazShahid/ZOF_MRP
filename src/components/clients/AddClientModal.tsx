"use client";

import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import useClientStore, { AddClientType } from "@/store/useClientStore";
import { AddClientSchemaValidation } from "@/src/app/schema/ClientSchema";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  clientId?: number;
}

const initialValues: AddClientType & { ClientStatusId: string } = {
  Name: "",
  Email: "",
  POCName: "",
  Phone: "",
  POCEmail: "",
  Website: "",
  Linkedin: "",
  Instagram: "",
  Country: "",
  State: "",
  City: "",
  CompleteAddress: "",
  ClientStatusId: "1",
};

const inputClassName =
  "w-full bg-slate-800 text-slate-300 text-sm px-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500";
const errorClassName = "text-red-400 text-xs mt-1";
const labelClassName = "block text-sm font-medium text-slate-300 mb-2";

const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isEdit = false,
  clientId = 0,
}) => {
  const { getClientById, addClient, updateClient, loading, clientById } =
    useClientStore();

  useEffect(() => {
    if (clientId && isEdit) {
      getClientById(clientId);
    }
  }, [clientId, isEdit, getClientById]);

  const formInitialValues =
    isEdit && clientById
      ? {
          Name: clientById.Name || "",
          Email: clientById.Email || "",
          POCName: clientById.POCName || "",
          Phone: clientById.Phone || "",
          POCEmail: clientById.POCEmail || "",
          Website: clientById.Website || "",
          Linkedin: clientById.Linkedin || "",
          Instagram: clientById.Instagram || "",
          Country: clientById.Country || "",
          State: clientById.State || "",
          City: clientById.City || "",
          CompleteAddress: clientById.CompleteAddress || "",
          ClientStatusId: clientById.ClientStatusId || "1",
        }
      : initialValues;

  const handleSubmit = async (values: AddClientType & { ClientStatusId: string }) => {
    const payload: AddClientType = {
      Name: values.Name.trim(),
      Email: values.Email?.trim(),
      POCName: values.POCName?.trim() || undefined,
      Phone: values.Phone?.trim() || undefined,
      POCEmail: values.POCEmail?.trim() || undefined,
      Website: values.Website?.trim() || undefined,
      Linkedin: values.Linkedin?.trim() || undefined,
      Instagram: values.Instagram?.trim() || undefined,
      Country: values.Country?.trim() || undefined,
      State: values.State?.trim() || undefined,
      City: values.City?.trim() || undefined,
      CompleteAddress: values.CompleteAddress?.trim() || undefined,
      ClientStatusId: values.ClientStatusId || undefined,
    };

    if (isEdit && clientId) {
      await updateClient(clientId, payload, () => {
        onClose();
        onSuccess?.();
      });
    } else {
      await addClient(payload, () => {
        onClose();
        onSuccess?.();
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-3xl w-full mx-4 my-8 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isEdit ? "Edit Client" : "Add New Client"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>

        {loading && !clientById && isEdit ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Formik
            initialValues={formInitialValues}
            validationSchema={AddClientSchemaValidation}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <div className="space-y-6">
                  {/* Business Info */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClassName}>Business Name *</label>
                        <Field
                          name="Name"
                          type="text"
                          placeholder="Enter business name"
                          className={inputClassName}
                        />
                        <ErrorMessage name="Name" component="div" className={errorClassName} />
                      </div>
                      <div>
                        <label className={labelClassName}>Business Email *</label>
                        <Field
                          name="Email"
                          type="email"
                          placeholder="business@example.com"
                          className={inputClassName}
                        />
                        <ErrorMessage name="Email" component="div" className={errorClassName} />
                      </div>
                    </div>
                  </div>

                  {/* POC (Person Of Contact) */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-300">
                      POC (Person Of Contact)
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className={labelClassName}>Name</label>
                        <Field
                          name="POCName"
                          type="text"
                          placeholder="Enter contact name"
                          className={inputClassName}
                        />
                        <ErrorMessage name="POCName" component="div" className={errorClassName} />
                      </div>
                      <div>
                        <label className={labelClassName}>Phone Number</label>
                        <Field
                          name="Phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className={inputClassName}
                        />
                        <ErrorMessage name="Phone" component="div" className={errorClassName} />
                      </div>
                      <div>
                        <label className={labelClassName}>Email</label>
                        <Field
                          name="POCEmail"
                          type="email"
                          placeholder="email@example.com"
                          className={inputClassName}
                        />
                        <ErrorMessage name="POCEmail" component="div" className={errorClassName} />
                      </div>
                    </div>
                  </div>

                  {/* Business URLs */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-300">
                      Business URLs
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className={labelClassName}>Web Site</label>
                        <Field
                          name="Website"
                          type="text"
                          placeholder="https://www.example.com"
                          className={inputClassName}
                        />
                        <ErrorMessage name="Website" component="div" className={errorClassName} />
                      </div>
                      <div>
                        <label className={labelClassName}>LinkedIn</label>
                        <Field
                          name="Linkedin"
                          type="text"
                          placeholder="https://linkedin.com/company/..."
                          className={inputClassName}
                        />
                        <ErrorMessage name="Linkedin" component="div" className={errorClassName} />
                      </div>
                      <div>
                        <label className={labelClassName}>Instagram</label>
                        <Field
                          name="Instagram"
                          type="text"
                          placeholder="https://instagram.com/..."
                          className={inputClassName}
                        />
                        <ErrorMessage name="Instagram" component="div" className={errorClassName} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? isEdit
                        ? "Updating..."
                        : "Adding..."
                      : isEdit
                      ? "Update Client"
                      : "Add Client"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default AddClientModal;
