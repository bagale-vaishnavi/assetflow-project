import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount] = useState(0);

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div className="font-bold text-2xl tracking-tight">AssetFlow</div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 hover:bg-zinc-100 rounded-2xl"
        >
          <Bell size={24} />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-zinc-500 capitalize">{user?.role}</p>
          </div>

          <div className="w-9 h-9 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-semibold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>

        <button
          onClick={logout}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
}