import React from "react";

interface LabelProps {
    labelForm?: string;
    label: string;
    isRequired: boolean;
}

const Label: React.FC<LabelProps> = ({ labelForm, label, isRequired }) => {
    return (
        <label form={labelForm} className="text-sm text-gray-500 font-sans font-bold">
            {label}
            {isRequired ? <span className="text-red-500 text-sm">*</span> : <></>}
        </label>
    );
};

export default Label;
