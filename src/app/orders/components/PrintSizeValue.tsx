import React from 'react'

const PrintSizeValue = ({sizeValue, label}:{sizeValue:  string | undefined, label: string}) => {
  return (
    <div className='grid grid-cols-2'>
        <div className="border-1 px-2 py-1 font-bold">{label}</div>
        <div className="border-1 px-2 py-1" key={sizeValue}>
        {
            sizeValue ? <>{sizeValue}</> : '--'
        }
        ″
    </div>
    </div>
  )
}

export default PrintSizeValue