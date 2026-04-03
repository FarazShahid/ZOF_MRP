import React from 'react';
import { Users, Calendar, Truck, Shield } from 'lucide-react';
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
  { id: 'events' as ActiveModule, label: 'Events', icon: Calendar, required: PERMISSIONS_ENUM.EVENTS.VIEW },
  { id: 'carriers' as ActiveModule, label: 'Carriers', icon: Truck, required: PERMISSIONS_ENUM.CARRIERS.VIEW },
  { id: 'roles' as ActiveModule, label: 'Role & Permissions', icon: Shield, required: PERMISSIONS_ENUM.ROLES_AND_RIGHTS.VIEW },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <div className="w-64 shrink-0 h-full overflow-y-auto">
      <div className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <PermissionGuard key={item.id} required={item.required}>
              <button
                onClick={() => onModuleChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            </PermissionGuard>
          );
        })}
      </div>
    </div>
  );
};
