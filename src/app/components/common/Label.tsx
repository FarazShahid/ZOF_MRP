import React from "react";

interface LabelProps {
    labelForm?: string;
    label: string;
    isRequired: boolean;
    className?: string;
}

const Label: React.FC<LabelProps> = ({ labelForm, label, isRequired, className = "" }) => {
    return (
        <label form={labelForm} className={`block text-sm text-slate-400 mb-2 ${className}`}>
            {label}
            {isRequired ? <span className="text-red-500 ml-0.5">*</span> : null}
        </label>
    );
};

export default Label;
