import React from 'react'
import Label from '../../components/common/Label';
import MultiCheckboxSelect from './MultiSelectPrintingOptions';

const PrintingOptionsMultiSelect = ({
  index,
  item,
  printingOptions,
  setFieldValue,
}: {
  index: number;
  item: any;
  printingOptions: any[];
  setFieldValue: (field: string, value: any) => void;
}) => {
  return (
    <div className="mb-4">
      <MultiCheckboxSelect
        printingOptions={printingOptions}
        name={`items[${index}].printingOptions`}
        value={item.printingOptions || []}
        onChange={(selectedIds: number[]) => {
          const selectedObjects = selectedIds.map((id) => ({
            PrintingOptionId: id,
            Description: "",
          }));
          setFieldValue(`items[${index}].printingOptions`, selectedObjects);
        }}
      />
    </div>
  )
}

export default PrintingOptionsMultiSelect