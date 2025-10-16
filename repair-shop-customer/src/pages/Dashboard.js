import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    devices: 0,
    activeRepairs: 0,
    completedRepairs: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // For now, mock data since backend isn't ready
      // TODO: Replace with real API calls
      const mockDevices = [
        { id: 1, brand: 'Apple', model: 'MacBook Pro' },
        { id: 2, brand: 'Dell', model: 'XPS 15' },
      ];

      const mockOrders = [
        {
          id: 1,
          device: 'MacBook Pro',
          status: 'in-progress',
          description: 'Screen replacement',
          created_at: '2025-10-15',
        },
        {
          id: 2,
          device: 'Dell XPS 15',
          status: 'completed',
          description: 'Battery replacement',
          created_at: '2025-10-10',
        },
      ];

      setStats({
        devices: mockDevices.length,
        activeRepairs: mockOrders.filter((o) => o.status !== 'completed').length,
        completedRepairs: mockOrders.filter((o) => o.status === 'completed').length,
      });
      setRecentOrders(mockOrders);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your devices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/my-devices" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">My Devices</p>
              <p className="text-3xl font-bold text-purple-600">{stats.devices}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/my-repairs" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Repairs</p>
              <p className="text-3xl font-bold text-blue-600">{stats.activeRepairs}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedRepairs}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/new-request"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-4 hover:from-purple-600 hover:to-blue-600 transition text-center"
          >
            <p className="font-medium">+ Request New Repair</p>
          </Link>
          <Link
            to="/my-repairs"
            className="bg-gray-100 border border-gray-300 rounded-lg p-4 hover:bg-gray-200 transition text-center"
          >
            <p className="font-medium text-gray-700">Track My Repairs</p>
          </Link>
        </div>
      </div>

      {/* Recent Repairs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Repairs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No repair history yet</p>
              <Link to="/new-request" className="text-purple-600 hover:text-purple-500 font-medium mt-2 inline-block">
                Submit your first repair request →
              </Link>
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{order.device}</p>
                    <p className="text-sm text-gray-500">{order.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Submitted: {order.created_at}</p>
                  </div>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;