import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiPieChart, FiBriefcase, FiPlusCircle, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: FiPieChart },
    { name: 'Applications', path: '/applications', icon: FiBriefcase },
    { name: 'Add Job', path: '/add-job', icon: FiPlusCircle },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <header className="lg:hidden border-b border-navy-800/80 bg-navy-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        <h1 className="text-lg font-bold tracking-wider text-white">
          Job<span className="text-brand-500">Trackr</span>
        </h1>
      </div>

      {/* Hamburger / Close Icon */}
      <button
        onClick={handleToggle}
        className="text-navy-300 hover:text-white p-2 rounded-lg hover:bg-navy-900 transition-colors"
      >
        {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
      </button>

      {/* Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 top-[69px] z-50 bg-navy-950/95 flex flex-col p-6 animate-fade-in">
          {/* Nav list */}
          <nav className="flex-1 space-y-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                        : 'text-navy-400 hover:text-white hover:bg-navy-900/60'
                    }`
                  }
                >
                  <Icon className="text-xl" />
                  <span className="text-base">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom user details & Logout */}
          <div className="border-t border-navy-800/80 pt-6 mt-auto space-y-4">
            {user && (
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center font-bold text-brand-400 text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{user.name}</h4>
                  <p className="text-xs text-navy-400">{user.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                handleClose();
                logout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all duration-200"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
