import React from 'react'
import Label from '../../components/common/Label';
import { ErrorMessage, Field } from 'formik';

const SelectField = ({
  label,
  name,
  options,
}:{
  label: string;
  name: string;
  options: { id: number; label: string }[];
}) => {
  return (
     <div className="flex flex-col gap-1 mb-3">
    <Label isRequired label={label} />
    <Field
      as="select"
      name={name}
      className="rounded-xl text-gray-400 text-sm p-2 w-full outline-none bg-gray-950 border-1 border-gray-600"
    >
      <option value="">Select priority</option>
      {options.map((opt, index) => (
        <option key={index} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
  )
}

export default SelectField