import React, { useEffect } from "react";
import { ErrorMessage, Field } from "formik";
import useClientStore from "@/store/useClientStore";
import useEventsStore from "@/store/useEventsStore";
import { PRIORITY_ENUM, ORDER_TYPE } from "@/interface/GetFileType";
import Label from "../../components/common/Label";

const orderTypeCards = [
  { value: ORDER_TYPE.SAMPLING, label: "Sample", icon: "ri-test-tube-line", desc: "Small batch for approval", color: "teal" },
  { value: ORDER_TYPE.PRODUCTION, label: "Production", icon: "ri-stack-line", desc: "Full production run", color: "blue" },
  { value: ORDER_TYPE.RE_ORDER, label: "Reorder", icon: "ri-repeat-line", desc: "Repeat a previous order", color: "amber" },
];

const Step1 = ({ formik, isEdit }: { formik: any; isEdit?: boolean }) => {
  const { fetchClients, clients } = useClientStore();
  const { fetchEvents, Events } = useEventsStore();

  useEffect(() => {
    fetchClients();
    fetchEvents();
  }, []);

  const selectedClientId = Number(formik.values.ClientId);
  const filteredEvents = selectedClientId
    ? Events.filter((e) => e.ClientId === selectedClientId)
    : [];

  const fieldStyle =
    "w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500";
  const selectStyle = fieldStyle + " cursor-pointer";

  const hideOrderTypeSelect =
    formik?.initialValues?.OrderType === ORDER_TYPE.RE_ORDER;

  return (
    <div className="space-y-6 w-full">
      {/* Order Context - same structure as reference */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ri-file-list-3-line text-white w-4 h-4 flex items-center justify-center" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Order Context</h2>
            <p className="text-xs text-slate-400">Define the order basics and link to a client &amp; event</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <Label isRequired={true} label="Order Name" />
            <Field type="text" maxLength={150} name="OrderName" className={fieldStyle} placeholder="e.g., Nike Summer Jersey Batch C" />
            <ErrorMessage name="OrderName" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {isEdit && (
            <div className="col-span-2">
              <Label isRequired={true} label="Order Number" />
              <Field type="text" name="OrderNumber" maxLength={150} className={fieldStyle} />
              <ErrorMessage name="OrderNumber" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          )}

          <div>
            <Label isRequired={true} label="Client" />
            <Field as="select" name="ClientId" className={selectStyle}>
              <option value="">Select client</option>
              {clients?.map((client, index) => (
                <option value={client?.Id} key={index}>{client?.Name}</option>
              ))}
            </Field>
            <ErrorMessage name="ClientId" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label isRequired={false} label="Event" />
            <Field as="select" name="OrderEventId" className={selectStyle}>
              <option value="">Select event</option>
              {filteredEvents?.map((event, index) => (
                <option value={event?.Id} key={index}>
                  {event?.EventName} ({event.ClientName})
                </option>
              ))}
            </Field>
            <ErrorMessage name="OrderEventId" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label isRequired={true} label="Target Delivery Date" />
            <Field type="date" name="Deadline" className={fieldStyle} min={new Date().toISOString().split("T")[0]} />
            <ErrorMessage name="Deadline" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label isRequired={false} label="Order Priority" />
            <Field as="select" name="OrderPriority" className={selectStyle}>
              <option value="">Select priority</option>
              {PRIORITY_ENUM.map((priority, index) => (
                <option value={priority.id} key={index}>{priority.label}</option>
              ))}
            </Field>
          </div>
        </div>
      </div>

      {/* Order Type visual cards - separate card like reference */}
      {!hideOrderTypeSelect && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Order Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {orderTypeCards
              .filter((t) => t.value !== ORDER_TYPE.RE_ORDER)
              .map((t) => {
                const isSelected = formik.values.OrderType === t.value;
                const colorMap: Record<string, { border: string; bg: string; iconBg: string }> = {
                  teal: { border: "border-teal-500", bg: "bg-teal-500/10", iconBg: "bg-teal-500/20" },
                  blue: { border: "border-blue-500", bg: "bg-blue-500/10", iconBg: "bg-blue-500/20" },
                  amber: { border: "border-amber-500", bg: "bg-amber-500/10", iconBg: "bg-amber-500/20" },
                };
                const colors = colorMap[t.color];
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => formik.setFieldValue("OrderType", t.value)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${colors.border} ${colors.bg}`
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <i className="ri-check-line text-white text-sm w-4 h-4 flex items-center justify-center" />
                        </div>
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-4`}>
                      <i className={`${t.icon} text-2xl text-white w-6 h-6 flex items-center justify-center`} />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{t.label}</h4>
                    <p className="text-slate-400 text-xs">{t.desc}</p>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1;
