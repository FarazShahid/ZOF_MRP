import React from 'react';
import { Users, UserCheck, Calendar, Truck, Shield } from 'lucide-react';
import { ActiveModule } from '@/src/types/admin';
import { PERMISSIONS_ENUM } from '@/src/types/rightids';
import PermissionGuard from '../auth/PermissionGaurd';

interface SidebarProps {
  activeModule: ActiveModule;
  onModuleChange: (module: ActiveModule) => void;
}

type MenuItem = {
  id: ActiveModule;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  required: number | number[];
};

const menuItems: MenuItem[] = [
  { id: 'users' as ActiveModule, label: 'Users', icon: Users, required: PERMISSIONS_ENUM.USERS.VIEW },
  { id: 'customers' as ActiveModule, label: 'Clients', icon: UserCheck, required: PERMISSIONS_ENUM.CLIENTS.VIEW },
  { id: 'events' as ActiveModule, label: 'Events', icon: Calendar, required: PERMISSIONS_ENUM.EVENTS.VIEW },
  { id: 'carriers' as ActiveModule, label: 'Carriers', icon: Truck, required: PERMISSIONS_ENUM.CARRIERS.VIEW },
  { id: 'roles' as ActiveModule, label: 'Role & Permissions', icon: Shield, required: PERMISSIONS_ENUM.ROLES_AND_RIGHTS.VIEW },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <div className="w-64 border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage system configuration</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <PermissionGuard key={item.id} required={item.required}>
                <li>
                  <button
                    onClick={() => onModuleChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              </PermissionGuard>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
