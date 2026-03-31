import { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import usePermissionStore from '@/store/usePermissionStore';
import { PERMISSIONS_ENUM } from '../types/rightids';
import AuthContext, { fetchLoginEmail } from '@/src/app/services/authservice';

export default function CollapsibleSidebar() {
  const pathname = usePathname();
  const permissions = usePermissionStore((state) => state.permissions);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [profileMenuHeight, setProfileMenuHeight] = useState(0);
  const authContext = useContext(AuthContext);
  const { logout } = authContext || {};

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    setIsCollapsed(saved ? JSON.parse(saved) : false);
  }, []);

  useEffect(() => {
    const userEmail = fetchLoginEmail();
    if (userEmail) setEmail(userEmail);
  }, []);

  useEffect(() => {
    if (profileMenuRef.current) {
      setProfileMenuHeight(isProfileOpen ? profileMenuRef.current.scrollHeight : 0);
    }
  }, [isProfileOpen]);

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
    if (isCollapsed) setIsProfileOpen(false);
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
    { icon: 'ri-box-3-line', label: 'Products', path: '/product', aliasPaths: ['/product'], required: PERMISSIONS_ENUM.PRODUCTS.VIEW },
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
    { icon: 'ri-ship-line', label: 'Shipments', path: '/shipments', required: PERMISSIONS_ENUM.SHIPMENT.VIEW },
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
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
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
        className="absolute -right-3 top-20 w-6 h-6 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-full flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
                      ? 'bg-blue-600/30 text-blue-700 dark:text-white hover:bg-blue-600/40 dark:hover:bg-blue-700 hover:text-blue-800 dark:hover:text-white'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
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
                      ? 'bg-blue-600/30 text-blue-700 dark:text-white hover:bg-blue-600/40 dark:hover:bg-blue-700 hover:text-blue-800 dark:hover:text-white'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
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
                        ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600/30 hover:text-blue-700 dark:hover:text-white'
                        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
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
      <div className="p-3 border-t border-gray-200 dark:border-slate-800">
        <button
          onClick={() => !isCollapsed && setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          onMouseEnter={
            isCollapsed
              ? (e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({ label: 'Admin', top: rect.top + rect.height / 2, left: rect.right + 8 });
                }
              : undefined
          }
          onMouseLeave={isCollapsed ? () => setTooltip(null) : undefined}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-user-3-line text-white text-lg"></i>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin</div>
                <div className="text-xs text-gray-500 dark:text-slate-400 truncate">{email || 'admin@mrp.com'}</div>
              </div>
              <i className={`ri-arrow-${isProfileOpen ? 'down' : 'up'}-s-line text-gray-400 dark:text-slate-400 text-sm w-4 h-4 flex items-center justify-center transition-transform duration-300`}></i>
            </>
          )}
        </button>

        {/* Profile Accordion Menu */}
        {!isCollapsed && (
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: profileMenuHeight }}
          >
            <div ref={profileMenuRef} className="pt-2 space-y-1">
              <Link
                href="/auditlog"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <i className="ri-file-list-line text-lg w-5 h-5 flex items-center justify-center"></i>
                <span className="text-sm font-medium">Audit Log</span>
              </Link>

              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <i className="ri-file-text-line text-lg w-5 h-5 flex items-center justify-center"></i>
                <span className="text-sm font-medium">Product Definition</span>
              </button>

              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <i className="ri-settings-3-line text-lg w-5 h-5 flex items-center justify-center"></i>
                <span className="text-sm font-medium">Admin Setting</span>
              </button>

              <div className="pt-1 border-t border-gray-200 dark:border-slate-800 mt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
                >
                  <i className="ri-logout-box-r-line text-lg w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
    {typeof document !== 'undefined' &&
      tooltip &&
      createPortal(
        <div
          className="fixed px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-[9999] border border-gray-200 dark:border-slate-700 shadow-lg -translate-y-1/2"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          {tooltip.label}
        </div>,
        document.body
      )}
    </>
  );
}
