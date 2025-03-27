import React from 'react'
import { RxFileText } from "react-icons/rx";

const OrderWidget = () => {
  return (
    <div className='bg-white p-5 flex flex-col gap-2 rounded-lg'>
        <div className='flex items-center justify-between'>
            <span className='font-semibold'>Total Orders</span>
            <div className='bg-red-700 rounded-full text-white p-2'>
                <RxFileText />
            </div>
        </div>
        <div className='font-semibold text-4xl text-[#9747FF] font-mono'>1500</div>
    </div>
  )
}

export default OrderWidget