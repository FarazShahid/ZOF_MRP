"use client"

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { UsersModule } from './users/UsersModule';
import { CustomersModule } from './customers/CustomersModule';
import { EventsModule } from './events/EventsModule';
import { ActiveModule } from '@/src/types/admin';
import CarriorTable from '../../shipment/carrior/components/CarriorTable';

export const AdminSettings: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('users');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'users':
        return <UsersModule />;
      case 'customers':
        return <CustomersModule />;
      case 'events':
        return <EventsModule />;
      case 'carriers':
        return <CarriorTable />;
      default:
        return <UsersModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 overflow-auto">
        {renderActiveModule()}
      </div>
    </div>
  );
};