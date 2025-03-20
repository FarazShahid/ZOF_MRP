import React from 'react'
import Layout from '../components/Layout'

const page = () => {
  return (
    <Layout>
        <div className='w-full flex flex-col gap-3 p-5'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-semibold'>Leads</h1>
                <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 hover:font-semibold text-white px-3 py-1 rounded-lg"
          >
            + Add
          </button>
            </div>
        </div>
    </Layout>
  )
}

export default page