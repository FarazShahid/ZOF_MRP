import React from 'react'
import AdminDashboardLayout from '../../components/common/AdminDashboardLayout'
import Link from 'next/link'
import { IoCaretBackSharp } from 'react-icons/io5'

const page = () => {
  return (
    <AdminDashboardLayout>
        <div className="space-x-2">
        <div className="flex items-center mb-10">
            <Link
             href={"/product"}
              className="flex items-center gap-1 text-gray-400 hover:text-white"
            >
              <IoCaretBackSharp /> <span>Back to listing</span>
            </Link>
          </div>
            <div className='flex'>
                <aside className="w-1/4 p-6"></aside>
                <main className="flex flex-col justify-center items-center w-full">
                </main>
            </div>
        </div>
    </AdminDashboardLayout>
  )
}

export default page