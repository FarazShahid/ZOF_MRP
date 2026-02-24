import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import usePermissionStore from '@/store/usePermissionStore';
import { PERMISSIONS_ENUM } from '../types/rightids';

export default function CollapsibleSidebar() {
  const pathname = usePathname();
  const permissions = usePermissionStore((state) => state.permissions);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    setIsCollapsed(saved ? JSON.parse(saved) : false);
  }, []);

  useEffect(() => {
    if (pathname?.startsWith('/inventory') || pathname?.startsWith('/inventoryItems') || pathname?.startsWith('/inventoryTransaction')) {
      setExpandedMenu('inventory');
    } else {
      setExpandedMenu(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  const isActive = (path: string, aliasPaths?: string[]) => {
    if (!pathname) return false;
    if (path === '/') return pathname === '/';
    const pathsToCheck = [path, ...(aliasPaths ?? [])];
    return pathsToCheck.some(
      (p) => pathname === p || pathname.startsWith(p + '/')
    );
  };

  const isSubmenuActive = (path: string) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path + '/');
  };

  const menuItems = [
    { icon: 'ri-dashboard-line', label: 'Dashboard', path: '/dashboard', required: PERMISSIONS_ENUM.DASHBOARD.VIEW },
  //  { icon: 'ri-line-chart-line', label: 'Executive Cockpit', path: '/executive-cockpit', required: PERMISSIONS_ENUM.DASHBOARD.VIEW },
    { icon: 'ri-shopping-cart-2-line', label: 'Procurement', path: '/procurement', required: PERMISSIONS_ENUM.CLIENTS.VIEW },
    { icon: 'ri-box-3-line', label: 'Products', path: '/products', aliasPaths: ['/product'], required: PERMISSIONS_ENUM.PRODUCTS.VIEW },
    { icon: 'ri-file-list-3-line', label: 'BOM', path: '/bom', required: PERMISSIONS_ENUM.PRODUCT_DEFINITIONS.VIEW },
    { icon: 'ri-task-line', label: 'Work Orders', path: '/work-orders', required: PERMISSIONS_ENUM.ORDER.VIEW },
    { icon: 'ri-kanban-view-2', label: 'Production', path: '/production-planning', required: PERMISSIONS_ENUM.ORDER.VIEW },
    { 
      icon: 'ri-archive-2-line', 
      label: 'Inventory', 
      path: '/inventory',
      aliasPaths: ['/inventoryItems', '/inventoryTransaction'],
      required: [PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW, PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.VIEW],
      submenu: [
        { label: 'Items', path: '/inventory/items', required: PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW },
        { label: 'Stock Movements', path: '/inventory/stock-movements', required: PERMISSIONS_ENUM.INVENTORY_TRANSACTIONS.VIEW },
        { label: 'Warehouse', path: '/inventory/warehouse', required: PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW },
      ]
    },
    { icon: 'ri-file-text-line', label: 'Purchase Orders', path: '/purchase-orders', required: PERMISSIONS_ENUM.ORDER.VIEW },
    { icon: 'ri-inbox-unarchive-line', label: 'GRN', path: '/grn', required: PERMISSIONS_ENUM.ORDER.VIEW },
    { icon: 'ri-store-2-line', label: 'Vendors', path: '/vendors', aliasPaths: ['/supplier'], required: PERMISSIONS_ENUM.SUPPLIERS.VIEW },
    { icon: 'ri-building-4-line', label: 'Warehouse', path: '/warehouse', required: PERMISSIONS_ENUM.INVENTORY_ITEMS.VIEW },
    { icon: 'ri-ship-line', label: 'Shipments', path: '/shipments', aliasPaths: ['/shipment'], required: PERMISSIONS_ENUM.SHIPMENT.VIEW },
    { icon: 'ri-building-line', label: 'Clients', path: '/client', required: PERMISSIONS_ENUM.CLIENTS.VIEW },
    { icon: 'ri-calendar-event-line', label: 'Events', path: '/events', aliasPaths: ['/event'], required: PERMISSIONS_ENUM.EVENTS.VIEW },
    { icon: 'ri-shopping-bag-line', label: 'Orders', path: '/orders', aliasPaths: ['/order'], required: PERMISSIONS_ENUM.ORDER.VIEW },
    { icon: 'ri-bar-chart-box-line', label: 'Reports', path: '/reports', aliasPaths: ['/report'], required: PERMISSIONS_ENUM.ADMIN_SETTING.VIEW },
    { icon: 'ri-settings-3-line', label: 'Settings', path: '/settings', aliasPaths: ['/setting'], required: PERMISSIONS_ENUM.ADMIN_SETTING.VIEW },
  ];

  const visibleMenuItems = useMemo(() => {
    const hasPermission = (perm: number | number[]) =>
      Array.isArray(perm) ? perm.some((id) => permissions.includes(id)) : permissions.includes(perm);

    return menuItems
      .filter((item) => {
        if (item.submenu) {
          const visibleSubs = item.submenu.filter((sub) => hasPermission(sub.required));
          return visibleSubs.length > 0;
        }
        return hasPermission(item.required);
      })
      .map((item) => ({
        ...item,
        ...(item.submenu && {
          submenu: item.submenu.filter((sub) => hasPermission(sub.required)),
        }),
      }));
  }, [permissions]);

  const toggleSubmenu = (itemPath: string) => {
    setExpandedMenu(expandedMenu === itemPath ? null : itemPath);
  };

  return (
    <>
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img 
              src="https://static.readdy.ai/image/2a587dcfa504075b6d243559e743691f/5265f52da042b59484092e6a8aec0d84.png" 
              alt="SealsForge" 
              className="h-10 w-auto"
            />
          </Link>
        ) : (
          <Link href="/" className="flex items-center justify-center w-full cursor-pointer">
            <img 
              src="https://static.readdy.ai/image/2a587dcfa504075b6d243559e743691f/5265f52da042b59484092e6a8aec0d84.png" 
              alt="SealsForge" 
              className="h-8 w-auto"
            />
          </Link>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <i className={`${isCollapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-sm w-4 h-4 flex items-center justify-center`}></i>
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 overflow-y-auto sidebar-scrollbar">
        {visibleMenuItems.map((item) => (
          <div key={item.path}>
            <div
              className="relative group"
              onMouseEnter={
                isCollapsed
                  ? (e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ label: item.label, top: rect.top + rect.height / 2, left: rect.right + 8 });
                    }
                  : undefined
              }
              onMouseLeave={isCollapsed ? () => setTooltip(null) : undefined}
            >
              {item.submenu ? (
                <button
                  onClick={() => toggleSubmenu(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all cursor-pointer whitespace-nowrap ${
                    isActive(item.path, item.aliasPaths)
                      ? 'bg-blue-600/30 text-white hover:bg-blue-700 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center`}></i>
                  {!isCollapsed && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                      <i className={`ri-arrow-${expandedMenu === item.path ? 'down' : 'right'}-s-line text-sm w-4 h-4 flex items-center justify-center`}></i>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all cursor-pointer whitespace-nowrap ${
                    isActive(item.path, item.aliasPaths)
                      ? 'bg-blue-600/30 text-white hover:bg-blue-700 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center`}></i>
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )}
            </div>

            {/* Submenu */}
            {item.submenu && !isCollapsed && expandedMenu === item.path && (
              <div className="ml-8 mb-2 space-y-1">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.path}
                    href={subItem.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap text-sm ${
                      isSubmenuActive(subItem.path)
                        ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <i className="ri-subtract-line text-xs w-3 h-3 flex items-center justify-center"></i>
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t border-slate-800">
        <div
          className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          onMouseEnter={
            isCollapsed
              ? (e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({ label: 'John Doe', top: rect.top + rect.height / 2, left: rect.right + 8 });
                }
              : undefined
          }
          onMouseLeave={isCollapsed ? () => setTooltip(null) : undefined}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">JD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">John Doe</div>
              <div className="text-xs text-slate-400 truncate">Admin</div>
            </div>
          )}
        </div>
      </div>
    </aside>
    {typeof document !== 'undefined' &&
      tooltip &&
      createPortal(
        <div
          className="fixed px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-[9999] border border-slate-700 shadow-lg -translate-y-1/2"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          {tooltip.label}
        </div>,
        document.body
      )}
    </>
  );
}
