import React from 'react'

const ProductStatusChip = ({status}:{status: string}) => {
    let cssClass = 'border-gray-100'
    if(status === "Approved"){
        cssClass = "border-green-500 text-green-600"
    }else if(status === "Rejected"){
        cssClass = "border-red-500 text-red-600"
    }else if(status === "Sample"){
         cssClass = "border-blue-500 text-blue-600"
    }
 
    return (
    <div className={`text-center text-xs px-2 w-fit border-1 rounded-md ${cssClass}`}>{status}</div>
  )
}

export default ProductStatusChip