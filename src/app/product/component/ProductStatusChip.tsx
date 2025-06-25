import React from 'react'

const ProductStatusChip = ({status}:{status: string}) => {
    let cssClass = 'border-gray-100'
    if(status === "Approved"){
        cssClass = "border-green-400 text-green-400"
    }else if(status === "Rejected"){
        cssClass = "border-red-400 text-red-400"
    }else if(status === "Sample"){
         cssClass = "border-blue-400 text-blue-400"
    }
 
    return (
    <div className={`text-center text-sm border-1 rounded-lg ${cssClass}`}>{status}</div>
  )
}

export default ProductStatusChip