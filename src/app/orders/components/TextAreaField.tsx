import React from 'react'
import Label from '../../components/common/Label';
import { ErrorMessage, Field } from 'formik';

const TextAreaField = ({ label, name }: { label: string; name: string }) => (
  <div className="flex flex-col gap-2 mb-3">
    <Label isRequired={false} label={label} />
    <Field
      as="textarea"
      name={name}
      maxLength={200}
      className="w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500 resize-none"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
);


export default TextAreaField