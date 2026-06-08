import { useAuth } from '../hooks/useAuth';
import { HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <HiOutlineUserCircle className="w-6 h-6 text-gray-500" />
          <div className="text-sm">
            <p className="font-medium text-slate-900">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <HiOutlineLogout className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
