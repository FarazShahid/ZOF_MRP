import React from 'react'
import { AiOutlineProduct } from 'react-icons/ai';
import { MdIncompleteCircle, MdOutlinePendingActions, MdOutlineCancel } from "react-icons/md";
import { Order } from '../interfaces';

interface HeaderWidgetsProps {
    orders: Order[] | null;
  }
  
  const HeaderWidgets: React.FC<HeaderWidgetsProps> = ({ orders }) => {
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter((order) => order.StatusName === "Pending").length || 0;
    const completedOrders = orders?.filter((order) => order.StatusName === "Completed").length || 0;
    const cancelledOrders = orders?.filter((order) => order.StatusName === "Cancelled").length || 0;
  
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        <div className='bg-gray-100 border-1 rounded-lg p-5 flex items-center justify-between'>
            <AiOutlineProduct size={35} color='#a4a4a4' />
            <div className='flex flex-col'>
                <span className='text-black font-heading'>Total Orders</span>
                <span className='text-black text-center font-heading text-2xl font-semibold'>{totalOrders}</span>
            </div>
        </div>
        <div className='bg-gray-100 border-1 rounded-lg p-5 flex items-center justify-between'>
            <MdIncompleteCircle size={35} color='#a4a4a4' />
            <div className='flex flex-col'>
                <span className='text-black font-heading'>Completed Orders</span>
                <span className='text-black text-center font-heading text-2xl font-semibold'>{completedOrders}</span>
            </div>
        </div>
        <div className='bg-gray-100 border-1 rounded-lg p-5 flex items-center justify-between'>
            <MdOutlinePendingActions size={35} color='#a4a4a4' />
            <div className='flex flex-col'>
                <span className='text-black font-heading'>Pending Orders</span>
                <span className='text-black text-center font-heading text-2xl font-semibold'>{pendingOrders}</span>
            </div>
        </div>
        <div className='bg-gray-100 border-1 rounded-lg p-5 flex items-center justify-between'>
            <MdOutlineCancel size={35} color='#a4a4a4' />
            <div className='flex flex-col'>
                <span className='text-black font-heading'>Cancelled Orders</span>
                <span className='text-black text-center font-heading text-2xl font-semibold'>{cancelledOrders}</span>
            </div>
        </div>
    </div>
  )
}

export default HeaderWidgets