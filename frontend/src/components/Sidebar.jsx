import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HiOutlineViewGrid, HiOutlineTruck, HiOutlineUsers, HiOutlineSpeakerphone, HiOutlineDocumentReport, HiOutlineUserCircle, HiOutlineMenuAlt2, HiOutlineX } from 'react-icons/hi';

const links = [
  { to: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/vehicles', label: 'Vehicles', icon: HiOutlineTruck },
  { to: '/customers', label: 'Customers', icon: HiOutlineUsers },
  { to: '/promotions', label: 'Promotions', icon: HiOutlineSpeakerphone },
  { to: '/reports', label: 'Reports', icon: HiOutlineDocumentReport },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const filteredLinks = user && (user.role === 'admin' || user.role === 'Admin')
    ? [...links, { to: '/users', label: 'Users', icon: HiOutlineUserCircle }]
    : links;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
      >
        <HiOutlineMenuAlt2 className="w-5 h-5 text-slate-700" />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h1 className="text-lg font-bold text-slate-900">SwiftWheels</h1>
            <p className="text-xs text-gray-500">Promotion System</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <HiOutlineX className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-gray-100'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>


      </aside>
    </>
  );
}
