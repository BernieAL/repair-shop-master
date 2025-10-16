import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Repair Shop Admin</h1>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/customers"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/customers') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  Customers
                </Link>
                <Link
                  to="/devices"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/devices') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  Devices
                </Link>
                <Link
                  to="/work-orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/work-orders') ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  Work Orders
                </Link>
              </div>
            </div>
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