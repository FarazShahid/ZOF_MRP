import useClientStore from '@/store/useClientStore';
import { Card } from '@heroui/react'
import React, { FC, useEffect } from 'react'
import { FaRegUser } from 'react-icons/fa'
interface ClientDetailsProp {
  clientId: number;
}
const ClientInfoCard: FC<ClientDetailsProp> = ({ clientId }) => {
    const { loading, clientById, getClientById } = useClientStore();

  useEffect(() => {
    if (clientId > 0) {
      getClientById(clientId);
    }
  }, [clientId]);
  
  return (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-5 rounded-lg flex items-center justify-center">
              <FaRegUser />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Client Info</h2>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
                Name
              </span>
              <p className="font-semibold text-gray-900 mt-1">{clientById?.Name}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
                Email
              </span>
              <p className="text-sm text-gray-900 mt-1">{clientById?.Email}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
                Phone
              </span>
              <p className="text-sm text-gray-900 mt-1">{clientById?.Phone}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-300 rounded-lg">
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">
                Address
              </span>
              <p className="text-sm text-gray-900 mt-1">{clientById?.CompleteAddress}</p>
            </div>
          </div>
        </div>
      </Card>
  )
}

export default ClientInfoCard