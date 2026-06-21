import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Package,
  FileText,
  Bell,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: Home, path: '/', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { label: 'Assets', icon: Package, path: '/assets', roles: ['ADMIN'] },
    { label: 'Assign Asset', icon: UserPlus, path: '/admin/assign-asset', roles: ['ADMIN'] },
    { label: 'My Requests', icon: FileText, path: '/requests/my', roles: ['EMPLOYEE'] },
    { label: 'All Requests', icon: FileText, path: '/requests/all', roles: ['MANAGER', 'ADMIN'] },
    { label: 'Notifications', icon: Bell, path: '/notifications', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { label: 'Users', icon: Users, path: '/admin/users', roles: ['ADMIN'] },
  ];

  const filteredMenu = menuItems.filter(item =>
    item.roles.includes(user?.role || '')
  );

  return (
    <div
      className={`h-full bg-white border-r flex flex-col transition-all ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            A
          </div>

          {!collapsed && (
            <span className="font-bold text-xl">AssetFlow</span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-zinc-100 rounded-xl"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-zinc-100'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl text-sm font-medium"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}