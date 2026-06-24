import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiPieChart, FiBriefcase, FiPlusCircle, FiUser, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: FiPieChart },
    { name: 'Applications', path: '/applications', icon: FiBriefcase },
    { name: 'Add Job', path: '/add-job', icon: FiPlusCircle },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-navy-800/80 bg-navy-950 p-6 shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-3xl">🎯</span>
        <h1 className="text-xl font-bold tracking-wider text-white">
          Job<span className="text-brand-500">Trackr</span>
        </h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                    : 'text-navy-400 hover:text-white hover:bg-navy-900/60'
                }`
              }
            >
              <Icon className="text-lg" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile card & Logout */}
      <div className="border-t border-navy-800/80 pt-6 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center font-bold text-brand-400 text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
              <p className="text-xs text-navy-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all duration-200"
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
