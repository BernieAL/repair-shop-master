import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Repair Shop Portal</h1>
              {user && (
                <div className="hidden md:flex space-x-4">
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/') ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-devices"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/my-devices') ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    My Devices
                  </Link>
                  <Link
                    to="/my-repairs"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/my-repairs') ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    My Repairs
                  </Link>
                  <Link
                    to="/new-request"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/new-request') ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    New Request
                  </Link>
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user.name || user.email}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;